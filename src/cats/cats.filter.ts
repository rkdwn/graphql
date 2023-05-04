import { BaseFilter } from "@/common/base.filter";
import { SearchCatInput } from "./dto/search-cat.dto";

export const CAT_FILTER = Symbol("CatFilter");

export class CatFilter extends BaseFilter<SearchCatInput> {
  toFilter(searchDto: SearchCatInput): any {
    const args = searchDto.args;
    const comparison = searchDto.comparison;
    const _conditions: Record<string, any> = {};

    _conditions.name = args.name;
    _conditions.age = this.toNumberRange(args.age);
    _conditions.breed = args.breed;
    _conditions.createdAt = this.toDateRange(args.createdAt);

    const conditions = this.removeNullValue(_conditions);

    return this.toComparision(comparison, conditions, []);
  }
}
