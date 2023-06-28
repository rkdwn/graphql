import { Injectable } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Meal, MealDocument } from "./meal.entity";
import { MealService } from "./meal.service";
import { DeleteMealInput } from "./dto/delete-meal.input";
import { SearchMealInput } from "./dto/search-meal.input";
import { CreateMealInput } from "./dto/create-meal.input";
import { UpdateMealInput } from "./dto/update-meal.input";

@Injectable()
@Resolver(() => Meal)
export class MealResolver {
  constructor(private readonly mealService: MealService) {}

  @Query(() => Meal)
  async getMeal(
    @Args("findOneInput")
    findOneInput: DeleteMealInput
  ): Promise<MealDocument> {
    return await this.mealService.findOne(findOneInput);
  }

  @Query(() => [Meal])
  async searchMeals(
    @Args("searchMealsInput")
    searchMealsInput: SearchMealInput
  ): Promise<MealDocument[]> {
    return await this.mealService.findAll(searchMealsInput);
  }

  @Mutation(() => Meal)
  async createMeal(
    @Args("createMealInput")
    createMealInput: CreateMealInput
  ): Promise<MealDocument> {
    const _ret = await this.mealService.create(createMealInput.toEntity());
    return _ret;
  }

  @Mutation(() => Meal)
  async updateMeal(
    @Args("updateMealInput")
    updateMealInput: UpdateMealInput
  ): Promise<MealDocument> {
    const _ret = await this.mealService.update(updateMealInput);
    return _ret;
  }

  @Mutation(() => Meal)
  async deleteMeal(
    @Args("deleteMealInput")
    deleteMealInput: DeleteMealInput
  ): Promise<MealDocument> {
    const _ret = await this.mealService.delete(deleteMealInput);
    return _ret;
  }
}
