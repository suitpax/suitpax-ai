-- Create user subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, canceled, past_due, unpaid
  billing_cycle VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, annual
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create trigger for user_subscriptions
CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get user's current plan
CREATE OR REPLACE FUNCTION get_user_plan(user_uuid UUID)
RETURNS TABLE (
  plan_name VARCHAR(50),
  ai_searches_limit INTEGER,
  team_members_limit INTEGER,
  features JSONB,
  status VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sp.name,
    sp.ai_searches_limit,
    sp.team_members_limit,
    sp.features,
    COALESCE(us.status, 'free') as status
  FROM subscription_plans sp
  LEFT JOIN user_subscriptions us ON sp.id = us.plan_id AND us.user_id = user_uuid
  WHERE sp.name = COALESCE(
    (SELECT sp2.name FROM subscription_plans sp2 
     JOIN user_subscriptions us2 ON sp2.id = us2.plan_id 
     WHERE us2.user_id = user_uuid AND us2.status = 'active'),
    'Free'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
