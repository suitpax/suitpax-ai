-- Create usage tracking table
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  ai_interactions_used INTEGER DEFAULT 0,
  searches_used INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, month_year)
);

-- Create indexes
CREATE INDEX idx_user_usage_user_month ON user_usage(user_id, month_year);
CREATE INDEX idx_user_usage_month_year ON user_usage(month_year);

-- Function to check if user can use AI interaction
CREATE OR REPLACE FUNCTION can_use_ai_interaction(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_month VARCHAR(7);
  current_usage INTEGER;
  max_allowed INTEGER;
  plan_info RECORD;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Get user's plan limits
  SELECT * INTO plan_info FROM get_user_plan(user_uuid);
  
  -- If unlimited (NULL), return true
  IF plan_info.max_ai_interactions IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Get current usage
  SELECT COALESCE(ai_interactions_used, 0) INTO current_usage
  FROM user_usage 
  WHERE user_id = user_uuid AND month_year = current_month;
  
  -- Check if under limit
  RETURN COALESCE(current_usage, 0) < plan_info.max_ai_interactions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment AI interaction usage
CREATE OR REPLACE FUNCTION increment_ai_usage(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  current_month VARCHAR(7);
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  INSERT INTO user_usage (user_id, month_year, ai_interactions_used)
  VALUES (user_uuid, current_month, 1)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    ai_interactions_used = user_usage.ai_interactions_used + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment search usage
CREATE OR REPLACE FUNCTION increment_search_usage(user_uuid UUID)
RETURNS VOID AS $$
DECLARE
  current_month VARCHAR(7);
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  INSERT INTO user_usage (user_id, month_year, searches_used)
  VALUES (user_uuid, current_month, 1)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    searches_used = user_usage.searches_used + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
