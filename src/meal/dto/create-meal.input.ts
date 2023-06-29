import { ICreateDto } from "@/common/interface";
import { Field, InputType } from "@nestjs/graphql";
import { Meal } from "../meal.entity";
import { ScalarMealType, TypeMealType } from "@/interfaces/scalar";
import { v4 } from "uuid";

@InputType()
export class CreateMealInput implements ICreateDto<Meal> {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String)
  loginId: string;

  @Field(() => String)
  loginPassword: string;

  @Field(() => ScalarMealType)
  mealType: TypeMealType;

  @Field(() => Boolean, { nullable: true, defaultValue: false })
  wantToReserve: boolean;

  toEntity(): Meal {
    return new Meal({
      ...this,
      id: v4()
    });
  }
}
