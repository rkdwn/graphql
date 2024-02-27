import { StorageService } from "@/common/storage/storage.service";
import { Controller, Get, Inject, StreamableFile } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Controller("/test")
export class TestController {
  constructor(private readonly storageService: StorageService) {}

  @Get()
  async getConfigFile(req: Request, res: Response, next: NextFunction) {
    const resultStream = await this.storageService.getObject(
      "config",
      "config"
    );
    return new StreamableFile(resultStream);
  }
}
