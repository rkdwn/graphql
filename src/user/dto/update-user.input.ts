import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType
} from "@nestjs/graphql";
import { CreateUserInput } from "./create-user.input";

@InputType()
export class UpdateUserInput extends IntersectionType(
  PickType(CreateUserInput, ["name"] as const),
  PartialType(CreateUserInput)
) {
  @Field(() => String)
  id: string;
}
