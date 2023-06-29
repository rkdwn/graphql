import { BaseEntity, IndexKeyType, createIndex } from "@/common/base.entity";
import { ScalarMealType, TypeMealType } from "@/interfaces/scalar";
import { Field, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MealDocument = Meal & Document;

@ObjectType()
@Schema()
export class Meal extends BaseEntity {
  constructor({
    id,
    name,
    email,
    loginId,
    loginPassword,
    mealType,
    wantToReserve
  }: {
    id: string;
    name: string;
    email?: string;
    loginId: string;
    loginPassword: string;
    mealType: TypeMealType;
    wantToReserve: boolean;
  }) {
    super();
    this.id = id;
    this.name = name;
    this.email = email;
    this.loginId = loginId;
    this.loginPassword = loginPassword;
    this.mealType = mealType;
    this.wantToReserve = wantToReserve;
  }
  @Field(() => String, { description: "id value" })
  @Prop({ required: true })
  id: string;

  @Field(() => String, { description: "user's name" })
  @Prop({ required: true })
  name: string;

  @Field(() => String, { description: "user email", nullable: true })
  @Prop()
  email: string;

  @Field(() => String, { description: "user loginId" })
  @Prop({ required: true })
  loginId: string;

  @Field(() => String, { description: "user password" })
  @Prop({ required: true })
  loginPassword: string;

  @Field(() => ScalarMealType, {
    description: "meal type whitch user want to reserve"
  })
  @Prop({ type: String, required: true })
  mealType: TypeMealType;

  @Field(() => Boolean, { description: "flag which means want to reserve" })
  @Prop({ type: Boolean, required: true })
  wantToReserve: boolean;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
MealSchema.loadClass(Meal);

const indexList: IndexKeyType[] = [
  { index: [{ id: 1 }], unique: true },
  { index: [{ name: 1 }], unique: true }
];
createIndex(MealSchema, indexList);
