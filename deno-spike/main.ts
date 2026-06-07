import "reflect-metadata";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./src/app.module.ts";
import { JobsService } from "./src/jobs.service.ts";

const logger = new Logger("Bootstrap");

// Deno.cron must be registered at module top-level, so register it first and
// resolve the service lazily once Nest has booted. On Deploy v2 cron is enabled;
// locally it requires --unstable-cron.
let jobsServiceRef: JobsService | null = null;

if (typeof Deno.cron === "function") {
  Deno.cron("drain-jobs", "* * * * *", async () => {
    if (!jobsServiceRef) return;
    const processed = await jobsServiceRef.drain();
    if (processed > 0) logger.log(`cron drained ${processed} job(s)`);
  });
  logger.log("Deno.cron heartbeat registered (every minute)");
} else {
  logger.warn("Deno.cron unavailable — start with --unstable-cron");
}

const app = await NestFactory.create(AppModule);
jobsServiceRef = app.get(JobsService);

const port = Number(Deno.env.get("PORT") ?? 3001);
await app.listen(port);
logger.log(`API listening on http://localhost:${port}`);
