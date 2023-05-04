import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DateInput {
  @Field(() => Date, { nullable: true })
  begin: Date;

  @Field(() => Date, { nullable: true })
  end: Date;

  // Custom constructor
  static from(begin: Date, end: Date) {
    const date = new DateInput();
    date.begin = begin;
    date.end = end;
    return date;
  }

  // Convert data for MongoDB query format
  static toEntity(input: DateInput): { begin?: Date; end?: Date } {
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
