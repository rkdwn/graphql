import { Module } from "@nestjs/common";
import { TestController } from "./test.controller";
import { TestService } from "./test.service";
import { StorageModule } from "@/common/storage/storage.module";

@Module({
  imports: [StorageModule],
  controllers: [TestController],
  providers: [TestService],
  exports: []
})
export class TestModule {}
