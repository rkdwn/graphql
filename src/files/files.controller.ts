import { Controller, Get, Param } from "@nestjs/common";
import { FilesService } from "./files.service";

@Controller("/files")
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get("/:loginId")
  async getPDF(@Param("loginId") loginId: string) {
    return await this.filesService.getPDF(loginId);
  }
}
