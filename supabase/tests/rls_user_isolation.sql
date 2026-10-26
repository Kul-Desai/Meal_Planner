begin;

create extension if not exists pgtap;
select plan(55);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at
)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-a@meal-planner.test', '', now(), '{}', '{}', now(), now()),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'rls-b@meal-planner.test', '', now(), '{}', '{}', now(), now());

insert into public.recipes (id, user_id, title, summary, minutes, base_servings, cuisine, mood_tag, steps, source, fingerprint)
values (
  '10000000-0000-0000-0000-000000000002',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Private B recipe', 'A private recipe for RLS coverage.', 30, 2, 'Test', 'speedy', '["Cook"]', 'ai', 'private-b-recipe'
);

insert into public.recipe_ingredients (id, recipe_id, ingredient_id, quantity, unit)
values (
  '20000000-0000-0000-0000-000000000002',
  '10000000-0000-0000-0000-000000000002',
  (select id from public.ingredients where name = 'onion'), 1, 'each'
);

insert into public.meal_plans (id, user_id, start_date, days, household_size)
values
  ('30000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date, 5, 2),
  ('30000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date, 5, 2),
  ('30000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date + 7, 5, 2);

insert into public.plan_meals (id, plan_id, user_id, date, recipe_id, servings)
values
  ('40000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date, (select id from public.recipes where fingerprint = 'chickpea-spinach-pasta'), 2),
  ('40000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date, '10000000-0000-0000-0000-000000000002', 2);

insert into public.grocery_lists (id, plan_id, user_id)
values
  ('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb');

insert into public.grocery_items (id, list_id, user_id, display_name, category, source)
values
  ('60000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'A item', 'produce', 'manual'),
  ('60000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'B item', 'produce', 'manual');

insert into public.pantry_items (id, user_id, ingredient_id)
values ('70000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (select id from public.ingredients where name = 'salt'));

insert into public.meal_feedback (id, user_id, recipe_id, plan_meal_id, rating)
values
  ('80000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (select id from public.recipes where fingerprint = 'chickpea-spinach-pasta'), '40000000-0000-0000-0000-000000000001', 'fine'),
  ('80000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'loved');

insert into public.ai_generations (id, user_id, kind, model, ok)
values ('90000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'plan', 'test', true);

create function pg_temp.rls_sqlstate(statement text)
returns text
language plpgsql
security invoker
as $$
begin
  execute statement;
  return '00000';
exception when others then
  return sqlstate;
end;
$$;

create function pg_temp.rls_affected_rows(statement text)
returns bigint
language plpgsql
security invoker
as $$
declare
  affected_rows bigint;
begin
  execute statement;
  get diagnostics affected_rows = row_count;
  return affected_rows;
end;
$$;

set local role authenticated;
select set_config('request.jwt.claim.role', 'authenticated', true);
select set_config('request.jwt.claim.sub', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true);

select is((select count(*) from public.profiles where user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 0::bigint, 'A cannot read B profile');
select is((select count(*) from public.preferences where user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'), 0::bigint, 'A cannot read B preferences');
select is((select count(*) from public.recipes where id = '10000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B private recipe');
select is((select count(*) from public.recipe_ingredients where id = '20000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B private recipe ingredients');
select is((select count(*) from public.meal_plans where id = '30000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B meal plan');
select is((select count(*) from public.plan_meals where id = '40000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B plan meal');
select is((select count(*) from public.grocery_lists where id = '50000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B grocery list');
select is((select count(*) from public.grocery_items where id = '60000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B grocery item');
select is((select count(*) from public.pantry_items where id = '70000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B pantry item');
select is((select count(*) from public.meal_feedback where id = '80000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B feedback');
select is((select count(*) from public.ai_generations where id = '90000000-0000-0000-0000-000000000002'), 0::bigint, 'A cannot read B generation log');

select is(pg_temp.rls_sqlstate($$insert into public.profiles (user_id) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')$$), '42501', 'A cannot create a profile for B');
select is(pg_temp.rls_sqlstate($$insert into public.preferences (user_id) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')$$), '42501', 'A cannot create preferences for B');
select is(pg_temp.rls_sqlstate($$insert into public.recipes (user_id, title, summary, minutes, base_servings, cuisine, mood_tag, steps, source, fingerprint) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Unauthorized recipe', 'RLS test.', 30, 2, 'Test', 'speedy', '["Cook"]', 'ai', 'unauthorized-b-recipe')$$), '42501', 'A cannot create a recipe for B');
select is(pg_temp.rls_sqlstate($$insert into public.recipe_ingredients (recipe_id, ingredient_id, quantity, unit) values ('10000000-0000-0000-0000-000000000002', (select id from public.ingredients where name = 'onion'), 1, 'each')$$), '42501', 'A cannot add an ingredient to B recipe');
select is(pg_temp.rls_sqlstate($$insert into public.meal_plans (user_id, start_date, days, household_size) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date + 14, 5, 2)$$), '42501', 'A cannot create a plan for B');
select is(pg_temp.rls_sqlstate($$insert into public.plan_meals (plan_id, user_id, date, recipe_id, servings) values ('30000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', current_date + 7, '10000000-0000-0000-0000-000000000002', 2)$$), '42501', 'A cannot create a plan meal for B');
select is(pg_temp.rls_sqlstate($$insert into public.grocery_lists (plan_id, user_id) values ('30000000-0000-0000-0000-000000000003', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')$$), '42501', 'A cannot create a grocery list for B');
select is(pg_temp.rls_sqlstate($$insert into public.grocery_items (list_id, user_id, display_name, category, source) values ('50000000-0000-0000-0000-000000000002', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Unauthorized item', 'produce', 'manual')$$), '42501', 'A cannot create a grocery item for B');
select is(pg_temp.rls_sqlstate($$insert into public.pantry_items (user_id, ingredient_id) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', (select id from public.ingredients where name = 'onion'))$$), '42501', 'A cannot create a pantry item for B');
select is(pg_temp.rls_sqlstate($$insert into public.meal_feedback (user_id, recipe_id, plan_meal_id, rating) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '10000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', 'fine')$$), '42501', 'A cannot create feedback for B');
select is(pg_temp.rls_sqlstate($$insert into public.ai_generations (user_id, kind, model, ok) values ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'plan', 'test', true)$$), '42501', 'A cannot create a generation log for B');

select is(pg_temp.rls_affected_rows($$update public.profiles set display_name = 'changed' where user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$), 0::bigint, 'A cannot update B profile');
select is(pg_temp.rls_affected_rows($$update public.preferences set household_size = 3 where user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$), 0::bigint, 'A cannot update B preferences');
select is(pg_temp.rls_affected_rows($$update public.recipes set title = 'changed' where id = '10000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B recipe');
select is(pg_temp.rls_affected_rows($$update public.recipe_ingredients set quantity = 2 where id = '20000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B recipe ingredient');
select is(pg_temp.rls_affected_rows($$update public.meal_plans set days = 4 where id = '30000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B meal plan');
select is(pg_temp.rls_affected_rows($$update public.plan_meals set servings = 3 where id = '40000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B plan meal');
select is(pg_temp.rls_affected_rows($$update public.grocery_lists set updated_at = now() where id = '50000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B grocery list');
select is(pg_temp.rls_affected_rows($$update public.grocery_items set display_name = 'changed' where id = '60000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B grocery item');
select is(pg_temp.rls_affected_rows($$update public.pantry_items set always_have = false where id = '70000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B pantry item');
select is(pg_temp.rls_affected_rows($$update public.meal_feedback set note = 'changed' where id = '80000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B feedback');
select is(pg_temp.rls_affected_rows($$update public.ai_generations set model = 'changed' where id = '90000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot update B generation log');

select is(pg_temp.rls_affected_rows($$delete from public.profiles where user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$), 0::bigint, 'A cannot delete B profile');
select is(pg_temp.rls_affected_rows($$delete from public.preferences where user_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'$$), 0::bigint, 'A cannot delete B preferences');
select is(pg_temp.rls_affected_rows($$delete from public.recipes where id = '10000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B recipe');
select is(pg_temp.rls_affected_rows($$delete from public.recipe_ingredients where id = '20000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B recipe ingredient');
select is(pg_temp.rls_affected_rows($$delete from public.meal_plans where id = '30000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B meal plan');
select is(pg_temp.rls_affected_rows($$delete from public.plan_meals where id = '40000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B plan meal');
select is(pg_temp.rls_affected_rows($$delete from public.grocery_lists where id = '50000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B grocery list');
select is(pg_temp.rls_affected_rows($$delete from public.grocery_items where id = '60000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B grocery item');
select is(pg_temp.rls_affected_rows($$delete from public.pantry_items where id = '70000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B pantry item');
select is(pg_temp.rls_affected_rows($$delete from public.meal_feedback where id = '80000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B feedback');
select is(pg_temp.rls_affected_rows($$delete from public.ai_generations where id = '90000000-0000-0000-0000-000000000002'$$), 0::bigint, 'A cannot delete B generation log');

select is(pg_temp.rls_sqlstate($$insert into public.plan_meals (plan_id, user_id, date, recipe_id, servings) values ('30000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date + 1, (select id from public.recipes where fingerprint = 'chickpea-spinach-pasta'), 2)$$), '42501', 'A cannot attach a plan meal to B plan');
select is(pg_temp.rls_sqlstate($$update public.plan_meals set plan_id = '30000000-0000-0000-0000-000000000002' where id = '40000000-0000-0000-0000-000000000001'$$), '42501', 'A cannot move a plan meal to B plan');
select is(pg_temp.rls_sqlstate($$insert into public.grocery_lists (plan_id, user_id) values ('30000000-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa')$$), '23503', 'A cannot attach a grocery list to B plan');
select is(pg_temp.rls_sqlstate($$update public.grocery_lists set plan_id = '30000000-0000-0000-0000-000000000003' where id = '50000000-0000-0000-0000-000000000001'$$), '23503', 'A cannot move a grocery list to B plan');
select is(pg_temp.rls_sqlstate($$insert into public.grocery_items (list_id, user_id, display_name, category, source) values ('50000000-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'cross-owner item', 'produce', 'manual')$$), '23503', 'A cannot attach a grocery item to B list');
select is(pg_temp.rls_sqlstate($$update public.grocery_items set list_id = '50000000-0000-0000-0000-000000000002' where id = '60000000-0000-0000-0000-000000000001'$$), '23503', 'A cannot move a grocery item to B list');
select is(pg_temp.rls_sqlstate($$insert into public.meal_feedback (user_id, recipe_id, plan_meal_id, rating) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', (select id from public.recipes where fingerprint = 'chickpea-spinach-pasta'), '40000000-0000-0000-0000-000000000002', 'fine')$$), '42501', 'A cannot attach feedback to B plan meal');
select is(pg_temp.rls_sqlstate($$update public.meal_feedback set plan_meal_id = '40000000-0000-0000-0000-000000000002' where id = '80000000-0000-0000-0000-000000000001'$$), '42501', 'A cannot move feedback to B plan meal');
select is(pg_temp.rls_sqlstate($$insert into public.plan_meals (plan_id, user_id, date, recipe_id, servings) values ('30000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', current_date + 2, '10000000-0000-0000-0000-000000000002', 2)$$), '42501', 'A cannot attach B private recipe to A plan');
select is(pg_temp.rls_sqlstate($$insert into public.ingredients (name, category, default_unit) values ('unauthorized ingredient', 'produce', 'each')$$), '42501', 'A cannot write ingredients');
select is(pg_temp.rls_sqlstate($$insert into public.ai_generations (user_id, kind, model, ok) values (null, 'image', 'test', true)$$), '42501', 'A cannot write system generation rows');

select * from finish();
rollback;
