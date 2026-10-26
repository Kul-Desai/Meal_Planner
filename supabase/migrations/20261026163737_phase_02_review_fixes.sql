alter table public.recipes
  drop constraint recipes_fingerprint_key;

alter table public.recipes
  add constraint recipes_user_id_fingerprint_key
  unique nulls not distinct (user_id, fingerprint);

create index recipes_fingerprint_idx on public.recipes (fingerprint);

alter table public.plan_meals
  drop constraint plan_meals_recipe_id_fkey;

alter table public.plan_meals
  add constraint plan_meals_recipe_id_fkey
  foreign key (recipe_id)
  references public.recipes (id)
  on delete no action
  deferrable initially deferred;

alter table public.meal_feedback
  drop constraint meal_feedback_recipe_id_fkey;

alter table public.meal_feedback
  add constraint meal_feedback_recipe_id_fkey
  foreign key (recipe_id)
  references public.recipes (id)
  on delete no action
  deferrable initially deferred;

alter table public.preferences
  add constraint preferences_dislikes_max_count_check
  check (cardinality(dislikes) <= 50);

drop policy profiles_owner_access on public.profiles;
drop policy preferences_owner_access on public.preferences;

create policy "profiles_owner_select"
on public.profiles
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "profiles_owner_update"
on public.profiles
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "preferences_owner_select"
on public.preferences
for select to authenticated
using ((select auth.uid()) = user_id);

create policy "preferences_owner_update"
on public.preferences
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);
