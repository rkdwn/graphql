import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User, UserDocument } from "./user.entity";
import { DeleteUserInput } from "./dto/delete-user.input";
import { Injectable } from "@nestjs/common";
import { SearchUserInput } from "./dto/search-user.input";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";

@Injectable()
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  async getUser(
    @Args("findOneInput")
    findOneInput: DeleteUserInput
  ): Promise<UserDocument> {
    return await this.userService.findOne(findOneInput);
  }

  @Query(() => [User])
  async searchUsers(
    @Args("searchUsersInput")
    searchUsersInput: SearchUserInput
  ): Promise<UserDocument[]> {
    return await this.userService.findAll(searchUsersInput);
  }

  @Mutation(() => User)
  async createUser(
    @Args("createUserInput")
    createUserInput: CreateUserInput
  ): Promise<UserDocument> {
    const ret = await this.userService.create(createUserInput.toEntity());
    return ret;
  }

  @Mutation(() => User)
  async updateUser(
    @Args("updateUserInput")
    updateUserInput: UpdateUserInput
  ): Promise<UserDocument> {
    const ret = await this.userService.update(updateUserInput);

    return ret;
  }

  @Mutation(() => User)
  async deleteUser(
    @Args("deleteUserInput")
    deleteUserInput: DeleteUserInput
  ): Promise<UserDocument> {
    const ret = await this.userService.delete(deleteUserInput);
    return ret;
  }
}
