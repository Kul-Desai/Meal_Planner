export const moodValues = [
  "speedy",
  "lighter",
  "family_favorites",
  "healthy_comfort",
  "fakeaway",
  "gut_friendly",
  "protein_packed",
] as const;

export const dietValues = [
  "none",
  "vegetarian",
  "vegan",
  "pescatarian",
] as const;

export const allergyValues = [
  "peanut",
  "tree_nut",
  "dairy",
  "egg",
  "gluten",
  "shellfish",
  "fish",
  "soy",
  "sesame",
] as const;

export const proteinValues = [
  "chicken",
  "beef",
  "pork",
  "fish",
  "shellfish",
  "tofu",
  "paneer",
  "egg",
  "beans_and_lentils",
] as const;

export const cookingDayValues = [0, 1, 2, 3, 4, 5, 6] as const;
export const timeValues = [30, 45, 60] as const;

type Option<Value extends string | number> = {
  value: Value;
  label: string;
  emoji: string;
};

export const moodOptions: readonly Option<(typeof moodValues)[number]>[] = [
  { value: "speedy", label: "Speedy meals", emoji: "⚡" },
  { value: "lighter", label: "Lighter", emoji: "🥗" },
  { value: "family_favorites", label: "Family favorites", emoji: "👨‍👩‍👧‍👦" },
  { value: "healthy_comfort", label: "Healthy comfort", emoji: "🍲" },
  { value: "fakeaway", label: "Fakeaway", emoji: "🥡" },
  { value: "gut_friendly", label: "Gut friendly", emoji: "🌿" },
  { value: "protein_packed", label: "Protein packed", emoji: "💪" },
];

export const dietOptions: readonly Option<(typeof dietValues)[number]>[] = [
  { value: "none", label: "No restriction", emoji: "🍽️" },
  { value: "vegetarian", label: "Vegetarian", emoji: "🥕" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "pescatarian", label: "Pescatarian", emoji: "🐟" },
];

export const allergyOptions: readonly Option<(typeof allergyValues)[number]>[] =
  [
    { value: "peanut", label: "Peanut-free", emoji: "🥜" },
    { value: "tree_nut", label: "Tree-nut-free", emoji: "🌰" },
    { value: "dairy", label: "Dairy-free", emoji: "🥛" },
    { value: "egg", label: "Egg-free", emoji: "🥚" },
    { value: "gluten", label: "Gluten-free", emoji: "🌾" },
    { value: "shellfish", label: "Shellfish-free", emoji: "🦐" },
    { value: "fish", label: "Fish-free", emoji: "🐠" },
    { value: "soy", label: "Soy-free", emoji: "🫘" },
    { value: "sesame", label: "Sesame-free", emoji: "🌻" },
  ];

export const proteinOptions: readonly Option<(typeof proteinValues)[number]>[] =
  [
    { value: "chicken", label: "Chicken", emoji: "🍗" },
    { value: "beef", label: "Beef", emoji: "🥩" },
    { value: "pork", label: "Pork", emoji: "🥓" },
    { value: "fish", label: "Fish", emoji: "🐟" },
    { value: "shellfish", label: "Shellfish", emoji: "🦐" },
    { value: "tofu", label: "Tofu", emoji: "🍱" },
    { value: "paneer", label: "Paneer", emoji: "🧀" },
    { value: "egg", label: "Eggs", emoji: "🥚" },
    { value: "beans_and_lentils", label: "Beans and lentils", emoji: "🫘" },
  ];

export const cookingDayOptions = [
  { value: 1, label: "Mon" },
  { value: 2, label: "Tue" },
  { value: 3, label: "Wed" },
  { value: 4, label: "Thu" },
  { value: 5, label: "Fri" },
  { value: 6, label: "Sat" },
  { value: 0, label: "Sun" },
] as const;

export const commonDislikes = [
  "Mushrooms",
  "Tomatoes",
  "Onions",
  "Garlic",
  "Coriander",
  "Olives",
  "Chilli",
  "Cheese",
] as const;

export const preferenceDefaults = {
  mood_tags: ["speedy"],
  cooking_days: [1, 2, 3, 4, 5],
  household_size: 2,
  has_kids: false,
  diet: "none",
  allergies: [],
  protein_likes: [...proteinValues],
  dislikes: [],
  max_minutes_weekday: 45,
  max_minutes_weekend: 60,
} as const;

const excludedProteinsByDiet: Record<
  (typeof dietValues)[number],
  readonly (typeof proteinValues)[number][]
> = {
  none: [],
  vegetarian: ["chicken", "beef", "pork", "fish", "shellfish"],
  vegan: ["chicken", "beef", "pork", "fish", "shellfish", "paneer", "egg"],
  pescatarian: ["chicken", "beef", "pork"],
};

export function proteinsForDiet(diet: (typeof dietValues)[number]) {
  const excluded = new Set(excludedProteinsByDiet[diet]);
  return proteinOptions.filter((option) => !excluded.has(option.value));
}

export function labelForOption(
  options: readonly Option<string | number>[],
  value: string | number,
) {
  return (
    options.find((option) => option.value === value)?.label ?? String(value)
  );
}
