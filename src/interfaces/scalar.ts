import { GraphQLScalarType } from "graphql";

export const MealTypeList = ["A", "B", "C"] as const;
export type TypeMealType = (typeof MealTypeList)[number];
export const ScalarMealType = new GraphQLScalarType<TypeMealType, TypeMealType>(
  {
    name: "ScalarMealType",
    description: `Custom scalar type: ${MealTypeList.join(", ")}`,
    parseValue(value): TypeMealType {
      if (!MealTypeList.includes(value as TypeMealType)) {
        throw new TypeError(`value '${MealTypeList.join(", ")}' `);
      }
      return value as TypeMealType;
    }
  }
);
