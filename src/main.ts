import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: "1mb" }));
  await app.listen(8000, "0.0.0.0");
}
bootstrap();
