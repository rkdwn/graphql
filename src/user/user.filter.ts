import { BaseFilter } from "@/common/base.filter";
import { SearchUserInput } from "./dto/search-user.input";

export const USER_FILTER = Symbol("UserFilter");

export class UserFilter extends BaseFilter<SearchUserInput> {
  toFilter(searchDto: SearchUserInput): any {
    const args = searchDto.args;
    const comparison = searchDto.comparison;
    const _conditions: Record<string, any> = {};

    _conditions.name = args.name;
    _conditions.age = this.toNumberRange(args.age);
    _conditions.email = args.email;
    _conditions.loginId = args.loginId;
    _conditions.phone = args.phone;
    _conditions.createdAt = this.toDateRange(args.createdAt);
    _conditions.updatedAt = this.toDateRange(args.updatedAt);

    const conditions = this.removeNullValue(_conditions);

    return this.toComparision(comparison, conditions, []);
  }
}
