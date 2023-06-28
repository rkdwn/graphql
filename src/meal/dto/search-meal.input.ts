import { BaseInput } from "@/common/base.input";
import { DateInput } from "@/common/date.input";
import { ISearchDto } from "@/common/interface";
import { ScalarMealType, TypeMealType } from "@/interfaces/scalar";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class MealArgsInput {
  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  loginId: string;

  @Field(() => ScalarMealType, { nullable: true })
  mealType: TypeMealType;

  @Field(() => Boolean, { nullable: true })
  wantToReserve: boolean;

  @Field(() => DateInput, { nullable: true })
  createdAt: DateInput;

  @Field(() => DateInput, { nullable: true })
  updatedAt: DateInput;
}

@InputType()
export class SearchMealInput
  extends BaseInput
  implements ISearchDto<MealArgsInput>
{
  @Field(() => MealArgsInput)
  args: MealArgsInput;
}
