import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class NumberInput {
  @Field(() => Number, { nullable: true })
  begin: number;

  @Field(() => Number, { nullable: true })
  end: number;

  // Custom constructor
  static from(begin: number, end: number) {
    const date = new NumberInput();
    date.begin = begin;
    date.end = end;
    return date;
  }

  // Convert data for MongoDB query format
  static toEntity(input: NumberInput): { begin?: number; end?: number } {
    if (!input) return null;

    if (input.begin || input.end) {
      const conditions = {};
      if (input.begin) {
        conditions["$gte"] = input.begin;
      }
      if (input.end) {
        conditions["$lte"] = input.end;
      }
      return conditions;
    }

    return null;
  }
}
