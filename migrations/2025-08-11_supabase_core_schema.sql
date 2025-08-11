-- Core Supabase schema aligned with application code
-- Safe/idempotent: uses IF NOT EXISTS and conditional DO blocks

-- Extensions required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================
-- Table: profiles
-- =========================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  job_title TEXT,
  phone TEXT,
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'inactive',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  ai_tokens_used INTEGER DEFAULT 0,
  ai_tokens_limit INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure missing columns exist (when table already existed)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='first_name'
  ) THEN ALTER TABLE public.profiles ADD COLUMN first_name TEXT; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='last_name'
  ) THEN ALTER TABLE public.profiles ADD COLUMN last_name TEXT; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='job_title'
  ) THEN ALTER TABLE public.profiles ADD COLUMN job_title TEXT; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='phone'
  ) THEN ALTER TABLE public.profiles ADD COLUMN phone TEXT; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='onboarding_completed'
  ) THEN ALTER TABLE public.profiles ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='ai_tokens_used'
  ) THEN ALTER TABLE public.profiles ADD COLUMN ai_tokens_used INTEGER DEFAULT 0; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='ai_tokens_limit'
  ) THEN ALTER TABLE public.profiles ADD COLUMN ai_tokens_limit INTEGER DEFAULT 100; END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name='profiles' AND column_name='first_name'
  ) THEN ALTER TABLE public.profiles ADD COLUMN first_name TEXT; END IF;
END $$;

-- Enable RLS and policies for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can view own profile'
  ) THEN
    CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can update own profile'
  ) THEN
    CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Users can insert own profile'
  ) THEN
    CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- =========================
-- Table: flight_bookings (reconcile with Duffel schema)
-- =========================
-- Create if not exists; in Duffel schema it likely exists already
CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_reference TEXT,
  status TEXT DEFAULT 'pending',
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
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- If the Duffel version already exists, add missing columns and fix types
DO $$ BEGIN
  -- Ensure columns used by the app exist
  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='departure_airport';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN departure_airport TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='arrival_airport';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN arrival_airport TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='departure_time';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN departure_time TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='arrival_time';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN arrival_time TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='aircraft_type';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN aircraft_type TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='passenger_name';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN passenger_name TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='passenger_email';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN passenger_email TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='seat_preference';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN seat_preference TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='meal_preference';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN meal_preference TEXT; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='base_price';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN base_price DECIMAL(10,2); END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='taxes';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN taxes DECIMAL(10,2); END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='total_price';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN total_price DECIMAL(10,2); END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='currency';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN currency TEXT DEFAULT 'USD'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='booking_class';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN booking_class TEXT DEFAULT 'economy'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='is_round_trip';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN is_round_trip BOOLEAN DEFAULT FALSE; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='booking_source';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN booking_source TEXT DEFAULT 'suitpax'; END IF;

  PERFORM 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='external_booking_id';
  IF NOT FOUND THEN ALTER TABLE public.flight_bookings ADD COLUMN external_booking_id TEXT; END IF;

  -- Ensure datetime types are TIMESTAMPTZ (migrate from DATE if necessary)
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='departure_date' AND data_type IN ('date')
  ) THEN
    ALTER TABLE public.flight_bookings 
      ALTER COLUMN departure_date TYPE TIMESTAMPTZ USING (departure_date::timestamptz);
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='flight_bookings' AND column_name='return_date' AND data_type IN ('date')
  ) THEN
    ALTER TABLE public.flight_bookings 
      ALTER COLUMN return_date TYPE TIMESTAMPTZ USING (return_date::timestamptz);
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON public.flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_departure_date ON public.flight_bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON public.flight_bookings(status);

-- RLS
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;
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

-- =========================
-- Table: expenses
-- =========================
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flight_booking_id UUID REFERENCES public.flight_bookings(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other',
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending',
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  receipt_url TEXT,
  receipt_filename TEXT,
  expense_date DATE NOT NULL,
  location TEXT,
  vendor TEXT,
  project_code TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_status ON public.expenses(status);
CREATE INDEX IF NOT EXISTS idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON public.expenses(category);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
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

-- =========================
-- Table: ai_chat_logs
-- =========================
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

CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_user_id ON public.ai_chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_session_id ON public.ai_chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_created_at ON public.ai_chat_logs(created_at);

ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
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

-- =========================
-- Table: user_preferences
-- =========================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
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

-- =========================
-- Functions and triggers
-- =========================
-- updated_at maintenance
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- on new auth user: create profile and default preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: increment_ai_tokens
CREATE OR REPLACE FUNCTION public.increment_ai_tokens(user_id UUID, tokens INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles
  SET ai_tokens_used = COALESCE(ai_tokens_used, 0) + tokens
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers: on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Triggers: updated_at maintenance
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_profiles'
  ) THEN
    CREATE TRIGGER handle_updated_at_profiles BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_flight_bookings'
  ) THEN
    CREATE TRIGGER handle_updated_at_flight_bookings BEFORE UPDATE ON public.flight_bookings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_expenses'
  ) THEN
    CREATE TRIGGER handle_updated_at_expenses BEFORE UPDATE ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_user_preferences'
  ) THEN
    CREATE TRIGGER handle_updated_at_user_preferences BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;

-- =========================
-- Meetings & Collaboration
-- =========================
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

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_meetings_user_id ON public.meetings(user_id);
CREATE INDEX IF NOT EXISTS idx_meetings_starts_at ON public.meetings(starts_at);

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

-- =========================
-- AI Usage & Quotas
-- =========================
CREATE TABLE IF NOT EXISTS public.ai_usage (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID,
  model TEXT NOT NULL,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS ((COALESCE(input_tokens,0) + COALESCE(output_tokens,0))) STORED,
  cost_usd NUMERIC(12,6) DEFAULT 0,
  context_type TEXT DEFAULT 'general' CHECK (context_type IN ('general','flight_search','expense_help','travel_planning')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON public.ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON public.ai_usage(created_at);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_usage' AND policyname='Users can view own ai_usage') THEN
    CREATE POLICY "Users can view own ai_usage" ON public.ai_usage FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='ai_usage' AND policyname='Users can insert own ai_usage') THEN
    CREATE POLICY "Users can insert own ai_usage" ON public.ai_usage FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- =========================
-- Web Sources (attributions)
-- =========================
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

ALTER TABLE public.web_sources ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_web_sources_user_id ON public.web_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_web_sources_href ON public.web_sources(href);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='web_sources' AND policyname='Users can view own web_sources') THEN
    CREATE POLICY "Users can view own web_sources" ON public.web_sources FOR SELECT USING (user_id IS NULL OR auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='web_sources' AND policyname='Users can insert own web_sources') THEN
    CREATE POLICY "Users can insert own web_sources" ON public.web_sources FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Triggers for updated_at
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'handle_updated_at_meetings') THEN
    CREATE TRIGGER handle_updated_at_meetings BEFORE UPDATE ON public.meetings
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
  END IF;
END $$;
