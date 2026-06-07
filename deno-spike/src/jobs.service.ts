import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Job } from "./job.entity.ts";

// Stand-in for the real MessageQueueDriver + message-queue.explorer wiring.
// enqueue() === driver.add(); the handler Map === what work() registers per @Processor;
// drain() === what the Deno.cron heartbeat calls each tick.
@Injectable()
export class JobsService {
  private readonly logger = new Logger("JobsService");
  private readonly handlers = new Map<
    string,
    (data: Record<string, unknown>) => Promise<void> | void
  >();

  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {
    // In real Twenty this registration is driven by the @Processor decorator scan.
    this.handlers.set("demo", (data) => {
      this.logger.log(`processed demo job: ${JSON.stringify(data)}`);
    });
  }

  async enqueue(name: string, data: Record<string, unknown>) {
    const job = this.jobRepo.create({
      queue: "default",
      name,
      data,
      status: "pending",
      runAt: new Date(),
    });
    return await this.jobRepo.save(job);
  }

  async recent() {
    return await this.jobRepo.find({ order: { createdAt: "DESC" }, take: 20 });
  }

  // The PG-as-queue drain: a bounded, idempotent batch claimed with
  // FOR UPDATE SKIP LOCKED so concurrent ticks/isolates never double-process.
  async drain(batchSize = 10): Promise<number> {
    return await this.jobRepo.manager.transaction(async (em) => {
      const rows: Array<{ id: string; name: string; data: Record<string, unknown> }> =
        await em.query(
          `SELECT id, name, data FROM job
           WHERE status = 'pending' AND run_at <= now()
           ORDER BY run_at
           LIMIT $1
           FOR UPDATE SKIP LOCKED`,
          [batchSize],
        );

      for (const row of rows) {
        const handler = this.handlers.get(row.name);
        try {
          if (handler) await handler(row.data);
          await em.query(
            `UPDATE job SET status='done', attempts=attempts+1 WHERE id=$1`,
            [row.id],
          );
        } catch (error) {
          await em.query(
            `UPDATE job SET status='failed', attempts=attempts+1 WHERE id=$1`,
            [row.id],
          );
          this.logger.error(`job ${row.id} failed: ${error}`);
        }
      }
      return rows.length;
    });
  }
}
