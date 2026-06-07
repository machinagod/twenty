import { Body, Controller, Get, Post } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Widget } from "./widget.entity.ts";
import { JobsService } from "./jobs.service.ts";

@Controller()
export class AppController {
  // Constructor injection here is the real emitDecoratorMetadata test:
  // Nest reads the param types via reflect-metadata to resolve the DI graph.
  constructor(
    @InjectRepository(Widget)
    private readonly widgetRepo: Repository<Widget>,
    private readonly jobsService: JobsService,
  ) {}

  @Get("/")
  health() {
    return {
      ok: true,
      runtime: "deno",
      onDeploy: Deno.env.get("DENO_DEPLOY") === "1",
    };
  }

  @Get("/widgets")
  listWidgets() {
    return this.widgetRepo.find();
  }

  @Post("/widgets")
  createWidget(@Body() body: { name?: string }) {
    return this.widgetRepo.save(
      this.widgetRepo.create({ name: body?.name ?? "unnamed" }),
    );
  }

  // enqueue → PG row; the Deno.cron heartbeat (or POST /drain) processes it.
  @Post("/jobs")
  enqueue(@Body() body: { name?: string; data?: Record<string, unknown> }) {
    return this.jobsService.enqueue(body?.name ?? "demo", body?.data ?? {});
  }

  @Get("/jobs")
  jobs() {
    return this.jobsService.recent();
  }

  // Manual trigger so we can validate the drain without waiting for the 1-min cron.
  @Post("/drain")
  async drain() {
    const processed = await this.jobsService.drain();
    return { processed };
  }

  // Cold-start proxy for the deferred cache decision: N sequential round-trips
  // approximates rebuilding the workspace-metadata graph from Postgres on a cold
  // isolate. perQueryMs * (#metadata reads) ≈ the cold-start latency tax.
  @Get("/metadata-timing")
  async metadataTiming() {
    const queries = 50;
    const start = performance.now();
    for (let i = 0; i < queries; i++) {
      await this.widgetRepo.query("SELECT 1");
    }
    const totalMs = performance.now() - start;
    return {
      queries,
      totalMs: Math.round(totalMs),
      perQueryMs: Number((totalMs / queries).toFixed(2)),
    };
  }
}
