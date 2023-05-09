import { BaseEntity, IndexKeyType, createIndex } from "@/common/base.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@ObjectType()
@Schema()
export class User extends BaseEntity {
  constructor({
    id,
    name,
    age,
    email,
    loginId,
    loginPassword,
    loginFailCount,
    phone
  }: {
    id: string;
    name: string;
    age?: number;
    email?: string;
    loginId: string;
    loginPassword: string;
    loginFailCount?: number;
    phone?: string;
  }) {
    super();
    this.id = id;
    this.name = name;
    this.age = age;
    this.email = email;
    this.loginId = loginId;
    this.loginPassword = loginPassword;
    this.loginFailCount = loginFailCount;
    this.phone = phone;
  }
  @Field(() => String, { description: "id value" })
  @Prop({ required: true })
  id: string;

  @Field(() => String, { description: "user name" })
  @Prop()
  name: string;

  @Field(() => Int, { description: "user age", nullable: true })
  @Prop()
  age: number;

  @Field(() => String, { description: "user email", nullable: true })
  @Prop()
  email: string;

  @Field(() => String, { description: "user loginId" })
  @Prop()
  loginId: string;

  @Field(() => String, { description: "user password" })
  @Prop()
  loginPassword: string;

  @Field(() => Int, { description: "user login fail count", nullable: true })
  @Prop()
  loginFailCount: number;

  @Field(() => String, { description: "user phone number", nullable: true })
  @Prop()
  phone: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.loadClass(User);

const indexList: IndexKeyType[] = [
  { index: [{ id: 1 }], unique: true },
  { index: [{ name: 1 }], unique: false }
];
createIndex(UserSchema, indexList);
