-- Ensure plans tables and RLS for subscriptions (2025-08-24)

create table if not exists public.suitpax_plans (
	id text primary key,
	description text,
	ai_tokens_limit integer,
	features jsonb,
	price_cents integer
);

create table if not exists public.suitpax_code_addons (
	id text primary key,
	description text,
	code_tokens_limit integer,
	price_cents integer
);

alter table public.user_subscriptions enable row level security;

do $$ begin
	if not exists (
		select 1 from pg_policies where schemaname='public' and tablename='user_subscriptions' and policyname='Users can view own subscription'
	) then
		create policy "Users can view own subscription" on public.user_subscriptions for select using (auth.uid() = user_id);
	end if;
	if not exists (
		select 1 from pg_policies where schemaname='public' and tablename='user_subscriptions' and policyname='Users can update own subscription'
	) then
		create policy "Users can update own subscription" on public.user_subscriptions for update using (auth.uid() = user_id);
	end if;
end $$;