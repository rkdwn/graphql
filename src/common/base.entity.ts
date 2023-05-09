import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type IndexKeyType = {
  index: Partial<Record<string, 1 | -1>>[];
  unique: boolean;
};

@ObjectType()
@Schema()
export class BaseEntity {
  @Field(() => Date)
  @Prop()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  @Prop()
  updatedAt?: Date;

  constructor() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
  }
}

export function createIndex(
  schema: mongoose.Schema,
  indexList: IndexKeyType[]
) {
  indexList.forEach((indexItem: IndexKeyType) => {
    const indexField = indexItem.index.reduce((acc, cur) => {
      return Object.assign(acc, cur);
    }, {});
    const indexName = indexItem.index
      .reduce((acc, cur) => [...acc, Object.keys(cur)], [])
      .join("-");
    schema.index(indexField, {
      unique: indexItem.unique,
      name: indexName
    });
  });
}
