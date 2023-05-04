import {
  Field,
  InputType,
  IntersectionType,
  PartialType,
  PickType
} from "@nestjs/graphql";
import { CreateCatInput } from "./create-cat.dto";

@InputType()
export class UpdateCatInput extends IntersectionType(
  PickType(CreateCatInput, ["name", "age", "breed"] as const),
  PartialType(CreateCatInput)
) {
  @Field(() => String)
  id: string;
}
