import { FilterQuery } from "mongoose";
import { ISearchDto } from "./interface";
import { Injectable } from "@nestjs/common";
import { DateInput } from "./date.input";
import { NumberInput } from "./number.input";
import { Comparison } from "./scalar";

// MongoDB Qeury Format
export type FilterRange<T extends Date | number> = {
  $gte?: T;
  $lte?: T;
};

// MongoDB Date Range Query Format
export type DateRange = FilterRange<Date> | null;

// MongoDB Number Range Query Format
export type NumberRange = FilterRange<number> | null;

@Injectable()
export abstract class BaseFilter<TSearchInput extends ISearchDto<any>> {
  abstract toFilter(searchDto: TSearchInput): FilterQuery<TSearchInput["args"]>;

  // Build MongoDB search query
  toComparision(
    comparison: Comparison,
    conditions: FilterQuery<TSearchInput["args"]>,
    exclude: FilterQuery<TSearchInput["args"]>[]
  ): FilterQuery<TSearchInput["args"]> {
    // Array for '$or' query
    const orConditionArr: Record<string, any>[] = [];

    // New condition for query
    const newCondition: FilterQuery<TSearchInput["args"]> = {};
    let isOr = false;

    // if the comparison is not 'or', just return conditions for search with '$and'
    if (comparison !== "or") return conditions;

    // if the field is in exclude, just pass it without '$or'.
    // then mongoDB will search with '$and'
    Object.entries<any>(conditions).forEach(([_key, value]) => {
      const key = _key as TSearchInput["args"];
      if (exclude.includes(key)) {
        newCondition[key] = value;
      } else {
        isOr = true;
        orConditionArr.push({ [key]: value });
      }
    });

    if (!isOr) return conditions;
    newCondition.$or = orConditionArr;

    return newCondition;
  }

  // Remove null value from query, because MongoDB will search with literally "null" value.
  removeNullValue(
    conditions: FilterQuery<TSearchInput["args"]>
  ): FilterQuery<TSearchInput["args"]> {
    return Object.entries(conditions).reduce((acc, [key, value]) => {
      if (value || value === false) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }

  // Convert date-data for MongoDB query format
  toDateRange(input: DateInput): DateRange {
    if (!input) return null;

    const { begin, end } = input;
    if (begin || end) {
      const conditions: DateRange = {};
      if (begin) {
        conditions.$gte = begin;
      }
      if (end) {
        conditions.$lte = end;
      }
      if (!Object.keys(conditions).length) {
        return null;
      }

      return conditions;
    }
    return null;
  }

  // Convert number-data for MongoDB query format
  toNumberRange(input: NumberInput): NumberRange {
    if (!input) return null;

    const { begin, end } = input;
    if (begin !== undefined || end !== undefined) {
      const conditions: NumberRange = {};
      if (begin !== undefined) {
        conditions.$gte = begin;
      }
      if (end !== undefined) {
        conditions.$lte = end;
      }
      if (!Object.keys(conditions).length) {
        return null;
      }

      return conditions;
    }
    return null;
  }
}
