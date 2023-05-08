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
    private readonly key: string[],
    private readonly filter?: BaseFilter<ISearchDto<TSearchInput["args"]>>
  ) {
    this.name = classType.name;
  }

  removeNullValue(conditions: any) {
    const newCondition = Object.entries(conditions).reduce((acc, cur) => {
      if (cur[1] !== null && cur[1] !== undefined) {
        acc[cur[0]] = cur[1];
      }
      return acc;
    }, {});

    return newCondition;
  }

  searchDtoToFilter(
    searchDto: ISearchDto<TSearchInput["args"]>
  ): FilterQuery<TSearchInput["args"]> {
    return this.filter.toFilter(searchDto);
  }

  async findAll(searchInput: TSearchInput): Promise<(T & Document)[]> {
    const filter = this.searchDtoToFilter(searchInput);
    const sort = searchInput.sort;

    const options = { sort: <Record<string, 1 | -1>>{} };

    if (sort) {
      if (sort.indexKey) {
        const arr = sort.indexKey.split("-");
        const obj = <Record<string, 1 | -1>>{};
        arr.forEach(v => {
          obj[v] = sort.order ? 1 : -1;
        });

        options.sort = obj;
      }
    }
    return await this.model.find(filter).sort(options.sort).exec();
  }

  async findOne(findOneInput: TDeleteInput): Promise<T & Document> {
    const ret = await this.model.findOne<T & Document>(findOneInput).exec();
    if (!ret) {
      throw new Error(
        `Not Found.${this.name}`
        // , "E404"
      );
    }
    return ret;
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

  async update(updateEntity: TUpdateInput): Promise<T & Document> {
    const input = this.removeNullValue(updateEntity);

    const filter = {};
    const updateValue = {};

    Object.entries(input).map(([key, value]: [string, unknown]) => {
      if (this.key.includes(key)) {
        filter[key] = value;
      } else {
        updateValue[key] = value;
      }
    });

    const updatedDocument = await this.model.findOneAndUpdate(
      filter,
      { ...updateValue, updatedAt: new Date() },
      {
        new: true
      }
    );

    if (!updatedDocument) {
      throw new Error(
        `Not Found.${this.name}`
        // , "E404"
      );
    }
    return updatedDocument;
  }

  async delete(deleteEntity: TDeleteInput): Promise<T & Document> {
    const deletedDocument: T & Document = await this.model
      .findOne(deleteEntity)
      .exec();

    if (!deletedDocument) {
      throw new Error(
        `Not Found.${this.name}`
        // , "E404"
      );
    }

    await deletedDocument.deleteOne();

    return deletedDocument;
  }
}
