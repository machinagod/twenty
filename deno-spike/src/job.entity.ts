import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm";

// This is the heart of the PG-as-queue model. In real Twenty this row-set is what
// the MessageQueueDriver writes to and what the Deno.cron heartbeat drains.
// Column names are explicit snake_case so the raw SKIP LOCKED query matches.
@Entity({ name: "job" })
export class Job {
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "varchar", name: "queue", default: "default" })
  queue!: string;

  @Column({ type: "varchar", name: "name" })
  name!: string;

  @Column({ type: "jsonb", name: "data", default: {} })
  data!: Record<string, unknown>;

  // pending | done | failed
  @Column({ type: "varchar", name: "status", default: "pending" })
  status!: string;

  @Column({ type: "int", name: "attempts", default: 0 })
  attempts!: number;

  @Index()
  @Column({ type: "timestamptz", name: "run_at" })
  runAt!: Date;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;
}
