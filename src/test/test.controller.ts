import { StorageService } from "@/common/storage/storage.service";
import {
  Controller,
  Get,
  Inject,
  Request,
  Response,
  StreamableFile
} from "@nestjs/common";
import { NextFunction, Request as Req, Response as Res } from "express";
import { TestService } from "./test.service";

@Controller("/test")
export class TestController {
  constructor(
    private readonly storageService: StorageService,
    private readonly testService: TestService
  ) {}

  @Get("/")
  async getConfigFile(
    @Request() req: Req,
    @Response() res: Response,
    next: NextFunction
  ) {
    const resultStream = await this.storageService.getObject(
      "config",
      "config"
    );
    return new StreamableFile(resultStream);
  }

  @Get("/pdf-test")
  async generatePDF(
    @Request() req: Req,
    @Response() res: Response,
    next: NextFunction
  ) {
    const result = await this.testService.captureTest();
    return result;
  }
}
