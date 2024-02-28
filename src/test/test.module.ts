import { Module } from "@nestjs/common";
import { TestController } from "./test.controller";
import { TestService } from "./test.service";
import { StorageModule } from "@/common/storage/storage.module";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { MongooseModule } from "@nestjs/mongoose";
import { Meal, MealSchema } from "@/meal/meal.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meal.name, schema: MealSchema, collection: Meal.name }
    ]),
    ScheduleModule.forRoot(),
    StorageModule,
    ConfigModule
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: []
})
export class TestModule {}
