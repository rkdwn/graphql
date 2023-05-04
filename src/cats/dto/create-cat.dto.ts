import { Field, InputType, Int } from "@nestjs/graphql";
import { ICreateDto } from "@/common/interface";
import { Cats } from "../cats.entity";
import { v4 } from "uuid";

@InputType()
export class CreateCatInput implements ICreateDto<Cats> {
  @Field(() => String)
  name: string;

  @Field(() => Int)
  age: number;

  @Field(() => String)
  breed: string;

  toEntity(): Cats {
    return new Cats({
      ...this,
      id: v4()
    });
  }
}
