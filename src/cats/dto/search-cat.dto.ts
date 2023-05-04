import { BaseInput } from "@/common/base.input";
import { DateInput } from "@/common/date.input";
import { ISearchDto } from "@/common/interface";
import { NumberInput } from "@/common/number.input";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CatArgsInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => NumberInput, { nullable: true })
  age: NumberInput;

  @Field(() => String, { nullable: true })
  breed: string;

  @Field(() => DateInput, { nullable: true })
  createdAt: DateInput;
}

@InputType()
export class SearchCatInput
  extends BaseInput
  implements ISearchDto<CatArgsInput>
{
  @Field(() => CatArgsInput)
  args: CatArgsInput;
}
