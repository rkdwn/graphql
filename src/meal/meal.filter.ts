import { BaseFilter } from "@/common/base.filter";
import { MealArgsInput, SearchMealInput } from "./dto/search-meal.input";
import { FilterQuery } from "mongoose";

export const MEAL_FILTER = Symbol("MealFilter");

export class MealFilter extends BaseFilter<SearchMealInput> {
  toFilter(searchDto: SearchMealInput): FilterQuery<MealArgsInput> {
    const args = searchDto.args;
    const comparison = searchDto.comparison;
    const _conditions: Record<string, any> = {};

    _conditions.mealType = args.mealType;
    _conditions.name = args.name;
    _conditions.loginId = args.loginId;
    _conditions.wantToReserve = args.wantToReserve;
    _conditions.createdAt = this.toDateRange(args.createdAt);
    _conditions.updatedAt = this.toDateRange(args.updatedAt);

    const conditions = this.removeNullValue(_conditions);

    return this.toComparision(comparison, conditions, []);
  }
}
