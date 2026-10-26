drop index if exists public.grocery_items_list_id_idx;

create index grocery_items_ingredient_id_idx on public.grocery_items (ingredient_id);
create index grocery_items_list_id_user_id_idx on public.grocery_items (list_id, user_id);
create index grocery_lists_plan_id_user_id_idx on public.grocery_lists (plan_id, user_id);
create index meal_feedback_plan_meal_id_user_id_idx on public.meal_feedback (plan_meal_id, user_id);
create index meal_feedback_recipe_id_idx on public.meal_feedback (recipe_id);
create index pantry_items_ingredient_id_idx on public.pantry_items (ingredient_id);
create index plan_meals_plan_id_user_id_idx on public.plan_meals (plan_id, user_id);
create index plan_meals_recipe_id_idx on public.plan_meals (recipe_id);
