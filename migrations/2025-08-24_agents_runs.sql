-- Agent runs and events tables (2025-08-24)
-- Safe/idempotent with IF NOT EXISTS and conditional policy creation

create table if not exists public.agent_runs (
	id uuid primary key default gen_random_uuid(),
	agent_id uuid not null,
	user_id uuid not null references auth.users(id) on delete cascade,
	model text,
	input_message text not null,
	output text,
	status text not null default 'running',
	input_tokens int,
	output_tokens int,
	created_at timestamptz not null default now(),
	completed_at timestamptz
);

create index if not exists idx_agent_runs_user on public.agent_runs(user_id);
create index if not exists idx_agent_runs_agent on public.agent_runs(agent_id);
create index if not exists idx_agent_runs_status on public.agent_runs(status);

alter table public.agent_runs enable row level security;

do $$ begin
	if not exists (
		select 1 from pg_policies 
		where schemaname = 'public' and tablename = 'agent_runs' and policyname = 'Users can view own runs'
	) then
		create policy "Users can view own runs" on public.agent_runs for select using (auth.uid() = user_id);
	end if;
	if not exists (
		select 1 from pg_policies 
		where schemaname = 'public' and tablename = 'agent_runs' and policyname = 'Users can insert own runs'
	) then
		create policy "Users can insert own runs" on public.agent_runs for insert with check (auth.uid() = user_id);
	end if;
	if not exists (
		select 1 from pg_policies 
		where schemaname = 'public' and tablename = 'agent_runs' and policyname = 'Users can update own runs'
	) then
		create policy "Users can update own runs" on public.agent_runs for update using (auth.uid() = user_id);
	end if;
end $$;

create table if not exists public.agent_run_events (
	id uuid primary key default gen_random_uuid(),
	run_id uuid not null references public.agent_runs(id) on delete cascade,
	user_id uuid not null references auth.users(id) on delete cascade,
	type text not null,
	data jsonb,
	created_at timestamptz not null default now()
);

create index if not exists idx_agent_run_events_run on public.agent_run_events(run_id);
create index if not exists idx_agent_run_events_user on public.agent_run_events(user_id);
create index if not exists idx_agent_run_events_type on public.agent_run_events(type);

alter table public.agent_run_events enable row level security;

do $$ begin
	if not exists (
		select 1 from pg_policies 
		where schemaname = 'public' and tablename = 'agent_run_events' and policyname = 'Users can view own run events'
	) then
		create policy "Users can view own run events" on public.agent_run_events for select using (auth.uid() = user_id);
	end if;
	if not exists (
		select 1 from pg_policies 
		where schemaname = 'public' and tablename = 'agent_run_events' and policyname = 'Users can insert own run events'
	) then
		create policy "Users can insert own run events" on public.agent_run_events for insert with check (auth.uid() = user_id);
	end if;
end $$;