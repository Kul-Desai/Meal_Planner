create type public.meal_plan_status as enum ('draft', 'locked', 'archived');
create type public.plan_meal_status as enum ('planned', 'cooked', 'skipped');
create type public.recipe_image_status as enum ('pending', 'ready', 'failed');
create type public.grocery_item_source as enum ('plan', 'manual');
create type public.meal_rating as enum ('loved', 'fine', 'not_again');
create type public.ai_generation_kind as enum ('plan', 'swap', 'image');

create function public.int_array_has_unique_values(input integer[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select cardinality(input) = (
    select count(distinct value)
    from pg_catalog.unnest(input) as value
  );
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  mood_tags text[] not null default '{}',
  cooking_days integer[] not null default '{1,2,3,4,5}',
  household_size smallint not null default 2 check (household_size between 1 and 6),
  has_kids boolean not null default false,
  diet text not null default 'none' check (diet in ('none', 'vegetarian', 'vegan', 'pescatarian')),
  allergies text[] not null default '{}'
    check (allergies <@ array['peanut', 'tree_nut', 'dairy', 'egg', 'gluten', 'shellfish', 'fish', 'soy', 'sesame']),
  protein_likes text[] not null default '{chicken,beef,pork,fish,shellfish,tofu,paneer,egg,beans_and_lentils}'
    check (
      cardinality(protein_likes) > 0
      and protein_likes <@ array['chicken', 'beef', 'pork', 'fish', 'shellfish', 'tofu', 'paneer', 'egg', 'beans_and_lentils']
    ),
  dislikes text[] not null default '{}',
  max_minutes_weekday smallint not null default 45 check (max_minutes_weekday in (30, 45, 60)),
  max_minutes_weekend smallint not null default 60 check (max_minutes_weekend in (30, 45, 60)),
  auto_draft boolean not null default false,
  auto_draft_day smallint not null default 0 check (auto_draft_day between 0 and 6),
  reminder_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    cardinality(mood_tags) <= 3
    and mood_tags <@ array['speedy', 'lighter', 'family_favorites', 'healthy_comfort', 'fakeaway', 'gut_friendly', 'protein_packed']
  ),
  check (
    cardinality(cooking_days) between 1 and 7
    and cooking_days <@ array[0, 1, 2, 3, 4, 5, 6]
    and public.int_array_has_unique_values(cooking_days)
  )
);

create table public.ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  aliases text[] not null default '{}',
  category text not null check (category in ('produce', 'protein', 'dairy_and_eggs', 'bakery', 'pantry', 'frozen', 'other')),
  default_unit text not null check (default_unit in ('g', 'kg', 'oz', 'lb', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'each', 'clove', 'slice', 'can', 'jar', 'package', 'bunch', 'head')),
  allergens text[] not null default '{}'
    check (allergens <@ array['peanut', 'tree_nut', 'dairy', 'egg', 'gluten', 'shellfish', 'fish', 'soy', 'sesame']),
  diet_tags text[] not null default '{}'
    check (diet_tags <@ array['meat', 'poultry', 'pork', 'beef', 'fish', 'shellfish', 'dairy', 'egg', 'gluten']),
  created_at timestamptz not null default now()
);

create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  summary text not null,
  minutes smallint not null check (minutes > 0),
  base_servings smallint not null check (base_servings > 0),
  cuisine text not null,
  mood_tag text not null check (mood_tag in ('speedy', 'lighter', 'family_favorites', 'healthy_comfort', 'fakeaway', 'gut_friendly', 'protein_packed')),
  tags text[] not null default '{}',
  steps jsonb not null check (jsonb_typeof(steps) = 'array'),
  protein_options text[] not null default '{}'
    check (protein_options <@ array['chicken', 'beef', 'pork', 'fish', 'shellfish', 'tofu', 'paneer', 'egg', 'beans_and_lentils']),
  source text not null check (source in ('seed', 'ai')),
  fingerprint text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.recipe_images (
  id uuid primary key default gen_random_uuid(),
  fingerprint text not null unique,
  imagekit_file_id text,
  url text,
  prompt text,
  model text,
  status public.recipe_image_status not null default 'pending',
  created_at timestamptz not null default now(),
  check (
    (status = 'ready' and url is not null and imagekit_file_id is not null)
    or status <> 'ready'
  )
);

create table public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  quantity numeric(10, 2) not null check (quantity > 0),
  unit text not null check (unit in ('g', 'kg', 'oz', 'lb', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'each', 'clove', 'slice', 'can', 'jar', 'package', 'bunch', 'head')),
  note text,
  optional boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  start_date date not null,
  days smallint not null check (days between 1 and 7),
  status public.meal_plan_status not null default 'draft',
  household_size smallint not null check (household_size between 1 and 6),
  summary text,
  locked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.plan_meals (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  slot text not null default 'dinner' check (slot = 'dinner'),
  recipe_id uuid not null references public.recipes(id) on delete restrict,
  servings smallint not null check (servings > 0),
  protein_choice text check (protein_choice in ('chicken', 'beef', 'pork', 'fish', 'shellfish', 'tofu', 'paneer', 'egg', 'beans_and_lentils')),
  status public.plan_meal_status not null default 'planned',
  makes_leftover jsonb,
  uses_leftover jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  unique (plan_id, date, slot)
);

create table public.grocery_lists (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null unique,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id)
);

create table public.grocery_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  ingredient_id uuid references public.ingredients(id) on delete restrict,
  display_name text not null,
  quantity numeric(10, 2) check (quantity is null or quantity > 0),
  unit text check (unit is null or unit in ('g', 'kg', 'oz', 'lb', 'ml', 'l', 'tsp', 'tbsp', 'cup', 'each', 'clove', 'slice', 'can', 'jar', 'package', 'bunch', 'head')),
  category text not null check (category in ('produce', 'protein', 'dairy_and_eggs', 'bakery', 'pantry', 'frozen', 'other')),
  checked boolean not null default false,
  source public.grocery_item_source not null,
  have_at_home boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pantry_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  ingredient_id uuid not null references public.ingredients(id) on delete restrict,
  always_have boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ingredient_id)
);

create table public.meal_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete restrict,
  plan_meal_id uuid not null,
  rating public.meal_rating not null,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, plan_meal_id)
);

create table public.ai_generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  kind public.ai_generation_kind not null,
  model text not null,
  input_tokens integer not null default 0 check (input_tokens >= 0),
  output_tokens integer not null default 0 check (output_tokens >= 0),
  duration_ms integer not null default 0 check (duration_ms >= 0),
  ok boolean not null,
  error text,
  created_at timestamptz not null default now()
);

create index ingredients_aliases_gin_idx on public.ingredients using gin (aliases);
create index recipes_user_id_idx on public.recipes(user_id);
create index recipe_ingredients_recipe_id_idx on public.recipe_ingredients(recipe_id);
create index recipe_ingredients_ingredient_id_idx on public.recipe_ingredients(ingredient_id);
create index meal_plans_user_id_start_date_idx on public.meal_plans(user_id, start_date);
create index plan_meals_user_id_idx on public.plan_meals(user_id);
create index plan_meals_plan_id_date_idx on public.plan_meals(plan_id, date);
create index grocery_lists_user_id_idx on public.grocery_lists(user_id);
create index grocery_items_user_id_idx on public.grocery_items(user_id);
create index grocery_items_list_id_idx on public.grocery_items(list_id);
create index pantry_items_user_id_idx on public.pantry_items(user_id);
create index meal_feedback_user_id_idx on public.meal_feedback(user_id);
create index ai_generations_user_id_created_at_idx on public.ai_generations(user_id, created_at);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger preferences_set_updated_at
before update on public.preferences
for each row execute function public.set_updated_at();

create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

create trigger meal_plans_set_updated_at
before update on public.meal_plans
for each row execute function public.set_updated_at();

create trigger plan_meals_set_updated_at
before update on public.plan_meals
for each row execute function public.set_updated_at();

create trigger grocery_lists_set_updated_at
before update on public.grocery_lists
for each row execute function public.set_updated_at();

create trigger grocery_items_set_updated_at
before update on public.grocery_items
for each row execute function public.set_updated_at();

create trigger pantry_items_set_updated_at
before update on public.pantry_items
for each row execute function public.set_updated_at();

create trigger meal_feedback_set_updated_at
before update on public.meal_feedback
for each row execute function public.set_updated_at();
