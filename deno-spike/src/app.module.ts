import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Widget } from "./widget.entity.ts";
import { Job } from "./job.entity.ts";
import { AppController } from "./app.controller.ts";
import { JobsService } from "./jobs.service.ts";

// DATABASE_URL is the only knob. Local spike DB by default; on Deno Deploy this
// is injected automatically when a Prisma Postgres DB is assigned to the app.
const DATABASE_URL = Deno.env.get("DATABASE_URL") ??
  "postgres://postgres:postgres@localhost:5432/deno_spike";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      url: DATABASE_URL,
      entities: [Widget, Job],
      // Fine for the spike; real Twenty uses migrations/instance commands.
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Widget, Job]),
  ],
  controllers: [AppController],
  providers: [JobsService],
})
export class AppModule {}
