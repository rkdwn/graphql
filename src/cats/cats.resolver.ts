import { Injectable } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Cats, CatsDocument } from "./cats.entity";
import { CatsService } from "./cats.service";
import { CreateCatInput } from "./dto/create-cat.dto";
import { SearchCatInput } from "./dto/search-cat.dto";

@Injectable()
@Resolver(() => Cats)
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Query(() => [Cats])
  async searchCats(
    @Args("searchCatsInput")
    searchCatsInput: SearchCatInput
  ): Promise<CatsDocument[]> {
    //
    return await this.catsService.findAll(searchCatsInput);
  }

  @Mutation(() => Cats)
  async createCat(
    @Args("createCatInput")
    createCatInput: CreateCatInput
  ): Promise<CatsDocument> {
    const ret = await this.catsService.create(createCatInput.toEntity());
    return ret;
  }
}
