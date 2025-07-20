-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  price_monthly INTEGER NOT NULL, -- Price in cents (EUR)
  price_annual INTEGER, -- Price in cents (EUR) - null for free plan
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_annual VARCHAR(100),
  ai_searches_limit INTEGER, -- null means unlimited
  team_members_limit INTEGER, -- null means unlimited
  features JSONB NOT NULL DEFAULT '[]',
  limitations JSONB NOT NULL DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the subscription plans
INSERT INTO subscription_plans (name, price_monthly, price_annual, ai_searches_limit, team_members_limit, features, limitations) VALUES
('Free', 0, NULL, 5, 1, 
 '["5 AI searches per month", "Basic travel recommendations", "Email support", "Access to community"]',
 '["No expense management", "No team collaboration", "No priority support", "No advanced AI features"]'),

('Startup', 3900, 3100, 100, 5,
 '["100 AI searches per month", "Advanced travel recommendations", "Basic expense management", "Team collaboration (up to 5 members)", "Priority email support", "Travel policy templates", "Basic reporting"]',
 '["Limited integrations", "No custom AI training", "No dedicated support"]'),

('Basic', 4900, 3900, 500, 10,
 '["500 AI searches per month", "Advanced travel recommendations", "Full expense management", "Team collaboration (up to 10 members)", "Priority support", "Custom travel policies", "Advanced reporting", "API access"]',
 '["Limited custom integrations", "No dedicated account manager"]'),

('Pro', 7900, 6300, NULL, NULL,
 '["Unlimited AI searches", "Advanced AI travel agents", "Complete expense management suite", "Unlimited team members", "24/7 priority support", "Custom integrations", "Advanced analytics & reporting", "Custom AI training", "Dedicated account manager", "SLA guarantee"]',
 '[]'),

('Enterprise', 0, NULL, NULL, NULL,
 '["Everything in Pro", "Custom AI model training", "White-label solutions", "On-premise deployment options", "Custom integrations", "Dedicated support team", "Custom SLA", "Advanced security features", "Compliance certifications"]',
 '[]');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for subscription_plans
CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
