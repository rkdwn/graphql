import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteCatInput {
  @Field(() => String)
  id: string;
}
