export type {
  Database,
  Enums,
  Tables,
  TablesInsert,
  TablesUpdate,
} from "./database.types";

import type { Tables } from "./database.types";

export type MealPlan = Tables<"meal_plans">;
export type PlanMeal = Tables<"plan_meals">;
export type GroceryList = Tables<"grocery_lists">;
export type GroceryItem = Tables<"grocery_items">;
export type Preference = Tables<"preferences">;
export type Profile = Tables<"profiles">;
export type Recipe = Tables<"recipes">;
