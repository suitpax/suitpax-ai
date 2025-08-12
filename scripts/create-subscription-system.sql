-- Creating comprehensive subscription system with Stripe integration
-- Subscriptions table to track user subscription status
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT NOT NULL,
  plan_name TEXT NOT NULL CHECK (plan_name IN ('free', 'basic', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'unpaid', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plan limits table to define what each plan includes
CREATE TABLE IF NOT EXISTS plan_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL UNIQUE CHECK (plan_name IN ('free', 'basic', 'pro', 'enterprise')),
  ai_tokens_limit BIGINT NOT NULL DEFAULT 0,
  team_members_limit INTEGER NOT NULL DEFAULT 1,
  travel_searches_limit INTEGER NOT NULL DEFAULT 0,
  has_ai_expense_management BOOLEAN DEFAULT FALSE,
  has_custom_policies BOOLEAN DEFAULT FALSE,
  has_priority_support BOOLEAN DEFAULT FALSE,
  has_bank_integration BOOLEAN DEFAULT FALSE,
  has_crm_integration BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert plan limits based on your pricing structure
INSERT INTO plan_limits (plan_name, ai_tokens_limit, team_members_limit, travel_searches_limit, has_ai_expense_management, has_custom_policies, has_priority_support, has_bank_integration, has_crm_integration) VALUES
('free', 10000, 1, 5, FALSE, FALSE, FALSE, FALSE, FALSE),
('basic', 50000, 5, 50, TRUE, FALSE, FALSE, FALSE, FALSE),
('pro', 200000, 20, 200, TRUE, TRUE, TRUE, TRUE, FALSE),
('enterprise', -1, -1, -1, TRUE, TRUE, TRUE, TRUE, TRUE) -- -1 means unlimited
ON CONFLICT (plan_name) DO UPDATE SET
  ai_tokens_limit = EXCLUDED.ai_tokens_limit,
  team_members_limit = EXCLUDED.team_members_limit,
  travel_searches_limit = EXCLUDED.travel_searches_limit,
  has_ai_expense_management = EXCLUDED.has_ai_expense_management,
  has_custom_policies = EXCLUDED.has_custom_policies,
  has_priority_support = EXCLUDED.has_priority_support,
  has_bank_integration = EXCLUDED.has_bank_integration,
  has_crm_integration = EXCLUDED.has_crm_integration,
  updated_at = NOW();

-- Function to get user's current plan limits
CREATE OR REPLACE FUNCTION get_user_plan_limits(user_uuid UUID)
RETURNS TABLE (
  plan_name TEXT,
  ai_tokens_limit BIGINT,
  ai_tokens_used BIGINT,
  team_members_limit INTEGER,
  travel_searches_limit INTEGER,
  travel_searches_used INTEGER,
  has_ai_expense_management BOOLEAN,
  has_custom_policies BOOLEAN,
  has_priority_support BOOLEAN,
  has_bank_integration BOOLEAN,
  has_crm_integration BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(s.plan_name, 'free') as plan_name,
    pl.ai_tokens_limit,
    COALESCE(u.ai_tokens_used, 0) as ai_tokens_used,
    pl.team_members_limit,
    pl.travel_searches_limit,
    COALESCE(u.travel_searches_used, 0) as travel_searches_used,
    pl.has_ai_expense_management,
    pl.has_custom_policies,
    pl.has_priority_support,
    pl.has_bank_integration,
    pl.has_crm_integration
  FROM users u
  LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
  LEFT JOIN plan_limits pl ON COALESCE(s.plan_name, 'free') = pl.plan_name
  WHERE u.id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can use AI tokens
CREATE OR REPLACE FUNCTION can_use_ai_tokens(user_uuid UUID, tokens_needed INTEGER DEFAULT 1)
RETURNS BOOLEAN AS $$
DECLARE
  user_limits RECORD;
BEGIN
  SELECT * INTO user_limits FROM get_user_plan_limits(user_uuid);
  
  -- Enterprise plan has unlimited tokens (-1)
  IF user_limits.ai_tokens_limit = -1 THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has enough tokens remaining
  RETURN (user_limits.ai_tokens_used + tokens_needed) <= user_limits.ai_tokens_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment AI token usage
CREATE OR REPLACE FUNCTION increment_ai_tokens(user_uuid UUID, tokens_used INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user can use the tokens first
  IF NOT can_use_ai_tokens(user_uuid, tokens_used) THEN
    RETURN FALSE;
  END IF;
  
  -- Update the user's token usage
  UPDATE users 
  SET 
    ai_tokens_used = COALESCE(ai_tokens_used, 0) + tokens_used,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

-- Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all subscriptions (for webhooks)
CREATE POLICY "Service role can manage subscriptions" ON subscriptions
  FOR ALL USING (auth.role() = 'service_role');

-- Everyone can read plan limits (public information)
CREATE POLICY "Anyone can view plan limits" ON plan_limits
  FOR SELECT USING (true);

-- Only service role can modify plan limits
CREATE POLICY "Service role can manage plan limits" ON plan_limits
  FOR ALL USING (auth.role() = 'service_role');

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_plan_limits_plan_name ON plan_limits(plan_name);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_limits_updated_at
  BEFORE UPDATE ON plan_limits
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
