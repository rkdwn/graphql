import { BaseService } from "@/common/base.service";
import { Inject, Injectable } from "@nestjs/common";
import { Meal, MealDocument } from "./meal.entity";
import { UpdateMealInput } from "./dto/update-meal.input";
import { DeleteMealInput } from "./dto/delete-meal.input";
import { SearchMealInput } from "./dto/search-meal.input";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MEAL_FILTER } from "./meal.filter";
import { BaseFilter } from "@/common/base.filter";

@Injectable()
export class MealService extends BaseService<
  Meal,
  UpdateMealInput,
  DeleteMealInput,
  SearchMealInput
> {
  constructor(
    @InjectModel(Meal.name)
    private readonly mealModel: Model<MealDocument>,

    @Inject(MEAL_FILTER)
    filter: BaseFilter<SearchMealInput>
  ) {
    super(Meal, mealModel, ["id"], filter);
  }
}
