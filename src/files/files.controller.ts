import { Controller, Get } from "@nestjs/common";
import { FilesService } from "./files.service";

@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get("/:loginId")
  async getPDF(loginId: string) {
    return await this.filesService.getPDF(loginId);
  }
}
