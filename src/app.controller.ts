import { Controller, Get, HttpCode } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/favicon.ico")
  @HttpCode(204)
  getFavicon(): string {
    return "test";
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
