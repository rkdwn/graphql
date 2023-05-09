import { BaseInput } from "@/common/base.input";
import { DateInput } from "@/common/date.input";
import { ISearchDto } from "@/common/interface";
import { NumberInput } from "@/common/number.input";
import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class UserArgsInput {
  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => NumberInput, { nullable: true })
  age: NumberInput;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  loginId: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => DateInput, { nullable: true })
  createdAt: DateInput;

  @Field(() => DateInput, { nullable: true })
  updatedAt: DateInput;
}

@InputType()
export class SearchUserInput
  extends BaseInput
  implements ISearchDto<UserArgsInput>
{
  @Field(() => UserArgsInput)
  args: UserArgsInput;
}
