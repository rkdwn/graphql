import { Module } from "@nestjs/common";
import { BotController } from "./bot.controller";
import { BotService } from "./bot.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Meal, MealSchema } from "@/meal/meal.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Meal.name, schema: MealSchema, collection: Meal.name }
    ])
  ],
  controllers: [BotController],
  providers: [BotService],
  exports: []
})
export class BotModule {}
