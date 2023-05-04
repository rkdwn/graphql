import { Field, ObjectType } from "@nestjs/graphql";
import { Schema } from "@nestjs/mongoose";

@ObjectType()
@Schema()
export class BaseEntity {
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  constructor() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }
}
