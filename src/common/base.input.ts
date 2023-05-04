import { Field, InputType } from "@nestjs/graphql";
import { IQueryOptions, InputSort } from "./interface";
import { Comparison, ScalarComparison } from "./scalar";

@InputType()
export class BaseInput implements IQueryOptions {
  @Field(() => ScalarComparison, { nullable: true })
  comparison: Comparison;

  @Field(() => Boolean, { nullable: true })
  exact?: boolean;

  @Field(() => InputSort, { nullable: true })
  sort?: InputSort;
}
