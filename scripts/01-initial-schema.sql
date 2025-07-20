-- Drop existing tables if they exist to start fresh
drop table if exists public.profiles cascade;
drop table if exists public.plans cascade;
drop type if exists public.plan_name;
drop type if exists public.subscription_status;

-- Create plans table
create type plan_name as enum ('Starter', 'Pro', 'Enterprise');

create table plans (
  id serial primary key,
  name plan_name not null,
  price_monthly integer,
  features text[]
);

-- Insert plans data
insert into plans (name, price_monthly, features) values
('Starter', 29, '{"Up to 10 AI Travel Agents", "Basic Expense Management", "Standard Travel Policies"}'),
('Pro', 99, '{"Unlimited AI Travel Agents", "Advanced Expense Management", "Customizable Travel Policies", "Key Integrations (Slack, HRIS)", "Advanced Reporting"}'),
('Enterprise', null, '{"All Pro features", "Dedicated Account Manager", "Premium Support (24/7)", "API Access", "Custom Integrations"}');

-- Create a type for subscription status
create type subscription_status as enum ('trialing', 'active', 'past_due', 'canceled');

-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  updated_at timestamp with time zone,
  full_name text,
  avatar_url text,
  website text,
  plan_id integer references plans(id) not null,
  status subscription_status,
  trial_ends_at timestamp with time zone,
  has_completed_onboarding boolean default false not null
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- This trigger automatically creates a profile for new users.
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, plan_id, status, trial_ends_at)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    1, -- Default to plan_id 1 (Starter)
    'trialing', -- Start with a trialing status
    now() + interval '7 days' -- Set trial end date to 7 days from now
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
