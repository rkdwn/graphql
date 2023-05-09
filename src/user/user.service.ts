import { BaseFilter } from "@/common/base.filter";
import { BaseService } from "@/common/base.service";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { DeleteUserInput } from "./dto/delete-user.input";
import { SearchUserInput } from "./dto/search-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { User, UserDocument } from "./user.entity";
import { USER_FILTER } from "./user.filter";

@Injectable()
export class UserService extends BaseService<
  User,
  UpdateUserInput,
  DeleteUserInput,
  SearchUserInput
> {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @Inject(USER_FILTER)
    filter: BaseFilter<SearchUserInput>
  ) {
    super(User, userModel, ["id"], filter);
  }
}
