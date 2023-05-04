import { Field, InputType } from "@nestjs/graphql";
import { Comparison } from "./scalar";

@InputType()
export class InputSort {
  @Field(() => String, { nullable: true })
  indexKey: string;

  @Field(() => Boolean, { nullable: true })
  order: boolean;
}

export interface ICreateDto<T> {
  toEntity(): T;
}

export interface IQueryOptions {
  comparison?: Comparison;
  exact?: boolean;
  sort?: InputSort;
}

export interface ISearchDto<T> extends IQueryOptions {
  args: T;
}
