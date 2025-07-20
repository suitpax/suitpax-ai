-- Create stripe events table for webhook handling
CREATE TABLE IF NOT EXISTS stripe_events (
  id VARCHAR(100) PRIMARY KEY, -- Stripe event ID
  type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle subscription created
CREATE OR REPLACE FUNCTION handle_subscription_created(
  stripe_customer_id VARCHAR(100),
  stripe_subscription_id VARCHAR(100),
  plan_name VARCHAR(50),
  billing_cycle VARCHAR(20),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
DECLARE
  target_user_id UUID;
  target_plan_id UUID;
BEGIN
  -- Find user by stripe customer ID
  SELECT user_id INTO target_user_id
  FROM user_subscriptions 
  WHERE stripe_customer_id = handle_subscription_created.stripe_customer_id
  LIMIT 1;
  
  -- If no user found, try to find by email in stripe metadata
  -- This would require additional logic based on your implementation
  
  -- Get plan ID
  SELECT id INTO target_plan_id
  FROM subscription_plans
  WHERE name = plan_name;
  
  IF target_user_id IS NOT NULL AND target_plan_id IS NOT NULL THEN
    -- Insert or update subscription
    INSERT INTO user_subscriptions (
      user_id, 
      plan_id, 
      stripe_customer_id, 
      stripe_subscription_id,
      status,
      billing_cycle,
      current_period_start,
      current_period_end
    )
    VALUES (
      target_user_id,
      target_plan_id,
      handle_subscription_created.stripe_customer_id,
      stripe_subscription_id,
      'active',
      billing_cycle,
      current_period_start,
      current_period_end
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      plan_id = target_plan_id,
      stripe_subscription_id = stripe_subscription_id,
      status = 'active',
      billing_cycle = handle_subscription_created.billing_cycle,
      current_period_start = handle_subscription_created.current_period_start,
      current_period_end = handle_subscription_created.current_period_end,
      updated_at = NOW();
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle subscription updated
CREATE OR REPLACE FUNCTION handle_subscription_updated(
  stripe_subscription_id VARCHAR(100),
  status VARCHAR(50),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_subscriptions
  SET 
    status = handle_subscription_updated.status,
    current_period_start = handle_subscription_updated.current_period_start,
    current_period_end = handle_subscription_updated.current_period_end,
    cancel_at_period_end = handle_subscription_updated.cancel_at_period_end,
    updated_at = NOW()
  WHERE stripe_subscription_id = handle_subscription_updated.stripe_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to handle subscription deleted
CREATE OR REPLACE FUNCTION handle_subscription_deleted(
  stripe_subscription_id VARCHAR(100)
)
RETURNS VOID AS $$
DECLARE
  target_user_id UUID;
  free_plan_id UUID;
BEGIN
  -- Get user ID
  SELECT user_id INTO target_user_id
  FROM user_subscriptions
  WHERE stripe_subscription_id = handle_subscription_deleted.stripe_subscription_id;
  
  -- Get free plan ID
  SELECT id INTO free_plan_id
  FROM subscription_plans
  WHERE name = 'Free';
  
  IF target_user_id IS NOT NULL AND free_plan_id IS NOT NULL THEN
    -- Update to free plan
    UPDATE user_subscriptions
    SET 
      plan_id = free_plan_id,
      status = 'canceled',
      stripe_subscription_id = NULL,
      cancel_at_period_end = false,
      updated_at = NOW()
    WHERE user_id = target_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view subscription plans" ON subscription_plans
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own subscription" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own usage" ON user_usage
  FOR SELECT USING (auth.uid() = user_id);

-- Only service role can access stripe events
CREATE POLICY "Service role can manage stripe events" ON stripe_events
  FOR ALL USING (auth.role() = 'service_role');
