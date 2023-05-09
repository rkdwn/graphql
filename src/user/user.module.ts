import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./user.entity";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { USER_FILTER, UserFilter } from "./user.filter";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: User.name }
    ])
  ],
  providers: [
    UserResolver,
    UserService,
    { provide: USER_FILTER, useClass: UserFilter }
  ],
  exports: [UserService]
})
export class UserModule {}
