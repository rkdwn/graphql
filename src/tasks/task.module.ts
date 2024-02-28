import { StorageModule } from "@/common/storage/storage.module";
import { Meal, MealSchema } from "@/meal/meal.entity";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { ScheduleModule } from "@nestjs/schedule";
import { TaskService } from "./task.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meal.name, schema: MealSchema, collection: Meal.name }
    ]),
    ScheduleModule.forRoot(),
    ConfigModule,
    StorageModule
  ],
  providers: [TaskService]
})
export class TaskModule {}
