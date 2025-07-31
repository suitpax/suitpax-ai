-- Add Stripe-related columns to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_id TEXT,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive',
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'enterprise')),
ADD COLUMN IF NOT EXISTS subscription_current_period_start TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_current_period_end TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS subscription_cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- Create subscriptions table for detailed tracking
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL,
  plan TEXT NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  amount INTEGER NOT NULL, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create usage_tracking table for plan limits
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year TEXT NOT NULL, -- format: YYYY-MM
  flights_booked INTEGER DEFAULT 0,
  expenses_tracked INTEGER DEFAULT 0,
  ai_queries_made INTEGER DEFAULT 0,
  team_members_added INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_id_month ON usage_tracking(user_id, month_year);

-- Create RLS policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Payment history policies
CREATE POLICY "Users can view own payment history" ON payment_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payment history" ON payment_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Usage tracking policies
CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage" ON usage_tracking
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own usage" ON usage_tracking
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to get current usage for a user
CREATE OR REPLACE FUNCTION get_current_usage(user_uuid UUID)
RETURNS TABLE (
  flights_booked INTEGER,
  expenses_tracked INTEGER,
  ai_queries_made INTEGER,
  team_members_added INTEGER
) AS $$
DECLARE
  current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(ut.flights_booked, 0),
    COALESCE(ut.expenses_tracked, 0),
    COALESCE(ut.ai_queries_made, 0),
    COALESCE(ut.team_members_added, 0)
  FROM usage_tracking ut
  WHERE ut.user_id = user_uuid AND ut.month_year = current_month;
  
  -- If no record exists, return zeros
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, 0, 0, 0;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION increment_usage(
  user_uuid UUID,
  usage_type TEXT,
  increment_by INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
  current_month TEXT := TO_CHAR(NOW(), 'YYYY-MM');
BEGIN
  INSERT INTO usage_tracking (user_id, month_year, flights_booked, expenses_tracked, ai_queries_made, team_members_added)
  VALUES (
    user_uuid, 
    current_month,
    CASE WHEN usage_type = 'flights' THEN increment_by ELSE 0 END,
    CASE WHEN usage_type = 'expenses' THEN increment_by ELSE 0 END,
    CASE WHEN usage_type = 'ai_queries' THEN increment_by ELSE 0 END,
    CASE WHEN usage_type = 'team_members' THEN increment_by ELSE 0 END
  )
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET
    flights_booked = usage_tracking.flights_booked + CASE WHEN usage_type = 'flights' THEN increment_by ELSE 0 END,
    expenses_tracked = usage_tracking.expenses_tracked + CASE WHEN usage_type = 'expenses' THEN increment_by ELSE 0 END,
    ai_queries_made = usage_tracking.ai_queries_made + CASE WHEN usage_type = 'ai_queries' THEN increment_by ELSE 0 END,
    team_members_added = usage_tracking.team_members_added + CASE WHEN usage_type = 'team_members' THEN increment_by ELSE 0 END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
