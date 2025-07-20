-- Create stripe events table for webhook handling
CREATE TABLE IF NOT EXISTS stripe_events (
  id VARCHAR(100) PRIMARY KEY, -- Stripe event ID
  type VARCHAR(100) NOT NULL,
  processed BOOLEAN DEFAULT false,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_stripe_events_type ON stripe_events(type);
CREATE INDEX idx_stripe_events_processed ON stripe_events(processed);
CREATE INDEX idx_stripe_events_created ON stripe_events(created_at);

-- Function to handle subscription updates from Stripe
CREATE OR REPLACE FUNCTION handle_subscription_change(
  stripe_subscription_id_param VARCHAR(100),
  status_param VARCHAR(50),
  current_period_start_param TIMESTAMP WITH TIME ZONE,
  current_period_end_param TIMESTAMP WITH TIME ZONE,
  plan_name_param VARCHAR(50),
  billing_cycle_param VARCHAR(20)
)
RETURNS VOID AS $$
DECLARE
  plan_uuid UUID;
BEGIN
  -- Get plan ID
  SELECT id INTO plan_uuid FROM subscription_plans WHERE name = plan_name_param;
  
  -- Update or insert subscription
  INSERT INTO user_subscriptions (
    user_id,
    plan_id,
    stripe_subscription_id,
    status,
    current_period_start,
    current_period_end,
    billing_cycle
  )
  SELECT 
    (SELECT id FROM auth.users WHERE raw_user_meta_data->>'stripe_customer_id' = 
     (SELECT customer FROM stripe_subscriptions WHERE id = stripe_subscription_id_param LIMIT 1)
    ),
    plan_uuid,
    stripe_subscription_id_param,
    status_param,
    current_period_start_param,
    current_period_end_param,
    billing_cycle_param
  ON CONFLICT (user_id)
  DO UPDATE SET
    plan_id = plan_uuid,
    status = status_param,
    current_period_start = current_period_start_param,
    current_period_end = current_period_end_param,
    billing_cycle = billing_cycle_param,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view subscription plans" ON subscription_plans FOR SELECT USING (true);

CREATE POLICY "Users can view own subscription" ON user_subscriptions 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own usage" ON user_usage 
FOR SELECT USING (auth.uid() = user_id);

-- Only service role can manage stripe events
CREATE POLICY "Service role can manage stripe events" ON stripe_events 
FOR ALL USING (auth.role() = 'service_role');
