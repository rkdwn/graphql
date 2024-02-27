import { Module } from "@nestjs/common";
import { FilesController } from "./files.controller";
import { StorageModule } from "@/common/storage/storage.module";
import { FilesService } from "./files.service";

@Module({
  imports: [StorageModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService]
})
export class FilesModule {}
