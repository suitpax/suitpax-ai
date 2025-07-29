-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.ai_conversations CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.flight_bookings CASCADE;
DROP TABLE IF EXISTS public.hotel_bookings CASCADE;
DROP TABLE IF EXISTS public.calendar_events CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.locations CASCADE;
DROP TABLE IF EXISTS public.expenses CASCADE;

-- Drop existing functions and triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.update_updated_at_column();

-- Create users table with plan-based access
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    company_name TEXT,
    plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'pro', 'enterprise')),
    
    -- Token and usage limits based on plan
    ai_tokens_used INTEGER DEFAULT 0,
    ai_tokens_limit INTEGER DEFAULT 5000, -- free: 5k, basic: 15k, pro: 25k, enterprise: unlimited
    travel_searches_used INTEGER DEFAULT 0,
    travel_searches_limit INTEGER DEFAULT 10, -- free: 10, basic: 30, pro: 50, enterprise: unlimited
    team_members_count INTEGER DEFAULT 1,
    team_members_limit INTEGER DEFAULT 5, -- free: 5, basic: 15, pro: 25, enterprise: unlimited
    
    -- Plan features
    has_ai_expense_management BOOLEAN DEFAULT FALSE,
    has_custom_policies BOOLEAN DEFAULT FALSE,
    has_priority_support BOOLEAN DEFAULT FALSE,
    has_bank_integration BOOLEAN DEFAULT FALSE,
    has_crm_integration BOOLEAN DEFAULT FALSE,
    
    -- Onboarding and preferences
    onboarding_completed BOOLEAN DEFAULT FALSE,
    travel_preferences JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    plan_updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create AI conversations table
CREATE TABLE public.ai_conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    agent_id TEXT NOT NULL,
    title TEXT NOT NULL,
    messages JSONB DEFAULT '[]'::jsonb,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create simple travel bookings table
CREATE TABLE public.travel_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('flight', 'hotel', 'car')),
    booking_data JSONB NOT NULL,
    total_amount DECIMAL(10,2),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    booking_reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_bookings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own conversations" ON public.ai_conversations
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings" ON public.travel_bookings
    FOR ALL USING (auth.uid() = user_id);

-- Function to handle new user registration with plan setup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (
        id, 
        email, 
        full_name,
        plan_type,
        ai_tokens_limit,
        travel_searches_limit,
        team_members_limit,
        has_ai_expense_management,
        has_custom_policies,
        has_priority_support,
        has_bank_integration,
        has_crm_integration
    )
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'free', -- Default plan
        5000,   -- Free plan tokens
        10,     -- Free plan searches
        5,      -- Free plan team members
        FALSE,  -- No AI expense management
        FALSE,  -- No custom policies
        FALSE,  -- No priority support
        FALSE,  -- No bank integration
        FALSE   -- No CRM integration
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update plan features
CREATE OR REPLACE FUNCTION public.update_plan_features()
RETURNS TRIGGER AS $$
BEGIN
    -- Update limits and features based on plan type
    CASE NEW.plan_type
        WHEN 'free' THEN
            NEW.ai_tokens_limit := 5000;
            NEW.travel_searches_limit := 10;
            NEW.team_members_limit := 5;
            NEW.has_ai_expense_management := FALSE;
            NEW.has_custom_policies := FALSE;
            NEW.has_priority_support := FALSE;
            NEW.has_bank_integration := FALSE;
            NEW.has_crm_integration := FALSE;
        WHEN 'basic' THEN
            NEW.ai_tokens_limit := 15000;
            NEW.travel_searches_limit := 30;
            NEW.team_members_limit := 15;
            NEW.has_ai_expense_management := FALSE;
            NEW.has_custom_policies := FALSE;
            NEW.has_priority_support := TRUE;
            NEW.has_bank_integration := TRUE;
            NEW.has_crm_integration := TRUE;
        WHEN 'pro' THEN
            NEW.ai_tokens_limit := 25000;
            NEW.travel_searches_limit := 50;
            NEW.team_members_limit := 25;
            NEW.has_ai_expense_management := TRUE;
            NEW.has_custom_policies := TRUE;
            NEW.has_priority_support := TRUE;
            NEW.has_bank_integration := TRUE;
            NEW.has_crm_integration := TRUE;
        WHEN 'enterprise' THEN
            NEW.ai_tokens_limit := -1; -- Unlimited
            NEW.travel_searches_limit := -1; -- Unlimited
            NEW.team_members_limit := -1; -- Unlimited
            NEW.has_ai_expense_management := TRUE;
            NEW.has_custom_policies := TRUE;
            NEW.has_priority_support := TRUE;
            NEW.has_bank_integration := TRUE;
            NEW.has_crm_integration := TRUE;
    END CASE;
    
    NEW.plan_updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_plan_features_trigger
    BEFORE UPDATE OF plan_type ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_plan_features();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_ai_conversations_updated_at
    BEFORE UPDATE ON public.ai_conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_travel_bookings_updated_at
    BEFORE UPDATE ON public.travel_bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_users_plan_type ON public.users(plan_type);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_conversations_agent_id ON public.ai_conversations(agent_id);
CREATE INDEX idx_travel_bookings_user_id ON public.travel_bookings(user_id);
CREATE INDEX idx_travel_bookings_type ON public.travel_bookings(type);
