import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Meal, MealSchema } from "./meal.entity";
import { MealResolver } from "./meal.resolver";
import { MealService } from "./meal.service";
import { MEAL_FILTER, MealFilter } from "./meal.filter";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meal.name, schema: MealSchema, collection: Meal.name }
    ])
  ],
  providers: [
    MealResolver,
    MealService,
    { provide: MEAL_FILTER, useClass: MealFilter }
  ],
  exports: [MealService]
})
export class MealModule {}
