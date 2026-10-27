insert into public.profiles (user_id)
select id
from auth.users
on conflict (user_id) do nothing;

insert into public.preferences (user_id)
select id
from auth.users
on conflict (user_id) do nothing;
