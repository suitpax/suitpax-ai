-- Suitpax Plans base (product-level)
CREATE TABLE IF NOT EXISTS public.suitpax_plans (
  id TEXT PRIMARY KEY, -- free, basic, pro, enterprise
  name TEXT NOT NULL,
  price_monthly_cents INTEGER DEFAULT 0,
  price_yearly_cents INTEGER DEFAULT 0,
  ai_tokens_limit INTEGER NOT NULL,
  ai_searches_limit INTEGER NOT NULL,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.suitpax_plans (id, name, price_monthly_cents, price_yearly_cents, ai_tokens_limit, ai_searches_limit, features)
VALUES
  ('free','Free',0,0,5000,10,'{}'::jsonb),
  ('basic','Basic',4900,46800,15000,30,'{}'::jsonb),
  ('pro','Pro',8900,85200,25000,50,'{}'::jsonb),
  ('enterprise','Enterprise',0,0,100000000,1000000,'{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Add-on: Suitpax Code
CREATE TABLE IF NOT EXISTS public.suitpax_code_addons (
  id TEXT PRIMARY KEY, -- starter, pro, enterprise
  name TEXT NOT NULL,
  price_monthly_cents INTEGER DEFAULT 0,
  price_yearly_cents INTEGER DEFAULT 0,
  code_tokens_limit INTEGER NOT NULL,
  builds_limit INTEGER NOT NULL,
  features JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Suggested add-on tiers for Suitpax Code
-- starter: for individuals/small teams
-- pro: for growing teams
-- enterprise: custom high limits
INSERT INTO public.suitpax_code_addons (id, name, price_monthly_cents, price_yearly_cents, code_tokens_limit, builds_limit, features)
VALUES
  ('starter','Code Starter',2900,30000,10000,50,'{}'::jsonb),
  ('pro','Code Pro',5900,61200,30000,200,'{}'::jsonb),
  ('enterprise','Code Enterprise',0,0,100000000,100000,'{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Per-user subscriptions mapping
CREATE TABLE IF NOT EXISTS public.user_subscriptions (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  plan_id TEXT REFERENCES public.suitpax_plans(id) NOT NULL DEFAULT 'free',
  code_addon_id TEXT REFERENCES public.suitpax_code_addons(id),
  status TEXT DEFAULT 'inactive' CHECK (status IN ('active','inactive','cancelled','trialing')),
  ai_tokens_used INTEGER DEFAULT 0,
  code_tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their subscription" ON public.user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their subscription" ON public.user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Functions to increment usage respecting add-on or base limits (soft enforcement server logs)
CREATE OR REPLACE FUNCTION public.increment_ai_tokens_v2(p_user UUID, p_tokens INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_subscriptions SET ai_tokens_used = ai_tokens_used + p_tokens, updated_at = NOW() WHERE user_id = p_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.increment_code_tokens(p_user UUID, p_tokens INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.user_subscriptions SET code_tokens_used = code_tokens_used + p_tokens, updated_at = NOW() WHERE user_id = p_user;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;