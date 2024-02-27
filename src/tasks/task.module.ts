import { Meal, MealSchema } from "@/meal/meal.entity";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";
import { ConfigModule } from "@nestjs/config";
import { StorageModule } from "@/common/storage/storage.module";
import { FilesModule } from "@/files/files.module";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meal.name, schema: MealSchema, collection: Meal.name }
    ]),
    ScheduleModule.forRoot(),
    ConfigModule,
    StorageModule,
    FilesModule
  ],
  providers: [TaskService]
})
export class TaskModule {}
