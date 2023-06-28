import { Field, InputType, PartialType } from "@nestjs/graphql";
import { CreateMealInput } from "./create-meal.input";

@InputType()
export class UpdateMealInput extends PartialType(CreateMealInput) {
  @Field(() => String)
  id: string;
}
