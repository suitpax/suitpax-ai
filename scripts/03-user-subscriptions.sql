-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, yearly
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Create indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX idx_user_subscriptions_stripe_subscription ON user_subscriptions(stripe_subscription_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- Function to get user's current plan
CREATE OR REPLACE FUNCTION get_user_plan(user_uuid UUID)
RETURNS TABLE (
  plan_name VARCHAR(50),
  max_ai_interactions INTEGER,
  max_team_members INTEGER,
  max_searches_per_month INTEGER,
  subscription_status VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.name,
    sp.max_ai_interactions,
    sp.max_team_members,
    sp.max_searches_per_month,
    COALESCE(us.status, 'free') as subscription_status
  FROM subscription_plans sp
  LEFT JOIN user_subscriptions us ON us.plan_id = sp.id AND us.user_id = user_uuid
  WHERE sp.name = COALESCE(
    (SELECT p.name FROM subscription_plans p 
     JOIN user_subscriptions s ON s.plan_id = p.id 
     WHERE s.user_id = user_uuid AND s.status = 'active'),
    'free'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
