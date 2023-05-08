import { Injectable } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Cats, CatsDocument } from "./cats.entity";
import { CatsService } from "./cats.service";
import { CreateCatInput } from "./dto/create-cat.dto";
import { SearchCatInput } from "./dto/search-cat.dto";
import { UpdateCatInput } from "./dto/update-cat.dto";
import { DeleteCatInput } from "./dto/delete-cat.dto";

@Injectable()
@Resolver(() => Cats)
export class CatsResolver {
  constructor(private readonly catsService: CatsService) {}

  @Query(() => Cats)
  async findCat(
    @Args("findOneInput")
    findOneInput: DeleteCatInput
  ): Promise<CatsDocument> {
    return await this.catsService.findOne(findOneInput);
  }

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

  @Mutation(() => Cats)
  async updateCat(
    @Args("updateCatInput")
    updateCatInput: UpdateCatInput
  ): Promise<CatsDocument> {
    const ret = await this.catsService.update(updateCatInput);

    return ret;
  }

  @Mutation(() => Cats)
  async deleteCat(
    @Args("deleteCatInput")
    deleteCatInput: DeleteCatInput
  ): Promise<CatsDocument> {
    const ret = await this.catsService.delete(deleteCatInput);
    return ret;
  }
}
