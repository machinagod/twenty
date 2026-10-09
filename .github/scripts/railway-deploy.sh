#!/usr/bin/env bash
# GraphQL operations reference their own variables ($id, $serviceId, ...), which
# must stay literal inside single quotes.
# shellcheck disable=SC2016
# Deploys the Twenty server and worker on Railway through the public GraphQL API.
#
# Usage: railway-deploy.sh routine|upgrade
#
#   routine  fresh deployment of the server, then the worker
#   upgrade  for an upstream sync that runs migrations on server boot: raise the
#            server health-check timeout so Railway does not kill the boot
#            upgrade, stop the worker, deploy the server and wait for it, always
#            put the health-check timeout back, and only then deploy the worker
#
# Fresh deployments (serviceInstanceDeployV2) are used instead of `railway
# redeploy`, which reuses the previous deployment's settings snapshot and so
# ignores a changed health-check timeout.
#
# Env: RAILWAY_TOKEN (project token scoped to one environment, required).
# Optional: RAILWAY_API_URL, SERVER_SERVICE_NAME, WORKER_SERVICE_NAME,
# UPGRADE_HEALTHCHECK_TIMEOUT_SECONDS, ROUTINE_HEALTHCHECK_TIMEOUT_SECONDS,
# SERVER_DEPLOY_DEADLINE_SECONDS, WORKER_DEPLOY_DEADLINE_SECONDS,
# POLL_INTERVAL_SECONDS.

set -euo pipefail


MODE="${1:-}"
RAILWAY_API_URL="${RAILWAY_API_URL:-https://backboard.railway.com/graphql/v2}"
SERVER_SERVICE_NAME="${SERVER_SERVICE_NAME:-Twenty}"
WORKER_SERVICE_NAME="${WORKER_SERVICE_NAME:-Twenty Worker}"
UPGRADE_HEALTHCHECK_TIMEOUT_SECONDS="${UPGRADE_HEALTHCHECK_TIMEOUT_SECONDS:-3600}"
ROUTINE_HEALTHCHECK_TIMEOUT_SECONDS="${ROUTINE_HEALTHCHECK_TIMEOUT_SECONDS:-300}"
SERVER_DEPLOY_DEADLINE_SECONDS="${SERVER_DEPLOY_DEADLINE_SECONDS:-4200}"
WORKER_DEPLOY_DEADLINE_SECONDS="${WORKER_DEPLOY_DEADLINE_SECONDS:-900}"
POLL_INTERVAL_SECONDS="${POLL_INTERVAL_SECONDS:-30}"

log() {
  printf '[railway-deploy] %s\n' "$*" >&2
}

fail() {
  log "ERROR: $*"
  exit 1
}

# Runs a GraphQL operation and prints its `data` object; fails on any error.
graphql() {
  local query="$1"
  local variables="${2:-}"
  local payload response

  [ -n "$variables" ] || variables='{}'
  payload=$(jq -n --arg query "$query" --argjson variables "$variables" \
    '{query: $query, variables: $variables}')
  response=$(curl -sS --fail-with-body -X POST "$RAILWAY_API_URL" \
    -H "Project-Access-Token: ${RAILWAY_TOKEN}" \
    -H 'Content-Type: application/json' \
    --data "$payload")

  if [ "$(jq '.errors // [] | length' <<<"$response")" != "0" ]; then
    fail "Railway API error: $(jq -c '.errors' <<<"$response")"
  fi

  jq -c '.data' <<<"$response"
}

resolve_context() {
  local token_data project_data

  token_data=$(graphql 'query { projectToken { projectId environmentId } }')
  PROJECT_ID=$(jq -r '.projectToken.projectId' <<<"$token_data")
  ENVIRONMENT_ID=$(jq -r '.projectToken.environmentId' <<<"$token_data")

  project_data=$(graphql \
    'query project($id: String!) { project(id: $id) { services { edges { node { id name } } } } }' \
    "$(jq -n --arg id "$PROJECT_ID" '{id: $id}')")
  SERVER_SERVICE_ID=$(service_id_by_name "$project_data" "$SERVER_SERVICE_NAME")
  WORKER_SERVICE_ID=$(service_id_by_name "$project_data" "$WORKER_SERVICE_NAME")
}

service_id_by_name() {
  local project_data="$1" name="$2" id

  id=$(jq -r --arg name "$name" \
    '.project.services.edges[].node | select(.name == $name) | .id' <<<"$project_data")
  [ -n "$id" ] || fail "service \"$name\" not found in project"
  printf '%s' "$id"
}

set_healthcheck_timeout() {
  local service_id="$1" seconds="$2"

  graphql \
    'mutation update($serviceId: String!, $environmentId: String!, $input: ServiceInstanceUpdateInput!) { serviceInstanceUpdate(serviceId: $serviceId, environmentId: $environmentId, input: $input) }' \
    "$(jq -n --arg serviceId "$service_id" --arg environmentId "$ENVIRONMENT_ID" \
      --argjson seconds "$seconds" \
      '{serviceId: $serviceId, environmentId: $environmentId, input: {healthcheckTimeout: $seconds}}')" \
    >/dev/null
  log "health-check timeout set to ${seconds}s"
}

deploy_service() {
  local service_id="$1"

  graphql \
    'mutation deploy($serviceId: String!, $environmentId: String!) { serviceInstanceDeployV2(serviceId: $serviceId, environmentId: $environmentId) }' \
    "$(jq -n --arg serviceId "$service_id" --arg environmentId "$ENVIRONMENT_ID" \
      '{serviceId: $serviceId, environmentId: $environmentId}')" |
    jq -r '.serviceInstanceDeployV2'
}

# Prints the final status of a deployment, or TIMEOUT once the deadline passes.
wait_for_deployment() {
  local deployment_id="$1" deadline_seconds="$2" started status

  started=$(date +%s)
  while true; do
    status=$(graphql \
      'query deployment($id: String!) { deployment(id: $id) { status } }' \
      "$(jq -n --arg id "$deployment_id" '{id: $id}')" | jq -r '.deployment.status') ||
      status="API_ERROR"

    case "$status" in
      SUCCESS | FAILED | CRASHED | REMOVED | SKIPPED | API_ERROR)
        printf '%s' "$status"
        return
        ;;
    esac

    if [ $(($(date +%s) - started)) -ge "$deadline_seconds" ]; then
      printf 'TIMEOUT'
      return
    fi

    log "deployment ${deployment_id}: ${status}"
    sleep "$POLL_INTERVAL_SECONDS"
  done
}

stop_worker() {
  local deployments deployment_id

  deployments=$(graphql \
    'query deployments($input: DeploymentListInput!) { deployments(input: $input, first: 1) { edges { node { id } } } }' \
    "$(jq -n --arg projectId "$PROJECT_ID" --arg serviceId "$WORKER_SERVICE_ID" \
      --arg environmentId "$ENVIRONMENT_ID" \
      '{input: {projectId: $projectId, serviceId: $serviceId, environmentId: $environmentId, status: {successfulOnly: true}}}')")
  deployment_id=$(jq -r '.deployments.edges[0].node.id // empty' <<<"$deployments")

  if [ -z "$deployment_id" ]; then
    log "worker has no active deployment, nothing to stop"
    return
  fi

  graphql 'mutation stop($id: String!) { deploymentStop(id: $id) }' \
    "$(jq -n --arg id "$deployment_id" '{id: $id}')" >/dev/null
  log "worker deployment ${deployment_id} stopped"
}

deploy_and_wait() {
  local label="$1" service_id="$2" deadline_seconds="$3" deployment_id status

  # Called from `if !`/`||`, where set -e is suspended, so failures are explicit.
  deployment_id=$(deploy_service "$service_id") || return 1
  [ -n "$deployment_id" ] && [ "$deployment_id" != "null" ] || return 1
  log "${label} deployment ${deployment_id} started"
  status=$(wait_for_deployment "$deployment_id" "$deadline_seconds")
  log "${label} deployment ${deployment_id}: ${status}"
  [ "$status" = "SUCCESS" ]
}

restore_server_healthcheck() {
  set_healthcheck_timeout "$SERVER_SERVICE_ID" "$ROUTINE_HEALTHCHECK_TIMEOUT_SECONDS"
}

run_routine() {
  deploy_and_wait server "$SERVER_SERVICE_ID" "$SERVER_DEPLOY_DEADLINE_SECONDS" ||
    fail "server deployment did not succeed"
  deploy_and_wait worker "$WORKER_SERVICE_ID" "$WORKER_DEPLOY_DEADLINE_SECONDS" ||
    fail "worker deployment did not succeed"
}

run_upgrade() {
  # Railway's default 300s health check kills the container mid-upgrade, which
  # leaves orphaned Postgres sessions holding locks that block every retry.
  # Raised before anything else so a refused update leaves nothing changed.
  set_healthcheck_timeout "$SERVER_SERVICE_ID" "$UPGRADE_HEALTHCHECK_TIMEOUT_SECONDS"
  trap restore_server_healthcheck EXIT

  stop_worker

  if ! deploy_and_wait server "$SERVER_SERVICE_ID" "$SERVER_DEPLOY_DEADLINE_SECONDS"; then
    fail "server upgrade deployment did not succeed; the worker stays stopped. Check the server logs for the failing upgrade step, and pg_stat_activity for orphaned upgrade queries still holding locks before retrying."
  fi

  deploy_and_wait worker "$WORKER_SERVICE_ID" "$WORKER_DEPLOY_DEADLINE_SECONDS" ||
    fail "worker deployment did not succeed"
}

main() {
  [ -n "${RAILWAY_TOKEN:-}" ] || fail "RAILWAY_TOKEN is not set"

  case "$MODE" in
    routine | upgrade) ;;
    *) fail "usage: $0 routine|upgrade" ;;
  esac

  resolve_context
  log "project ${PROJECT_ID}, environment ${ENVIRONMENT_ID}, mode ${MODE}"

  if [ "$MODE" = "upgrade" ]; then
    run_upgrade
  else
    run_routine
  fi

  log "done"
}

main "$@"
