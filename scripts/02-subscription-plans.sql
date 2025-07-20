-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  price_monthly INTEGER NOT NULL, -- Price in cents (EUR)
  price_yearly INTEGER, -- Price in cents (EUR) - null for free/enterprise
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_yearly VARCHAR(100),
  features JSONB NOT NULL DEFAULT '[]',
  limitations JSONB NOT NULL DEFAULT '[]',
  max_ai_interactions INTEGER, -- null means unlimited
  max_team_members INTEGER, -- null means unlimited
  max_searches_per_month INTEGER, -- null means unlimited
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the subscription plans
INSERT INTO subscription_plans (
  name, 
  price_monthly, 
  price_yearly, 
  features, 
  limitations,
  max_ai_interactions,
  max_team_members,
  max_searches_per_month
) VALUES 
(
  'free',
  0,
  NULL,
  '["5 AI agent interactions per month", "Basic travel search", "Email support", "Access to community"]',
  '["No booking capabilities", "Limited AI features", "No expense management", "No team collaboration"]',
  5,
  1,
  10
),
(
  'startup',
  3900, -- €39 in cents
  3100, -- €31 in cents (20% discount)
  '["100 AI agent interactions per month", "Full booking capabilities", "Basic expense management", "Team collaboration (up to 5 members)", "Priority email support", "Travel policy templates", "Basic reporting"]',
  '["Limited integrations", "Basic reporting only", "No custom workflows"]',
  100,
  5,
  500
),
(
  'pro',
  7900, -- €79 in cents
  6300, -- €63 in cents (20% discount)
  '["Unlimited AI agent interactions", "Advanced booking with preferences", "Complete expense management", "Unlimited team members", "24/7 priority support", "Custom travel policies", "Advanced reporting & analytics", "API access", "Custom integrations", "Dedicated account manager"]',
  '[]',
  NULL, -- unlimited
  NULL, -- unlimited
  NULL  -- unlimited
),
(
  'enterprise',
  0, -- Custom pricing
  NULL,
  '["Everything in Pro", "Custom AI agent training", "White-label solutions", "On-premise deployment options", "Custom SLA agreements", "Dedicated infrastructure", "Advanced security features", "Custom reporting", "Integration support", "Training & onboarding"]',
  '[]',
  NULL, -- unlimited
  NULL, -- unlimited
  NULL  -- unlimited
);

-- Create indexes
CREATE INDEX idx_subscription_plans_name ON subscription_plans(name);
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
