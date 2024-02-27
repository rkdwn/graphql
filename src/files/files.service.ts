import { StorageService } from "@/common/storage/storage.service";
import { Injectable, StreamableFile } from "@nestjs/common";

@Injectable()
export class FilesService {
  constructor(private readonly storageService: StorageService) {}

  async getPDF(loginId: string) {
    const resultStream = await this.storageService.getObject("meals", loginId);
    return new StreamableFile(resultStream);
  }
}
