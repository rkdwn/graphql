import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteMealInput {
  @Field(() => String)
  id: string;
}
