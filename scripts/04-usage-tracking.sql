-- Create usage tracking table
CREATE TABLE IF NOT EXISTS user_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_searches_used INTEGER DEFAULT 0,
  month_year VARCHAR(7) NOT NULL, -- Format: YYYY-MM
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, month_year)
);

-- Create trigger for user_usage
CREATE TRIGGER update_user_usage_updated_at 
    BEFORE UPDATE ON user_usage 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check if user can make AI search
CREATE OR REPLACE FUNCTION can_user_make_ai_search(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_month VARCHAR(7);
  usage_count INTEGER;
  search_limit INTEGER;
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Get current usage
  SELECT COALESCE(ai_searches_used, 0) INTO usage_count
  FROM user_usage 
  WHERE user_id = user_uuid AND month_year = current_month;
  
  -- Get user's limit
  SELECT ai_searches_limit INTO search_limit
  FROM get_user_plan(user_uuid);
  
  -- If limit is null (unlimited), return true
  IF search_limit IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Check if under limit
  RETURN COALESCE(usage_count, 0) < search_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment AI search usage
CREATE OR REPLACE FUNCTION increment_ai_search_usage(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_month VARCHAR(7);
BEGIN
  current_month := TO_CHAR(NOW(), 'YYYY-MM');
  
  -- Check if user can make search
  IF NOT can_user_make_ai_search(user_uuid) THEN
    RETURN FALSE;
  END IF;
  
  -- Insert or update usage
  INSERT INTO user_usage (user_id, month_year, ai_searches_used)
  VALUES (user_uuid, current_month, 1)
  ON CONFLICT (user_id, month_year)
  DO UPDATE SET 
    ai_searches_used = user_usage.ai_searches_used + 1,
    updated_at = NOW();
    
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset monthly usage (run via cron job)
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS VOID AS $$
DECLARE
  last_month VARCHAR(7);
BEGIN
  last_month := TO_CHAR(NOW() - INTERVAL '1 month', 'YYYY-MM');
  
  -- Archive old usage data (optional)
  -- You might want to keep this data for analytics
  
  -- Reset current month usage to 0 for all users
  INSERT INTO user_usage (user_id, month_year, ai_searches_used)
  SELECT DISTINCT u.id, TO_CHAR(NOW(), 'YYYY-MM'), 0
  FROM auth.users u
  ON CONFLICT (user_id, month_year) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
