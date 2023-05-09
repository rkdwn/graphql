import { ICreateDto } from "@/common/interface";
import { User } from "../user.entity";
import { Field, InputType } from "@nestjs/graphql";
import { v4 } from "uuid";

@InputType()
export class CreateUserInput implements ICreateDto<User> {
  @Field(() => String)
  name: string;

  @Field(() => Number, { nullable: true })
  age: number;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String)
  loginId: string;

  @Field(() => String)
  loginPassword: string;

  @Field(() => String)
  phone: string;

  toEntity(): User {
    return new User({
      ...this,
      id: v4()
    });
  }
}
