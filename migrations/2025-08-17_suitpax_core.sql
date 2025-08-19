-- Suitpax core schema (2025-08-17)
-- Safe to run multiple times (IF NOT EXISTS / ON CONFLICT DO NOTHING )

create table if not exists companies (
	id uuid primary key default gen_random_uuid(),
	name text not null,
	domain text unique,
	plan text not null default 'free',
	seats int not null default 1,
	created_at timestamptz not null default now()
);

create table if not exists profiles (
	id uuid primary key,
	full_name text,
	avatar_url text,
	company text,
	job_title text,
	phone text,
	locale text,
	timezone text,
	updated_at timestamptz not null default now()
);

create table if not exists user_subscriptions (
	user_id uuid primary key,
	plan_id text not null default 'free',
	code_addon_id text,
	ai_tokens_used int not null default 0,
	ai_tokens_limit int not null default 10000,
	code_tokens_used int not null default 0,
	code_tokens_limit int not null default 0,
	period_start timestamptz not null default now(),
	period_end timestamptz not null default now() + interval '30 days',
	foreign key (user_id) references auth.users(id) on delete cascade
);

create table if not exists trips (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null,
	company_id uuid,
	status text not null default 'draft',
	total_amount numeric(12,2) default 0,
	currency text default 'USD',
	start_date date,
	end_date date,
	created_at timestamptz not null default now(),
	foreign key (user_id) references auth.users(id) on delete cascade,
	foreign key (company_id) references companies(id) on delete set null
);

create table if not exists passengers (
	id uuid primary key default gen_random_uuid(),
	trip_id uuid not null references trips(id) on delete cascade,
	type text not null default 'adult',
	first_name text,
	last_name text,
	loyalty jsonb
);

create table if not exists flight_offers (
	id uuid primary key default gen_random_uuid(),
	trip_id uuid references trips(id) on delete cascade,
	provider text not null,
	raw jsonb not null,
	total_amount numeric(12,2) not null,
	currency text not null,
	expires_at timestamptz
);

create table if not exists bookings (
	id uuid primary key default gen_random_uuid(),
	trip_id uuid references trips(id) on delete cascade,
	pnr text,
	airline text,
	status text not null default 'pending',
	ticketed_at timestamptz
);

create table if not exists policies (
	id uuid primary key default gen_random_uuid(),
	company_id uuid not null references companies(id) on delete cascade,
	data jsonb not null,
	active boolean not null default true,
	created_at timestamptz not null default now()
);

create table if not exists policy_violations (
	id uuid primary key default gen_random_uuid(),
	trip_id uuid not null references trips(id) on delete cascade,
	rule text not null,
	severity text not null default 'low',
	resolved boolean not null default false,
	resolved_at timestamptz
);

create table if not exists expenses (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	trip_id uuid references trips(id) on delete set null,
	category text,
	amount numeric(12,2) not null,
	currency text not null default 'USD',
	datetime timestamptz not null default now(),
	receipt_url text,
	status text not null default 'pending'
);

create table if not exists integrations (
	id uuid primary key default gen_random_uuid(),
	company_id uuid references companies(id) on delete cascade,
	provider text not null,
	status text not null default 'disconnected',
	settings jsonb,
	created_at timestamptz not null default now()
);

create table if not exists audit_logs (
	id uuid primary key default gen_random_uuid(),
	company_id uuid references companies(id) on delete cascade,
	actor_id uuid references auth.users(id) on delete set null,
	action text not null,
	target text,
	data jsonb,
	created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_profiles_company on profiles(company);
create index if not exists idx_user_subscriptions_period_end on user_subscriptions(period_end);
create index if not exists idx_trips_user on trips(user_id);
create index if not exists idx_trips_company on trips(company_id);
create index if not exists idx_flight_offers_trip on flight_offers(trip_id);
create index if not exists idx_bookings_trip on bookings(trip_id);
create index if not exists idx_expenses_user on expenses(user_id);
create index if not exists idx_expenses_trip on expenses(trip_id);
create index if not exists idx_audit_company on audit_logs(company_id);