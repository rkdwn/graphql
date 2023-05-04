import { GraphQLScalarType } from "graphql";

export const Comparison = ["and", "or"] as const;

export type Comparison = (typeof Comparison)[number];

export const ScalarComparison = new GraphQLScalarType<Comparison, Comparison>({
  name: "ScalarComparison",
  description: "Scalar Comparison type. (and | or)",
  parseValue(value: Comparison) {
    if (!Comparison.includes(value as Comparison)) {
      throw new TypeError(`Invalid value ${value}`);
    }
    return value as Comparison;
  }
});
