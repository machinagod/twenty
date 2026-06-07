import { Column, Entity, PrimaryColumn } from "typeorm";

// A trivial entity. Its only job is to prove TypeORM decorators + synchronize
// work under Deno's transpiler (experimentalDecorators + emitDecoratorMetadata).
@Entity({ name: "widget" })
export class Widget {
  // gen_random_uuid() is Postgres core (>=13) — no uuid-ossp extension needed,
  // which a managed Prisma Postgres DB may not let us install.
  @PrimaryColumn({ type: "uuid", default: () => "gen_random_uuid()" })
  id!: string;

  @Column({ type: "varchar" })
  name!: string;

  @Column({ type: "int", default: 0 })
  count!: number;
}
