import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type CatsDocument = Cats & Document;

@ObjectType()
@Schema()
export class Cats {
  constructor({
    id,
    name,
    age,
    breed
  }: {
    id: string;
    name: string;
    age: number;
    breed: string;
  }) {
    // super();
    this.id = id;
    this.name = name;
    this.age = age;
    this.breed = breed;
  }
  @Field(() => String, { description: "id value" })
  @Prop({ required: true })
  id: string;

  @Field(() => String, { description: "cat name" })
  @Prop()
  name: string;

  @Field(() => Int, { description: "cat age" })
  @Prop()
  age: number;

  @Field(() => String, { description: "cat breed" })
  @Prop()
  breed: string;
}

export const CatsSchema = SchemaFactory.createForClass(Cats);

CatsSchema.loadClass(Cats);
