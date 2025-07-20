-- Create subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2),
  price_yearly DECIMAL(10,2),
  stripe_price_id_monthly VARCHAR(100),
  stripe_price_id_yearly VARCHAR(100),
  features JSONB DEFAULT '[]'::jsonb,
  limits JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the subscription plans
INSERT INTO subscription_plans (name, display_name, description, price_monthly, price_yearly, features, limits) VALUES
('Free', 'Free', 'A free plan with basic features', 0.00, 0.00, 
 '["5 AI searches per month", "Basic travel recommendations", "Email support", "Access to community"]'::jsonb,
 '{"bookings_per_month": 5, "users": 1, "integrations": 2}'::jsonb),

('Startup', 'Startup', 'A plan for small teams with advanced features', 39.00, 312.00, 
 '["100 AI searches per month", "Advanced travel recommendations", "Basic expense management", "Team collaboration (up to 5 members)", "Priority email support", "Travel policy templates", "Basic reporting"]'::jsonb,
 '{"bookings_per_month": 100, "users": 5, "integrations": -1}'::jsonb),

('Basic', 'Basic', 'A plan for medium-sized teams with full features', 49.00, 392.00, 
 '["500 AI searches per month", "Advanced travel recommendations", "Full expense management", "Team collaboration (up to 10 members)", "Priority support", "Custom travel policies", "Advanced reporting", "API access"]'::jsonb,
 '{"bookings_per_month": 500, "users": 10, "integrations": -1}'::jsonb),

('Pro', 'Pro', 'A plan for large organizations with unlimited features', 79.00, 632.00, 
 '["Unlimited AI searches", "Advanced AI travel agents", "Complete expense management suite", "Unlimited team members", "24/7 priority support", "Custom integrations", "Advanced analytics & reporting", "Custom AI training", "Dedicated account manager", "SLA guarantee"]'::jsonb,
 '{"bookings_per_month": -1, "users": -1, "integrations": -1}'::jsonb),

('Starter', 'Starter', 'Perfect for individuals and small teams getting started', 29.00, 232.00, 
 '["Hasta 5 viajes por mes", "AI Assistant básico", "Gestión de gastos", "Soporte por email", "Dashboard básico", "Integración con 3 bancos"]'::jsonb,
 '{"bookings_per_month": 5, "users": 1, "integrations": 3}'::jsonb),

('Professional', 'Professional', 'Ideal for growing businesses with advanced needs', 99.00, 792.00,
 '["Unlimited bookings", "Advanced expense management", "Priority support", "Custom travel policies", "Advanced reporting & analytics", "API access", "Team management", "Integration with accounting tools"]'::jsonb,
 '{"bookings_per_month": -1, "users": 50, "integrations": -1}'::jsonb),

('Enterprise', 'Enterprise', 'For large organizations with complex requirements', 299.00, 2392.00,
 '["Everything in Professional", "Dedicated account manager", "Custom integrations", "Advanced security features", "SLA guarantee", "On-premise deployment options", "Custom training & onboarding", "24/7 phone support"]'::jsonb,
 '{"bookings_per_month": -1, "users": -1, "integrations": -1}'::jsonb);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_subscription_plans_name ON subscription_plans(name);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to active plans
CREATE POLICY "Public can view active subscription plans" ON subscription_plans
  FOR SELECT USING (is_active = true);

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
