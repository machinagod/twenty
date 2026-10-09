#!/usr/bin/env bash
# Tests railway-deploy.sh against a stub `curl` that answers the Railway GraphQL
# operations and records the calls, so no request ever reaches Railway.
#
# Usage: .github/scripts/railway-deploy.test.sh

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
DEPLOY_SCRIPT="$SCRIPT_DIR/railway-deploy.sh"
FAILURES=0

# Stub curl: reads the --data payload, logs "<operation> <variables>" and replies.
# Server deployment statuses come from $STUB_DIR/server-statuses (one per poll).
write_stub_curl() {
  cat >"$STUB_DIR/bin/curl" <<'STUB'
#!/usr/bin/env bash
payload=""
while [ $# -gt 0 ]; do
  if [ "$1" = "--data" ]; then payload="$2"; shift; fi
  shift
done
query=$(jq -r '.query' <<<"$payload")
variables=$(jq -c '.variables' <<<"$payload")

next_status() {
  local file="$STUB_DIR/$1-statuses" status
  status=$(head -n 1 "$file")
  if [ "$(wc -l <"$file")" -gt 1 ]; then sed -i.bak '1d' "$file"; fi
  printf '%s' "$status"
}

case "$query" in
  *projectToken*)
    echo projectToken >>"$STUB_DIR/calls"
    echo '{"data":{"projectToken":{"projectId":"project-1","environmentId":"environment-1"}}}' ;;
  *"project(id"*)
    echo project >>"$STUB_DIR/calls"
    echo "{\"data\":{\"project\":{\"services\":{\"edges\":[{\"node\":{\"id\":\"server-1\",\"name\":\"Twenty\"}},{\"node\":{\"id\":\"worker-1\",\"name\":\"${STUB_WORKER_NAME:-Twenty Worker}\"}}]}}}}" ;;
  *"deployments(input"*)
    echo "deployments $(jq -r '.input.serviceId' <<<"$variables")" >>"$STUB_DIR/calls"
    echo '{"data":{"deployments":{"edges":[{"node":{"id":"worker-deployment-old"}}]}}}' ;;
  *deploymentStop*)
    echo "deploymentStop $(jq -r '.id' <<<"$variables")" >>"$STUB_DIR/calls"
    echo '{"data":{"deploymentStop":true}}' ;;
  *serviceInstanceUpdate*)
    echo "serviceInstanceUpdate $(jq -r '.serviceId' <<<"$variables") $(jq -r '.input.healthcheckTimeout' <<<"$variables")" >>"$STUB_DIR/calls"
    if [ -n "${STUB_UPDATE_ERROR:-}" ]; then
      echo '{"errors":[{"message":"Not Authorized"}]}'
    else
      echo '{"data":{"serviceInstanceUpdate":true}}'
    fi ;;
  *serviceInstanceDeployV2*)
    service_id=$(jq -r '.serviceId' <<<"$variables")
    echo "serviceInstanceDeployV2 $service_id" >>"$STUB_DIR/calls"
    if [ "${STUB_DEPLOY_ERROR:-}" = "$service_id" ]; then
      echo '{"errors":[{"message":"Not Authorized"}]}'
    else
      echo "{\"data\":{\"serviceInstanceDeployV2\":\"${service_id}-deployment\"}}"
    fi ;;
  *"deployment(id"*)
    deployment_id=$(jq -r '.id' <<<"$variables")
    status=$(next_status "${deployment_id%%-*}")
    echo "deployment $deployment_id $status" >>"$STUB_DIR/calls"
    echo "{\"data\":{\"deployment\":{\"status\":\"$status\"}}}" ;;
  *)
    echo "unexpected query: $query" >&2
    exit 1 ;;
esac
STUB
  chmod +x "$STUB_DIR/bin/curl"
}

setup() {
  STUB_DIR=$(mktemp -d)
  export STUB_DIR
  mkdir -p "$STUB_DIR/bin"
  write_stub_curl
  printf 'SUCCESS\n' >"$STUB_DIR/server-statuses"
  printf 'SUCCESS\n' >"$STUB_DIR/worker-statuses"
  : >"$STUB_DIR/calls"
  unset STUB_DEPLOY_ERROR STUB_UPDATE_ERROR STUB_WORKER_NAME
}

teardown() {
  rm -rf "$STUB_DIR"
}

run_deploy() {
  set +e
  PATH="$STUB_DIR/bin:$PATH" RAILWAY_TOKEN="${TEST_TOKEN-test-token}" \
    POLL_INTERVAL_SECONDS=0 "$DEPLOY_SCRIPT" "$@" >"$STUB_DIR/output" 2>&1
  EXIT_CODE=$?
  set -e
}

assert_calls() {
  local name="$1" expected="$2" actual
  actual=$(cat "$STUB_DIR/calls")
  if [ "$actual" != "$expected" ]; then
    printf 'FAIL %s: unexpected calls\n--- expected\n%s\n--- actual\n%s\n--- output\n%s\n' \
      "$name" "$expected" "$actual" "$(cat "$STUB_DIR/output")"
    FAILURES=$((FAILURES + 1))
    return 1
  fi
}

assert_exit_code() {
  local name="$1" expected="$2"
  if [ "$EXIT_CODE" != "$expected" ]; then
    printf 'FAIL %s: exit code %s, expected %s\n%s\n' \
      "$name" "$EXIT_CODE" "$expected" "$(cat "$STUB_DIR/output")"
    FAILURES=$((FAILURES + 1))
    return 1
  fi
}

assert_output_contains() {
  local name="$1" expected="$2"
  if ! grep -qF "$expected" "$STUB_DIR/output"; then
    printf 'FAIL %s: output lacks "%s"\n%s\n' "$name" "$expected" "$(cat "$STUB_DIR/output")"
    FAILURES=$((FAILURES + 1))
    return 1
  fi
}

it() {
  local name="$1"
  shift
  setup
  if "$@"; then printf 'ok   %s\n' "$name"; fi
  teardown
}

should_stop_worker_raise_healthcheck_and_restore_it_on_upgrade_success() {
  printf 'DEPLOYING\nDEPLOYING\nSUCCESS\n' >"$STUB_DIR/server-statuses"
  run_deploy upgrade
  assert_exit_code upgrade-success 0 &&
    assert_calls upgrade-success "projectToken
project
serviceInstanceUpdate server-1 3600
deployments worker-1
deploymentStop worker-deployment-old
serviceInstanceDeployV2 server-1
deployment server-1-deployment DEPLOYING
deployment server-1-deployment DEPLOYING
deployment server-1-deployment SUCCESS
serviceInstanceDeployV2 worker-1
deployment worker-1-deployment SUCCESS
serviceInstanceUpdate server-1 300"
}

should_keep_worker_stopped_and_restore_healthcheck_when_upgrade_fails() {
  printf 'DEPLOYING\nFAILED\n' >"$STUB_DIR/server-statuses"
  run_deploy upgrade
  assert_exit_code upgrade-failure 1 &&
    assert_output_contains upgrade-failure "the worker stays stopped" &&
    assert_calls upgrade-failure "projectToken
project
serviceInstanceUpdate server-1 3600
deployments worker-1
deploymentStop worker-deployment-old
serviceInstanceDeployV2 server-1
deployment server-1-deployment DEPLOYING
deployment server-1-deployment FAILED
serviceInstanceUpdate server-1 300"
}

should_restore_healthcheck_when_server_deploy_request_is_rejected() {
  export STUB_DEPLOY_ERROR=server-1
  run_deploy upgrade
  assert_exit_code upgrade-deploy-rejected 1 &&
    assert_calls upgrade-deploy-rejected "projectToken
project
serviceInstanceUpdate server-1 3600
deployments worker-1
deploymentStop worker-deployment-old
serviceInstanceDeployV2 server-1
serviceInstanceUpdate server-1 300"
}

should_change_nothing_when_the_healthcheck_update_is_refused() {
  export STUB_UPDATE_ERROR=1
  run_deploy upgrade
  assert_exit_code upgrade-update-refused 1 &&
    assert_output_contains upgrade-update-refused "Not Authorized" &&
    assert_calls upgrade-update-refused "projectToken
project
serviceInstanceUpdate server-1 3600"
}

should_time_out_a_server_deployment_that_never_settles() {
  printf 'DEPLOYING\n' >"$STUB_DIR/server-statuses"
  set +e
  PATH="$STUB_DIR/bin:$PATH" RAILWAY_TOKEN=test-token POLL_INTERVAL_SECONDS=0 \
    SERVER_DEPLOY_DEADLINE_SECONDS=0 "$DEPLOY_SCRIPT" upgrade >"$STUB_DIR/output" 2>&1
  EXIT_CODE=$?
  set -e
  assert_exit_code upgrade-timeout 1 &&
    assert_output_contains upgrade-timeout "server-1-deployment: TIMEOUT" &&
    assert_output_contains upgrade-timeout "health-check timeout set to 300s"
}

should_deploy_server_then_worker_without_touching_settings_on_routine() {
  run_deploy routine
  assert_exit_code routine 0 &&
    assert_calls routine "projectToken
project
serviceInstanceDeployV2 server-1
deployment server-1-deployment SUCCESS
serviceInstanceDeployV2 worker-1
deployment worker-1-deployment SUCCESS"
}

should_not_deploy_the_worker_when_routine_server_deploy_fails() {
  printf 'CRASHED\n' >"$STUB_DIR/server-statuses"
  run_deploy routine
  assert_exit_code routine-failure 1 &&
    assert_calls routine-failure "projectToken
project
serviceInstanceDeployV2 server-1
deployment server-1-deployment CRASHED"
}

should_fail_when_a_service_is_missing() {
  export STUB_WORKER_NAME="Something Else"
  run_deploy routine
  assert_exit_code missing-service 1 &&
    assert_output_contains missing-service 'service "Twenty Worker" not found'
}

should_reject_an_unknown_mode() {
  run_deploy rollback
  assert_exit_code unknown-mode 1 &&
    assert_output_contains unknown-mode "usage:" &&
    assert_calls unknown-mode ""
}

should_require_a_token() {
  TEST_TOKEN="" run_deploy routine
  assert_exit_code missing-token 1 &&
    assert_output_contains missing-token "RAILWAY_TOKEN is not set" &&
    assert_calls missing-token ""
}

it "upgrade: stops worker, raises then restores health check" should_stop_worker_raise_healthcheck_and_restore_it_on_upgrade_success
it "upgrade: failed server keeps worker stopped" should_keep_worker_stopped_and_restore_healthcheck_when_upgrade_fails
it "upgrade: rejected deploy request still restores health check" should_restore_healthcheck_when_server_deploy_request_is_rejected
it "upgrade: refused health-check update changes nothing" should_change_nothing_when_the_healthcheck_update_is_refused
it "upgrade: unsettled server deployment times out" should_time_out_a_server_deployment_that_never_settles
it "routine: deploys server then worker" should_deploy_server_then_worker_without_touching_settings_on_routine
it "routine: failed server skips worker" should_not_deploy_the_worker_when_routine_server_deploy_fails
it "fails on a missing service" should_fail_when_a_service_is_missing
it "rejects an unknown mode" should_reject_an_unknown_mode
it "requires a token" should_require_a_token

if [ "$FAILURES" -gt 0 ]; then
  printf '%s test(s) failed\n' "$FAILURES"
  exit 1
fi
printf 'all tests passed\n'
