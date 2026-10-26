alter table public.plan_meals
  add constraint plan_meals_plan_owner_fkey
  foreign key (plan_id, user_id)
  references public.meal_plans (id, user_id)
  on delete cascade;

alter table public.grocery_lists
  add constraint grocery_lists_plan_owner_fkey
  foreign key (plan_id, user_id)
  references public.meal_plans (id, user_id)
  on delete cascade;

alter table public.grocery_items
  add constraint grocery_items_list_owner_fkey
  foreign key (list_id, user_id)
  references public.grocery_lists (id, user_id)
  on delete cascade;

alter table public.meal_feedback
  add constraint meal_feedback_plan_meal_owner_fkey
  foreign key (plan_meal_id, user_id)
  references public.plan_meals (id, user_id)
  on delete cascade;

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'full_name');

  insert into public.preferences (user_id)
  values (new.id);

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    execute 'revoke execute on function public.rls_auto_enable() from public, anon, authenticated';
  end if;
end;
$$;

alter table public.profiles enable row level security;
alter table public.preferences enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_images enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.meal_plans enable row level security;
alter table public.plan_meals enable row level security;
alter table public.grocery_lists enable row level security;
alter table public.grocery_items enable row level security;
alter table public.pantry_items enable row level security;
alter table public.meal_feedback enable row level security;
alter table public.ai_generations enable row level security;

create policy "profiles_owner_access"
on public.profiles
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "preferences_owner_access"
on public.preferences
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "ingredients_authenticated_read"
on public.ingredients
for select to authenticated
using (true);

create policy "recipes_authenticated_read_global_or_owner"
on public.recipes
for select to authenticated
using (user_id is null or user_id = (select auth.uid()));

create policy "recipes_owner_write"
on public.recipes
for insert to authenticated
with check (user_id = (select auth.uid()) and source = 'ai');

create policy "recipes_owner_update"
on public.recipes
for update to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()) and source = 'ai');

create policy "recipes_owner_delete"
on public.recipes
for delete to authenticated
using (user_id = (select auth.uid()));

create policy "recipe_images_authenticated_read"
on public.recipe_images
for select to authenticated
using (true);

create policy "recipe_ingredients_read_accessible_recipe"
on public.recipe_ingredients
for select to authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
      and (recipes.user_id is null or recipes.user_id = (select auth.uid()))
  )
);

create policy "recipe_ingredients_owner_write"
on public.recipe_ingredients
for insert to authenticated
with check (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = (select auth.uid())
  )
);

create policy "recipe_ingredients_owner_update"
on public.recipe_ingredients
for update to authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = (select auth.uid())
  )
);

create policy "recipe_ingredients_owner_delete"
on public.recipe_ingredients
for delete to authenticated
using (
  exists (
    select 1
    from public.recipes
    where recipes.id = recipe_ingredients.recipe_id
      and recipes.user_id = (select auth.uid())
  )
);

create policy "meal_plans_owner_access"
on public.meal_plans
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "plan_meals_owner_access"
on public.plan_meals
for all to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.meal_plans
    where meal_plans.id = plan_meals.plan_id
      and meal_plans.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.recipes
    where recipes.id = plan_meals.recipe_id
      and (recipes.user_id is null or recipes.user_id = (select auth.uid()))
  )
);

create policy "grocery_lists_owner_access"
on public.grocery_lists
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "grocery_items_owner_access"
on public.grocery_items
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "pantry_items_owner_access"
on public.pantry_items
for all to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "meal_feedback_owner_access"
on public.meal_feedback
for all to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.plan_meals
    where plan_meals.id = meal_feedback.plan_meal_id
      and plan_meals.user_id = (select auth.uid())
  )
  and exists (
    select 1
    from public.recipes
    where recipes.id = meal_feedback.recipe_id
      and (recipes.user_id is null or recipes.user_id = (select auth.uid()))
  )
);

create policy "ai_generations_owner_read"
on public.ai_generations
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "ai_generations_owner_insert"
on public.ai_generations
for insert to authenticated
with check ((select auth.uid()) = user_id);
