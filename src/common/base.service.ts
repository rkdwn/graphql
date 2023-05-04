import { Type } from "@nestjs/common";
import { Document, FilterQuery, Model } from "mongoose";
import { ISearchDto } from "./interface";
import { BaseFilter } from "./base.filter";

export class BaseService<
  T, // Entity
  TUpdateInput, // Update Input type
  TDeleteInput, // Delete Input type
  TSearchInput extends ISearchDto<TSearchInput["args"]> // Search Input type
> {
  private readonly name: string;
  constructor(
    private readonly classType: Type,
    private readonly model: Model<T & Document>,
    private readonly filter?: BaseFilter<ISearchDto<TSearchInput["args"]>>
  ) {
    this.name = classType.name;
  }

  searchDtoToFilter(
    searchDto: ISearchDto<TSearchInput["args"]>
  ): FilterQuery<TSearchInput["args"]> {
    return this.filter.toFilter(searchDto);
  }

  async findAll(searchInput: TSearchInput): Promise<(T & Document)[]> {
    const filter = this.searchDtoToFilter(searchInput);
    // TODO: Add sort option
    const sort = searchInput.sort;

    return await this.model.find(filter).exec();
  }

  async create(createEntity: T): Promise<T & Document> {
    //

    const createDocument = new this.model({
      ...createEntity,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const ret = await createDocument.save();

    return ret;
  }
}
