import { Meal, MealSchema } from "@/meal/meal.entity";
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TaskService } from "./task.service";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meal.name, schema: MealSchema, collection: Meal.name }
    ]),
    ScheduleModule.forRoot()
  ],
  providers: [TaskService]
})
export class TaskModule {}
