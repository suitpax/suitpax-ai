-- Suitpax - All-in-one Supabase Schema (idempotent)
-- Run this in the Supabase SQL editor. Safe to re-run.

-- =========================
-- Extensions
-- =========================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- Helper functions (timestamps)
-- =========================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Back-compat helper name used by some scripts
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =========================
-- Storage: avatars bucket and policies
-- =========================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Avatar images are publicly accessible'
  ) THEN
    CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
      FOR SELECT USING (bucket_id = 'avatars');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can upload their own avatar'
  ) THEN
    CREATE POLICY "Users can upload their own avatar" ON storage.objects
      FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='storage' AND tablename='objects' AND policyname='Users can update their own avatar'
  ) THEN
    CREATE POLICY "Users can update their own avatar" ON storage.objects
      FOR UPDATE USING (
        bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

-- =========================
-- Multi-Entity Structure (NEW)
-- =========================

-- Adding organizations table for multi-entity support
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  legal_name TEXT,
  parent_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  organization_type TEXT DEFAULT 'subsidiary' CHECK (organization_type IN ('parent', 'subsidiary', 'department')),
  country_code TEXT,
  currency TEXT DEFAULT 'USD',
  tax_id TEXT,
  billing_email TEXT,
  billing_address JSONB,
  billing_model TEXT DEFAULT 'consolidated' CHECK (billing_model IN ('consolidated', 'separate', 'hybrid')),
  stripe_customer_id TEXT UNIQUE,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  max_employees INTEGER,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Adding organization memberships for user-organization relationships
CREATE TABLE IF NOT EXISTS public.organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'employee' CHECK (role IN ('owner', 'admin', 'manager', 'employee')),
  department TEXT,
  cost_center TEXT,
  employee_level TEXT DEFAULT 'standard' CHECK (employee_level IN ('c_level', 'senior', 'standard', 'junior')),
  spending_limits JSONB DEFAULT '{}',
  permissions JSONB DEFAULT '{}',
  is_primary BOOLEAN DEFAULT FALSE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

-- Adding travel policies table for organization-specific rules
CREATE TABLE IF NOT EXISTS public.travel_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  policy_type TEXT DEFAULT 'general' CHECK (policy_type IN ('general', 'flight', 'hotel', 'expense', 'approval')),
  rules JSONB NOT NULL DEFAULT '{}',
  applies_to JSONB DEFAULT '{"employee_levels": ["all"], "departments": ["all"]}',
  effective_from DATE DEFAULT CURRENT_DATE,
  effective_until DATE,
  is_active BOOLEAN DEFAULT TRUE,
  auto_approval_enabled BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Core tables (UPDATED)
-- =========================
-- Updated users table to work with organizations
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  job_title TEXT,
  primary_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  personal_subscription_plan TEXT DEFAULT 'free',
  personal_subscription_status TEXT DEFAULT 'inactive',
  stripe_customer_id TEXT UNIQUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  ai_tokens_used INTEGER DEFAULT 0,
  ai_tokens_limit INTEGER DEFAULT 5000,
  last_active_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_airlines TEXT[],
  preferred_airports TEXT[],
  seat_preference TEXT DEFAULT 'aisle',
  meal_preference TEXT DEFAULT 'standard',
  class_preference TEXT DEFAULT 'economy',
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  booking_reminders BOOLEAN DEFAULT TRUE,
  expense_reminders BOOLEAN DEFAULT TRUE,
  max_flight_budget DECIMAL(10,2),
  requires_approval_over DECIMAL(10,2) DEFAULT 500.00,
  allowed_booking_classes TEXT[] DEFAULT ARRAY['economy','premium_economy'],
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_preferences' AND policyname='Users can view own preferences'
  ) THEN
    CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_preferences' AND policyname='Users can insert own preferences'
  ) THEN
    CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_preferences' AND policyname='Users can update own preferences'
  ) THEN
    CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Updated flight_bookings to include organization context
CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  booking_reference TEXT,
  status TEXT DEFAULT 'pending',
  approval_status TEXT DEFAULT 'auto_approved' CHECK (approval_status IN ('pending', 'auto_approved', 'manually_approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  departure_airport TEXT NOT NULL,
  arrival_airport TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ,
  departure_time TEXT,
  arrival_time TEXT,
  airline TEXT,
  flight_number TEXT,
  aircraft_type TEXT,
  passenger_name TEXT,
  passenger_email TEXT,
  seat_preference TEXT,
  meal_preference TEXT,
  base_price DECIMAL(10,2),
  taxes DECIMAL(10,2),
  total_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  booking_class TEXT DEFAULT 'economy',
  is_round_trip BOOLEAN DEFAULT FALSE,
  booking_source TEXT DEFAULT 'suitpax',
  external_booking_id TEXT,
  policy_compliance JSONB DEFAULT '{}',
  auto_approval_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_bookings' AND policyname='Users can view own flight bookings'
  ) THEN
    CREATE POLICY "Users can view own flight bookings" ON public.flight_bookings FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_bookings' AND policyname='Users can insert own flight bookings'
  ) THEN
    CREATE POLICY "Users can insert own flight bookings" ON public.flight_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_bookings' AND policyname='Users can update own flight bookings'
  ) THEN
    CREATE POLICY "Users can update own flight bookings" ON public.flight_bookings FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_bookings' AND policyname='Users can delete own flight bookings'
  ) THEN
    CREATE POLICY "Users can delete own flight bookings" ON public.flight_bookings FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Updated expenses to include organization context
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  flight_booking_id UUID REFERENCES public.flight_bookings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other',
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  approval_status TEXT DEFAULT 'auto_approved' CHECK (approval_status IN ('pending', 'auto_approved', 'manually_approved', 'rejected')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  receipt_url TEXT,
  receipt_filename TEXT,
  expense_date DATE NOT NULL,
  location TEXT,
  vendor TEXT,
  project_code TEXT,
  cost_center TEXT,
  department TEXT,
  policy_compliance JSONB DEFAULT '{}',
  auto_approval_score DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='Users can view own expenses'
  ) THEN
    CREATE POLICY "Users can view own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='Users can insert own expenses'
  ) THEN
    CREATE POLICY "Users can insert own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='Users can update own expenses'
  ) THEN
    CREATE POLICY "Users can update own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='expenses' AND policyname='Users can delete own expenses'
  ) THEN
    CREATE POLICY "Users can delete own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.ai_chat_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  model_used TEXT DEFAULT 'claude-3-sonnet',
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  context_type TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_chat_logs' AND policyname='Users can view own chat logs'
  ) THEN
    CREATE POLICY "Users can view own chat logs" ON public.ai_chat_logs FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_chat_logs' AND policyname='Users can insert own chat logs'
  ) THEN
    CREATE POLICY "Users can insert own chat logs" ON public.ai_chat_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'New session',
  archived BOOLEAN DEFAULT FALSE,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Users can view own chat sessions'
  ) THEN
    CREATE POLICY "Users can view own chat sessions" ON public.chat_sessions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Users can insert own chat sessions'
  ) THEN
    CREATE POLICY "Users can insert own chat sessions" ON public.chat_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Users can update own chat sessions'
  ) THEN
    CREATE POLICY "Users can update own chat sessions" ON public.chat_sessions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='chat_sessions' AND policyname='Users can delete own chat sessions'
  ) THEN
    CREATE POLICY "Users can delete own chat sessions" ON public.chat_sessions FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video','phone','in-person')),
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','completed','cancelled')),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER GENERATED ALWAYS AS (GREATEST(0, (EXTRACT(EPOCH FROM (ends_at - starts_at)) / 60)::INT)) STORED,
  attendees TEXT[] DEFAULT ARRAY[]::TEXT[],
  location TEXT,
  description TEXT,
  meeting_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meetings' AND policyname='Users can view own meetings') THEN
    CREATE POLICY "Users can view own meetings" ON public.meetings FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meetings' AND policyname='Users can insert own meetings') THEN
    CREATE POLICY "Users can insert own meetings" ON public.meetings FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meetings' AND policyname='Users can update own meetings') THEN
    CREATE POLICY "Users can update own meetings" ON public.meetings FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='meetings' AND policyname='Users can delete own meetings') THEN
    CREATE POLICY "Users can delete own meetings" ON public.meetings FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.ai_usage (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  model TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (COALESCE(input_tokens,0) + COALESCE(output_tokens,0)) STORED,
  cost_usd NUMERIC(12,6) DEFAULT 0,
  context_type TEXT DEFAULT 'general' CHECK (context_type IN ('general','flight_search','expense_help','travel_planning')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_usage' AND policyname='Users can view own ai_usage') THEN
    CREATE POLICY "Users can view own ai_usage" ON public.ai_usage FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_usage' AND policyname='Users can insert own ai_usage') THEN
    CREATE POLICY "Users can insert own ai_usage" ON public.ai_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.web_sources (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  href TEXT NOT NULL,
  title TEXT,
  description TEXT,
  favicon_url TEXT,
  content_snippet TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.web_sources ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='web_sources' AND policyname='Users can view own web_sources') THEN
    CREATE POLICY "Users can view own web_sources" ON public.web_sources FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='web_sources' AND policyname='Users can insert own web_sources') THEN
    CREATE POLICY "Users can insert own web_sources" ON public.web_sources FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- =========================
-- Duffel: searches and bookings
-- =========================
CREATE TABLE IF NOT EXISTS public.flight_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_params JSONB NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hotel_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_params JSONB NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.hotel_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duffel_booking_id TEXT NOT NULL UNIQUE,
  confirmation_number TEXT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  total_currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
  guest_details JSONB NOT NULL,
  hotel_details JSONB NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.travel_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_cabin_class TEXT DEFAULT 'economy' CHECK (preferred_cabin_class IN ('economy','premium_economy','business','first')),
  preferred_airlines TEXT[],
  loyalty_programs JSONB DEFAULT '[]',
  dietary_requirements TEXT[],
  accessibility_needs TEXT[],
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.flight_searches ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.hotel_searches ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.hotel_bookings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.travel_preferences ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_searches' AND policyname='Users can view own flight searches') THEN
    CREATE POLICY "Users can view own flight searches" ON public.flight_searches FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_searches' AND policyname='Users can insert own flight searches') THEN
    CREATE POLICY "Users can insert own flight searches" ON public.flight_searches FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hotel_searches' AND policyname='Users can view own hotel searches') THEN
    CREATE POLICY "Users can view own hotel searches" ON public.hotel_searches FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hotel_searches' AND policyname='Users can insert own hotel searches') THEN
    CREATE POLICY "Users can insert own hotel searches" ON public.hotel_searches FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hotel_bookings' AND policyname='Users can view own hotel bookings') THEN
    CREATE POLICY "Users can view own hotel bookings" ON public.hotel_bookings FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hotel_bookings' AND policyname='Users can insert own hotel bookings') THEN
    CREATE POLICY "Users can insert own hotel bookings" ON public.hotel_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='hotel_bookings' AND policyname='Users can update own hotel bookings') THEN
    CREATE POLICY "Users can update own hotel bookings" ON public.hotel_bookings FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_preferences' AND policyname='Users can view own travel preferences') THEN
    CREATE POLICY "Users can view own travel preferences" ON public.travel_preferences FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_preferences' AND policyname='Users can insert own travel preferences') THEN
    CREATE POLICY "Users can insert own travel preferences" ON public.travel_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_preferences' AND policyname='Users can update own travel preferences') THEN
    CREATE POLICY "Users can update own travel preferences" ON public.travel_preferences FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_preferences' AND policyname='Users can delete own travel preferences') THEN
    CREATE POLICY "Users can delete own travel preferences" ON public.travel_preferences FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- =========================
-- Banking (GoCardless)
-- =========================
CREATE TABLE IF NOT EXISTS public.bank_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gocardless_requisition_id TEXT NOT NULL UNIQUE,
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  institution_logo TEXT,
  country_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','expired','suspended','error')),
  access_valid_for_days INTEGER DEFAULT 90,
  max_historical_days INTEGER DEFAULT 730,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  last_sync_at TIMESTAMPTZ,
  error_message TEXT,
  gocardless_agreement_id TEXT,
  agreement_status TEXT,
  accounts_synced INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES public.bank_connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gocardless_account_id TEXT NOT NULL UNIQUE,
  account_name TEXT,
  account_holder_name TEXT,
  iban TEXT,
  account_number TEXT,
  sort_code TEXT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  account_type TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','closed')),
  current_balance DECIMAL(15,2),
  available_balance DECIMAL(15,2),
  balance_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  error_message TEXT,
  last_synced TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS public.bank_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gocardless_transaction_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  transaction_date DATE NOT NULL,
  booking_date DATE,
  value_date DATE,
  merchant_name TEXT,
  counterparty_name TEXT,
  description TEXT,
  reference TEXT,
  transaction_code TEXT,
  category TEXT,
  auto_category TEXT,
  is_business_expense BOOLEAN DEFAULT FALSE,
  expense_id UUID REFERENCES public.expenses(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bank_categorization_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('merchant','description','amount','reference')),
  pattern TEXT NOT NULL,
  category TEXT NOT NULL,
  is_business_expense BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

DO $$ BEGIN
  ALTER TABLE public.bank_connections ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.bank_categorization_rules ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_connections' AND policyname='Users can view their own bank connections') THEN
    CREATE POLICY "Users can view their own bank connections" ON public.bank_connections FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_connections' AND policyname='Users can insert their own bank connections') THEN
    CREATE POLICY "Users can insert their own bank connections" ON public.bank_connections FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_connections' AND policyname='Users can update their own bank connections') THEN
    CREATE POLICY "Users can update their own bank connections" ON public.bank_connections FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_connections' AND policyname='Users can delete their own bank connections') THEN
    CREATE POLICY "Users can delete their own bank connections" ON public.bank_connections FOR DELETE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_accounts' AND policyname='Users can view their own bank accounts') THEN
    CREATE POLICY "Users can view their own bank accounts" ON public.bank_accounts FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_accounts' AND policyname='Users can insert their own bank accounts') THEN
    CREATE POLICY "Users can insert their own bank accounts" ON public.bank_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_accounts' AND policyname='Users can update their own bank accounts') THEN
    CREATE POLICY "Users can update their own bank accounts" ON public.bank_accounts FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_accounts' AND policyname='Users can delete their own bank accounts') THEN
    CREATE POLICY "Users can delete their own bank accounts" ON public.bank_accounts FOR DELETE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_transactions' AND policyname='Users can view their own bank transactions') THEN
    CREATE POLICY "Users can view their own bank transactions" ON public.bank_transactions FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_transactions' AND policyname='Users can insert their own bank transactions') THEN
    CREATE POLICY "Users can insert their own bank transactions" ON public.bank_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_transactions' AND policyname='Users can update their own bank transactions') THEN
    CREATE POLICY "Users can update their own bank transactions" ON public.bank_transactions FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_transactions' AND policyname='Users can delete their own bank transactions') THEN
    CREATE POLICY "Users can delete their own bank transactions" ON public.bank_transactions FOR DELETE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_categorization_rules' AND policyname='Users can view their own categorization rules') THEN
    CREATE POLICY "Users can view their own categorization rules" ON public.bank_categorization_rules FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_categorization_rules' AND policyname='Users can insert their own categorization rules') THEN
    CREATE POLICY "Users can insert their own categorization rules" ON public.bank_categorization_rules FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_categorization_rules' AND policyname='Users can update their own categorization rules') THEN
    CREATE POLICY "Users can update their own categorization rules" ON public.bank_categorization_rules FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='bank_categorization_rules' AND policyname='Users can delete their own categorization rules') THEN
    CREATE POLICY "Users can delete their own categorization rules" ON public.bank_categorization_rules FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Webhook events (for external provider sync tracking)
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL,
  event_type TEXT NOT NULL,
  resource_id TEXT,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('processed','failed','retrying')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================
-- Travel Policies & Compliance
-- =========================
CREATE TABLE IF NOT EXISTS public.travel_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('travel','expense','approval','compliance')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active','draft','archived')),
  description TEXT,
  rules JSONB NOT NULL DEFAULT '[]',
  applicable_roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by TEXT,
  violations_count INTEGER DEFAULT 0,
  compliance_rate NUMERIC DEFAULT 100.0
);

CREATE TABLE IF NOT EXISTS public.policy_violations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES public.travel_policies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low','medium','high')),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  booking_id UUID REFERENCES public.flight_bookings(id) ON DELETE SET NULL,
  expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS public.policy_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES public.travel_policies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('booking','expense','policy_exception')),
  request_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  booking_id UUID REFERENCES public.flight_bookings(id) ON DELETE SET NULL,
  expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL
);

DO $$ BEGIN
  ALTER TABLE public.travel_policies ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.policy_violations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.policy_approvals ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_policies' AND policyname='Users can view their own policies') THEN
    CREATE POLICY "Users can view their own policies" ON public.travel_policies FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_policies' AND policyname='Users can create their own policies') THEN
    CREATE POLICY "Users can create their own policies" ON public.travel_policies FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_policies' AND policyname='Users can update their own policies') THEN
    CREATE POLICY "Users can update their own policies" ON public.travel_policies FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_policies' AND policyname='Users can delete their own policies') THEN
    CREATE POLICY "Users can delete their own policies" ON public.travel_policies FOR DELETE USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='policy_violations' AND policyname='Users can view their own violations') THEN
    CREATE POLICY "Users can view their own violations" ON public.policy_violations FOR SELECT USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='policy_approvals' AND policyname='Users can view their approval requests') THEN
    CREATE POLICY "Users can view their approval requests" ON public.policy_approvals FOR SELECT USING (auth.uid() = user_id OR auth.uid() = approver_id);
  END IF;
END $$;

-- =========================
-- Memory analytics (optional)
-- =========================
-- Remove user_memory_analytics and user_travel_preferences tables as they're redundant
-- The user_preferences table already handles travel preferences

-- =========================
-- Indexes (performance)
-- =========================
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.users(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON public.flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_departure_date ON public.flight_bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON public.flight_bookings(status);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_user_id ON public.ai_chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_session_id ON public.ai_chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_created_at ON public.ai_chat_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON public.chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON public.chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_starts_at ON public.meetings(starts_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON public.ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON public.ai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_web_sources_user_id ON public.web_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_web_sources_href ON public.web_sources(href);
CREATE INDEX IF NOT EXISTS idx_flight_searches_user_id ON public.flight_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_searches_user_id ON public.hotel_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_user_id ON public.hotel_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_preferences_user_id ON public.travel_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_user_id ON public.bank_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_status ON public.bank_connections(status);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_connection_id ON public.bank_accounts(connection_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account_id ON public.bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_user_id ON public.bank_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON public.bank_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_categorization_rules_user_id ON public.bank_categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON public.webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON public.webhook_events(processed_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_resource_id ON public.webhook_events(resource_id);
CREATE INDEX IF NOT EXISTS -- Indexes (performance)
-- =========================
CREATE INDEX IF NOT EXISTS idx_user_memory_analytics_user_id ON public.user_memory_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_travel_preferences_user_id ON public.user_travel_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_travel_preferences_type ON public.user_travel_preferences(preference_type);

-- =========================
-- Triggers for updated_at
-- =========================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_profiles') THEN
    CREATE TRIGGER handle_updated_at_profiles BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_user_preferences') THEN
    CREATE TRIGGER handle_updated_at_user_preferences BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_flight_bookings') THEN
    CREATE TRIGGER handle_updated_at_flight_bookings BEFORE UPDATE ON public.flight_bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_expenses') THEN
    CREATE TRIGGER handle_updated_at_expenses BEFORE UPDATE ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_chat_sessions') THEN
    CREATE TRIGGER handle_updated_at_chat_sessions BEFORE UPDATE ON public.chat_sessions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_meetings') THEN
    CREATE TRIGGER handle_updated_at_meetings BEFORE UPDATE ON public.meetings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_flight_searches') THEN
    CREATE TRIGGER handle_updated_at_flight_searches BEFORE UPDATE ON public.flight_searches
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_hotel_searches') THEN
    CREATE TRIGGER handle_updated_at_hotel_searches BEFORE UPDATE ON public.hotel_searches
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_hotel_bookings') THEN
    CREATE TRIGGER handle_updated_at_hotel_bookings BEFORE UPDATE ON public.hotel_bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_travel_preferences') THEN
    CREATE TRIGGER handle_updated_at_travel_preferences BEFORE UPDATE ON public.travel_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_bank_connections') THEN
    CREATE TRIGGER handle_updated_at_bank_connections BEFORE UPDATE ON public.bank_connections
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_bank_accounts') THEN
    CREATE TRIGGER handle_updated_at_bank_accounts BEFORE UPDATE ON public.bank_accounts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_bank_transactions') THEN
    CREATE TRIGGER handle_updated_at_bank_transactions BEFORE UPDATE ON public.bank_transactions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_webhook_events_updated_at') THEN
    CREATE TRIGGER update_webhook_events_updated_at BEFORE UPDATE ON public.webhook_events
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- =========================
-- Auth hook: create default profile and preferences on signup
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url, first_name, last_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  ELSE
    -- Ensure it calls the latest function
    DROP TRIGGER on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- =========================
-- RPC: increment AI tokens (used by app code)
-- =========================
CREATE OR REPLACE FUNCTION public.increment_ai_tokens(user_id UUID, tokens INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.users
  SET ai_tokens_used = COALESCE(ai_tokens_used, 0) + tokens
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================
-- Compatibility views for existing app code
-- =========================
-- View: public.users (maps profiles + user_preferences into one updatable view)
CREATE OR REPLACE VIEW public.users_view AS
SELECT
  u.id,
  u.first_name,
  u.last_name,
  u.company_name AS company,
  u.job_title,
  u.phone,
  u.onboarding_completed,
  up.timezone,
  up.seat_preference,
  up.meal_preference,
  jsonb_build_object(
    'email', up.email_notifications,
    'sms', up.sms_notifications,
    'push', up.push_notifications
  ) AS notification_settings,
  u.created_at,
  GREATEST(u.updated_at, COALESCE(up.updated_at, u.updated_at)) AS updated_at
FROM public.users u
LEFT JOIN public.user_preferences up ON up.user_id = u.id;

-- Updatable view trigger for UPDATEs on public.users
CREATE OR REPLACE FUNCTION public.users_view_update()
RETURNS TRIGGER AS $$
DECLARE
  v_email BOOLEAN;
  v_sms BOOLEAN;
  v_push BOOLEAN;
BEGIN
  -- Update profiles
  UPDATE public.users u
  SET
    first_name = COALESCE(NEW.first_name, u.first_name),
    last_name = COALESCE(NEW.last_name, u.last_name),
    company_name = COALESCE(NEW.company, u.company_name),
    job_title = COALESCE(NEW.job_title, u.job_title),
    phone = COALESCE(NEW.phone, u.phone),
    onboarding_completed = COALESCE(NEW.onboarding_completed, u.onboarding_completed),
    updated_at = NOW()
  WHERE u.id = OLD.id;

  -- Extract notification flags if provided
  v_email := COALESCE((NEW.notification_settings->>'email')::boolean, NULL);
  v_sms := COALESCE((NEW.notification_settings->>'sms')::boolean, NULL);
  v_push := COALESCE((NEW.notification_settings->>'push')::boolean, NULL);

  -- Upsert preferences
  INSERT INTO public.user_preferences AS up (
    user_id, seat_preference, meal_preference, timezone,
    email_notifications, sms_notifications, push_notifications, updated_at
  ) VALUES (
    OLD.id,
    NEW.seat_preference,
    NEW.meal_preference,
    COALESCE(NEW.timezone, 'UTC'),
    v_email,
    v_sms,
    v_push,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    seat_preference = COALESCE(EXCLUDED.seat_preference, up.seat_preference),
    meal_preference = COALESCE(EXCLUDED.meal_preference, up.meal_preference),
    timezone = COALESCE(EXCLUDED.timezone, up.timezone),
    email_notifications = COALESCE(EXCLUDED.email_notifications, up.email_notifications),
    sms_notifications = COALESCE(EXCLUDED.sms_notifications, up.sms_notifications),
    push_notifications = COALESCE(EXCLUDED.push_notifications, up.push_notifications),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_view_instead_of_update ON public.users_view;
CREATE TRIGGER users_view_instead_of_update
INSTEAD OF UPDATE ON public.users_view
FOR EACH ROW EXECUTE FUNCTION public.users_view_update();

-- View: public.user_profiles for API compatibility (GET/PUT upsert)
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT
  u.id AS user_id,
  u.full_name,
  u.company_name AS company,
  u.phone,
  up.timezone,
  jsonb_build_object(
    'seat_preference', up.seat_preference,
    'meal_preference', up.meal_preference,
    'notification_settings', jsonb_build_object(
      'email', up.email_notifications,
      'sms', up.sms_notifications,
      'push', up.push_notifications
    )
  ) AS preferences,
  u.created_at,
  u.updated_at
FROM public.users u
LEFT JOIN public.user_preferences up ON up.user_id = u.id;

-- Updatable view triggers for INSERT/UPDATE on public.user_profiles
CREATE OR REPLACE FUNCTION public.user_profiles_view_upsert()
RETURNS TRIGGER AS $$
DECLARE
  v_seat TEXT;
  v_meal TEXT;
  v_email BOOLEAN;
  v_sms BOOLEAN;
  v_push BOOLEAN;
BEGIN
  -- Update profiles
  UPDATE public.users u
  SET
    full_name = COALESCE(NEW.full_name, u.full_name),
    company_name = COALESCE(NEW.company, u.company_name),
    phone = COALESCE(NEW.phone, u.phone),
    updated_at = NOW()
  WHERE u.id = COALESCE(NEW.user_id, OLD.user_id);

  -- Extract preferences fields if provided
  IF NEW.preferences IS NOT NULL THEN
    v_seat := (NEW.preferences->>'seat_preference');
    v_meal := (NEW.preferences->>'meal_preference');
    v_email := (NEW.preferences->'notification_settings'->>'email')::boolean;
    v_sms := (NEW.preferences->'notification_settings'->>'sms')::boolean;
    v_push := (NEW.preferences->'notification_settings'->>'push')::boolean;
  END IF;

  INSERT INTO public.user_preferences AS up (
    user_id, seat_preference, meal_preference, timezone,
    email_notifications, sms_notifications, push_notifications, updated_at
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    COALESCE(v_seat, NULL),
    COALESCE(v_meal, NULL),
    COALESCE(NEW.timezone, 'UTC'),
    v_email,
    v_sms,
    v_push,
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    seat_preference = COALESCE(EXCLUDED.seat_preference, up.seat_preference),
    meal_preference = COALESCE(EXCLUDED.meal_preference, up.meal_preference),
    timezone = COALESCE(EXCLUDED.timezone, up.timezone),
    email_notifications = COALESCE(EXCLUDED.email_notifications, up.email_notifications),
    sms_notifications = COALESCE(EXCLUDED.sms_notifications, up.sms_notifications),
    push_notifications = COALESCE(EXCLUDED.push_notifications, up.push_notifications),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profiles_view_instead_of_update ON public.user_profiles;
CREATE TRIGGER user_profiles_view_instead_of_update
INSTEAD OF UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.user_profiles_view_upsert();

DROP TRIGGER IF EXISTS user_profiles_view_instead_of_insert ON public.user_profiles;
CREATE TRIGGER user_profiles_view_instead_of_insert
INSTEAD OF INSERT ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.user_profiles_view_upsert();

-- =========================
-- Grants (optional - RLS governs access)
-- =========================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =========================
-- Row Level Security Policies (UPDATED)
-- =========================

DO $$ BEGIN
  ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.organization_memberships ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.travel_policies ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

-- Organization policies - users can see organizations they belong to
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='organizations' AND policyname='Users can view their organizations') THEN
    CREATE POLICY "Users can view their organizations" ON public.organizations 
    FOR SELECT USING (
      id IN (SELECT organization_id FROM public.organization_memberships WHERE user_id = auth.uid())
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='organization_memberships' AND policyname='Users can view their memberships') THEN
    CREATE POLICY "Users can view their memberships" ON public.organization_memberships 
    FOR SELECT USING (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='travel_policies' AND policyname='Users can view their organization policies') THEN
    CREATE POLICY "Users can view their organization policies" ON public.travel_policies 
    FOR SELECT USING (
      organization_id IN (SELECT organization_id FROM public.organization_memberships WHERE user_id = auth.uid())
    );
  END IF;
END $$;

-- Updated user policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users can view own profile') THEN
    CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users can update own profile') THEN
    CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='users' AND policyname='Users can insert own profile') THEN
    CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- Updated flight booking policies with organization context
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_bookings' AND policyname='Users can view accessible flight bookings') THEN
    CREATE POLICY "Users can view accessible flight bookings" ON public.flight_bookings 
    FOR SELECT USING (
      user_id = auth.uid() OR 
      (organization_id IN (
        SELECT om.organization_id FROM public.organization_memberships om 
        WHERE om.user_id = auth.uid() AND om.role IN ('owner', 'admin')
      ))
    );
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_bookings' AND policyname='Users can insert own flight bookings') THEN
    CREATE POLICY "Users can insert own flight bookings" ON public.flight_bookings 
    FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='flight_bookings' AND policyname='Users can update own flight bookings') THEN
    CREATE POLICY "Users can update own flight bookings" ON public.flight_bookings 
    FOR UPDATE USING (user_id = auth.uid());
  END IF;
END $$;

-- =========================
-- Triggers for updated_at
-- =========================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_organizations') THEN
    CREATE TRIGGER handle_updated_at_organizations BEFORE UPDATE ON public.organizations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_organization_memberships') THEN
    CREATE TRIGGER handle_updated_at_organization_memberships BEFORE UPDATE ON public.organization_memberships FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_travel_policies') THEN
    CREATE TRIGGER handle_updated_at_travel_policies BEFORE UPDATE ON public.travel_policies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_users') THEN
    CREATE TRIGGER handle_updated_at_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- Adding employee scoring tables for dynamic auto-approval system
CREATE TABLE IF NOT EXISTS public.employee_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  compliance_score NUMERIC DEFAULT 85.0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
  trust_level TEXT DEFAULT 'new' CHECK (trust_level IN ('new', 'developing', 'trusted', 'expert')),
  risk_category TEXT DEFAULT 'medium' CHECK (risk_category IN ('low', 'medium', 'high')),
  total_bookings INTEGER DEFAULT 0,
  approved_bookings INTEGER DEFAULT 0,
  rejected_bookings INTEGER DEFAULT 0,
  policy_violations INTEGER DEFAULT 0,
  average_booking_amount NUMERIC DEFAULT 0,
  total_spend NUMERIC DEFAULT 0,
  savings_generated NUMERIC DEFAULT 0,
  books_in_advance_days NUMERIC DEFAULT 7,
  prefers_policy_compliant BOOLEAN DEFAULT TRUE,
  last_violation_date TIMESTAMPTZ,
  auto_approval_limit NUMERIC DEFAULT 1500,
  requires_manual_review BOOLEAN DEFAULT FALSE,
  score_updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, organization_id)
);

CREATE TABLE IF NOT EXISTS public.booking_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.flight_bookings(id) ON DELETE SET NULL,
  expense_id UUID REFERENCES public.expenses(id) ON DELETE SET NULL,
  approval_type TEXT DEFAULT 'auto' CHECK (approval_type IN ('auto', 'manual', 'ai_assisted')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'escalated')),
  decision_reason TEXT,
  confidence_score NUMERIC CHECK (confidence_score >= 0 AND confidence_score <= 100),
  policy_checks JSONB DEFAULT '{}',
  violated_policies TEXT[] DEFAULT '{}',
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ai_model_used TEXT,
  processing_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to calculate employee score based on historical data
CREATE OR REPLACE FUNCTION calculate_employee_score(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_total_bookings INTEGER := 0;
  v_approved_bookings INTEGER := 0;
  v_rejected_bookings INTEGER := 0;
  v_violations INTEGER := 0;
  v_avg_amount NUMERIC := 0;
  v_total_spend NUMERIC := 0;
  v_advance_days NUMERIC := 7;
  v_compliance_score NUMERIC := 85;
  v_trust_level TEXT := 'new';
  v_auto_limit NUMERIC := 1500;
BEGIN
  -- Calculate booking statistics
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected'),
    AVG(amount),
    SUM(amount) FILTER (WHERE status = 'approved')
  INTO v_total_bookings, v_approved_bookings, v_rejected_bookings, v_avg_amount, v_total_spend
  FROM booking_approvals 
  WHERE user_id = p_user_id;

  -- Calculate policy violations
  SELECT COUNT(*) INTO v_violations
  FROM policy_violations 
  WHERE user_id = p_user_id AND resolved = FALSE;

  -- Calculate average advance booking days
  SELECT AVG(EXTRACT(DAY FROM (departure_date - created_at)))
  INTO v_advance_days
  FROM flight_bookings 
  WHERE user_id = p_user_id AND created_at >= NOW() - INTERVAL '6 months';

  -- Calculate compliance score
  IF v_total_bookings > 0 THEN
    v_compliance_score := GREATEST(0, 100 - (v_violations * 10) - ((v_rejected_bookings::NUMERIC / v_total_bookings) * 30));
  END IF;

  -- Determine trust level
  IF v_total_bookings >= 50 AND v_compliance_score >= 95 THEN
    v_trust_level := 'expert';
    v_auto_limit := 5000;
  ELSIF v_total_bookings >= 20 AND v_compliance_score >= 90 THEN
    v_trust_level := 'trusted';
    v_auto_limit := 3000;
  ELSIF v_total_bookings >= 5 AND v_compliance_score >= 80 THEN
    v_trust_level := 'developing';
    v_auto_limit := 2000;
  ELSE
    v_trust_level := 'new';
    v_auto_limit := 1500;
  END IF;

  -- Upsert employee score
  INSERT INTO employee_scores (
    user_id, compliance_score, trust_level, total_bookings, approved_bookings,
    rejected_bookings, policy_violations, average_booking_amount, total_spend,
    books_in_advance_days, auto_approval_limit, score_updated_at, updated_at
  ) VALUES (
    p_user_id, v_compliance_score, v_trust_level, v_total_bookings, v_approved_bookings,
    v_rejected_bookings, v_violations, COALESCE(v_avg_amount, 0), COALESCE(v_total_spend, 0),
    COALESCE(v_advance_days, 7), v_auto_limit, NOW(), NOW()
  )
  ON CONFLICT (user_id, organization_id) 
  DO UPDATE SET
    compliance_score = EXCLUDED.compliance_score,
    trust_level = EXCLUDED.trust_level,
    total_bookings = EXCLUDED.total_bookings,
    approved_bookings = EXCLUDED.approved_bookings,
    rejected_bookings = EXCLUDED.rejected_bookings,
    policy_violations = EXCLUDED.policy_violations,
    average_booking_amount = EXCLUDED.average_booking_amount,
    total_spend = EXCLUDED.total_spend,
    books_in_advance_days = EXCLUDED.books_in_advance_days,
    auto_approval_limit = EXCLUDED.auto_approval_limit,
    score_updated_at = NOW(),
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to update employee score after booking approvals
CREATE OR REPLACE FUNCTION trigger_update_employee_score()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM calculate_employee_score(NEW.user_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_employee_score_trigger
  AFTER INSERT OR UPDATE ON booking_approvals
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_employee_score();

-- =========================
-- Memory analytics (optional)
-- =========================
-- Remove user_memory_analytics and user_travel_preferences tables as they're redundant
-- The user_preferences table already handles travel preferences

-- =========================
-- Indexes (performance)
-- =========================
CREATE INDEX IF NOT EXISTS idx_profiles_onboarding ON public.users(onboarding_completed);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON public.flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_departure_date ON public.flight_bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON public.flight_bookings(status);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_user_id ON public.ai_chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_session_id ON public.ai_chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_created_at ON public.ai_chat_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON public.chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated_at ON public.chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_last_message_at ON public.chat_sessions(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_starts_at ON public.meetings(starts_at);
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON public.ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON public.ai_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_web_sources_user_id ON public.web_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_web_sources_href ON public.web_sources(href);
CREATE INDEX IF NOT EXISTS idx_flight_searches_user_id ON public.flight_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_searches_user_id ON public.hotel_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_user_id ON public.hotel_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_preferences_user_id ON public.travel_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_user_id ON public.bank_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_status ON public.bank_connections(status);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_connection_id ON public.bank_accounts(connection_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON public.bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account_id ON public.bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_user_id ON public.bank_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON public.bank_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_categorization_rules_user_id ON public.bank_categorization_rules(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_provider ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_status ON public.webhook_events(status);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON public.webhook_events(processed_at);
CREATE INDEX IF NOT EXISTS idx_webhook_events_resource_id ON public.webhook_events(resource_id);
CREATE INDEX IF NOT EXISTS idx_employee_scores_user_id ON public.employee_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_approvals_user_id ON public.booking_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_approvals_booking_id ON public.booking_approvals(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_approvals_expense_id ON public.booking_approvals(expense_id);

-- =========================
-- Triggers for updated_at
-- =========================
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_employee_scores') THEN
    CREATE TRIGGER handle_updated_at_employee_scores BEFORE UPDATE ON public.employee_scores FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_booking_approvals') THEN
    CREATE TRIGGER handle_updated_at_booking_approvals BEFORE UPDATE ON public.booking_approvals FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- =========================
-- Row Level Security Policies (UPDATED)
-- =========================

DO $$ BEGIN
  ALTER TABLE public.employee_scores ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.booking_approvals ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='employee_scores' AND policyname='Users can view their own employee scores') THEN
    CREATE POLICY "Users can view their own employee scores" ON public.employee_scores FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='booking_approvals' AND policyname='Users can view their own booking approvals') THEN
    CREATE POLICY "Users can view their own booking approvals" ON public.booking_approvals FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;
