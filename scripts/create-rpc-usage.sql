-- RPC: can_use_ai_tokens_v2
CREATE OR REPLACE FUNCTION public.can_use_ai_tokens_v2(user_uuid UUID, tokens_needed INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  sub RECORD;
  plan RECORD;
BEGIN
  SELECT * INTO sub FROM public.user_subscriptions WHERE user_id = user_uuid;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  SELECT * INTO plan FROM public.suitpax_plans WHERE id = sub.plan_id;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  RETURN (COALESCE(sub.ai_tokens_used,0) + tokens_needed) <= COALESCE(plan.ai_tokens_limit,0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: can_use_code_tokens
CREATE OR REPLACE FUNCTION public.can_use_code_tokens(user_uuid UUID, tokens_needed INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
  sub RECORD;
  addon RECORD;
BEGIN
  SELECT * INTO sub FROM public.user_subscriptions WHERE user_id = user_uuid;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  IF sub.code_addon_id IS NULL THEN
    RETURN FALSE;
  END IF;
  SELECT * INTO addon FROM public.suitpax_code_addons WHERE id = sub.code_addon_id;
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  RETURN (COALESCE(sub.code_tokens_used,0) + tokens_needed) <= COALESCE(addon.code_tokens_limit,0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC: get_user_subscription_limits
CREATE OR REPLACE FUNCTION public.get_user_subscription_limits(user_uuid UUID)
RETURNS TABLE (
  plan_id TEXT,
  ai_tokens_used INTEGER,
  ai_tokens_limit INTEGER,
  code_addon_id TEXT,
  code_tokens_used INTEGER,
  code_tokens_limit INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.plan_id,
    s.ai_tokens_used,
    p.ai_tokens_limit,
    s.code_addon_id,
    s.code_tokens_used,
    c.code_tokens_limit
  FROM public.user_subscriptions s
  LEFT JOIN public.suitpax_plans p ON p.id = s.plan_id
  LEFT JOIN public.suitpax_code_addons c ON c.id = s.code_addon_id
  WHERE s.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;