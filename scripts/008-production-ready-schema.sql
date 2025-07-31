-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS public.flight_bookings CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.ai_chat_logs CASCADE;
DROP TABLE IF EXISTS public.user_preferences CASCADE;

-- Create profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  company_name TEXT,
  job_title TEXT,
  phone TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'premium', 'enterprise')),
  subscription_status TEXT DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'cancelled', 'trialing')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  ai_tokens_used INTEGER DEFAULT 0,
  ai_tokens_limit INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create flight_bookings table
CREATE TABLE public.flight_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  booking_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  
  -- Flight details
  departure_airport TEXT NOT NULL,
  arrival_airport TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date TIMESTAMPTZ NOT NULL,
  return_date TIMESTAMPTZ,
  departure_time TEXT,
  arrival_time TEXT,
  
  -- Airline details
  airline TEXT,
  flight_number TEXT,
  aircraft_type TEXT,
  
  -- Passenger details
  passenger_name TEXT,
  passenger_email TEXT,
  seat_preference TEXT,
  meal_preference TEXT,
  
  -- Pricing
  base_price DECIMAL(10,2),
  taxes DECIMAL(10,2),
  total_price DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  
  -- Booking metadata
  booking_class TEXT DEFAULT 'economy' CHECK (booking_class IN ('economy', 'premium_economy', 'business', 'first')),
  is_round_trip BOOLEAN DEFAULT FALSE,
  booking_source TEXT DEFAULT 'suitpax',
  external_booking_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  flight_booking_id UUID REFERENCES public.flight_bookings(id) ON DELETE SET NULL,
  
  -- Expense details
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'other' CHECK (category IN ('flight', 'hotel', 'meal', 'transport', 'conference', 'other')),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  
  -- Status and approval
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reimbursed')),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Receipt and documentation
  receipt_url TEXT,
  receipt_filename TEXT,
  expense_date DATE NOT NULL,
  
  -- Location and context
  location TEXT,
  vendor TEXT,
  project_code TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI chat logs table
CREATE TABLE public.ai_chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_id TEXT,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  model_used TEXT DEFAULT 'claude-3-sonnet',
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER,
  context_type TEXT DEFAULT 'general' CHECK (context_type IN ('general', 'flight_search', 'expense_help', 'travel_planning')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user preferences table
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Travel preferences
  preferred_airlines TEXT[],
  preferred_airports TEXT[],
  seat_preference TEXT DEFAULT 'aisle' CHECK (seat_preference IN ('aisle', 'window', 'middle', 'no_preference')),
  meal_preference TEXT DEFAULT 'standard',
  class_preference TEXT DEFAULT 'economy' CHECK (class_preference IN ('economy', 'premium_economy', 'business', 'first')),
  
  -- Notification preferences
  email_notifications BOOLEAN DEFAULT TRUE,
  sms_notifications BOOLEAN DEFAULT FALSE,
  push_notifications BOOLEAN DEFAULT TRUE,
  booking_reminders BOOLEAN DEFAULT TRUE,
  expense_reminders BOOLEAN DEFAULT TRUE,
  
  -- Company policies
  max_flight_budget DECIMAL(10,2),
  requires_approval_over DECIMAL(10,2) DEFAULT 500.00,
  allowed_booking_classes TEXT[] DEFAULT ARRAY['economy', 'premium_economy'],
  
  -- UI preferences
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  date_format TEXT DEFAULT 'MM/DD/YYYY',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for flight_bookings
CREATE POLICY "Users can view own flight bookings" ON public.flight_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flight bookings" ON public.flight_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flight bookings" ON public.flight_bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own flight bookings" ON public.flight_bookings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for expenses
CREATE POLICY "Users can view own expenses" ON public.expenses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expenses" ON public.expenses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expenses" ON public.expenses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expenses" ON public.expenses
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ai_chat_logs
CREATE POLICY "Users can view own chat logs" ON public.ai_chat_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat logs" ON public.ai_chat_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions and Triggers

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, avatar_url, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  
  -- Create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to increment AI token usage
CREATE OR REPLACE FUNCTION public.increment_ai_tokens(user_id UUID, tokens INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.profiles 
  SET ai_tokens_used = ai_tokens_used + tokens
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER handle_updated_at_profiles
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_flight_bookings
  BEFORE UPDATE ON public.flight_bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_expenses
  BEFORE UPDATE ON public.expenses
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_preferences
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Indexes for performance
CREATE INDEX idx_flight_bookings_user_id ON public.flight_bookings(user_id);
CREATE INDEX idx_flight_bookings_departure_date ON public.flight_bookings(departure_date);
CREATE INDEX idx_flight_bookings_status ON public.flight_bookings(status);

CREATE INDEX idx_expenses_user_id ON public.expenses(user_id);
CREATE INDEX idx_expenses_status ON public.expenses(status);
CREATE INDEX idx_expenses_expense_date ON public.expenses(expense_date);
CREATE INDEX idx_expenses_category ON public.expenses(category);

CREATE INDEX idx_ai_chat_logs_user_id ON public.ai_chat_logs(user_id);
CREATE INDEX idx_ai_chat_logs_session_id ON public.ai_chat_logs(session_id);
CREATE INDEX idx_ai_chat_logs_created_at ON public.ai_chat_logs(created_at);

-- Sample data for testing (remove in production)
-- This will only run if there are no existing profiles
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles LIMIT 1) THEN
    -- Insert sample data only for development
    INSERT INTO public.profiles (id, full_name, first_name, last_name, company_name, subscription_plan)
    SELECT 
      auth.uid(),
      'Test User',
      'Test',
      'User',
      'Test Company',
      'free'
    WHERE auth.uid() IS NOT NULL;
  END IF;
END $$;
