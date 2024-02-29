import { StorageService } from "@/common/storage/storage.service";
import { Controller, Get, Inject, StreamableFile } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { TestService } from "./test.service";

@Controller("/test")
export class TestController {
  constructor(
    private readonly storageService: StorageService,
    private readonly testService: TestService
  ) {}

  @Get("/")
  async getConfigFile(req: Request, res: Response, next: NextFunction) {
    const resultStream = await this.storageService.getObject(
      "config",
      "config"
    );
    return new StreamableFile(resultStream);
  }

  @Get("/pdf-test")
  async generatePDF(req: Request, res: Response, next: NextFunction) {
    const result = await this.testService.captureTest();
    return res.status(200).send(result);
  }
}
