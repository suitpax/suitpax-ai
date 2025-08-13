-- Database optimization script with indexes and functions
-- Create indexes for better query performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_bookings_user_departure 
ON flight_bookings(user_id, departure_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_expenses_user_date 
ON expenses(user_id, expense_date DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_expenses_status 
ON expenses(status) WHERE status = 'pending';

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ai_chat_logs_user_created 
ON ai_chat_logs(user_id, created_at DESC);

-- Create composite indexes for dashboard queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_expenses_user_month_year 
ON expenses(user_id, EXTRACT(YEAR FROM expense_date), EXTRACT(MONTH FROM expense_date));

-- Create database function for dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_id UUID)
RETURNS JSON AS $$
DECLARE
  flight_count INTEGER;
  expense_count INTEGER;
  pending_count INTEGER;
  month_expenses DECIMAL;
BEGIN
  -- Get flight count
  SELECT COUNT(*) INTO flight_count
  FROM flight_bookings
  WHERE flight_bookings.user_id = get_user_dashboard_stats.user_id;

  -- Get expense counts and this month total
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'pending'),
    COALESCE(SUM(amount) FILTER (WHERE 
      EXTRACT(YEAR FROM expense_date) = EXTRACT(YEAR FROM CURRENT_DATE) AND
      EXTRACT(MONTH FROM expense_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    ), 0)
  INTO expense_count, pending_count, month_expenses
  FROM expenses
  WHERE expenses.user_id = get_user_dashboard_stats.user_id;

  RETURN json_build_object(
    'total_flights', flight_count,
    'total_expenses', expense_count,
    'pending_expenses', pending_count,
    'this_month_expenses', month_expenses
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to increment AI tokens efficiently
CREATE OR REPLACE FUNCTION increment_ai_tokens(user_id UUID, tokens INTEGER)
RETURNS VOID AS $$
BEGIN
  INSERT INTO user_preferences (user_id, ai_tokens_used)
  VALUES (user_id, tokens)
  ON CONFLICT (user_id)
  DO UPDATE SET 
    ai_tokens_used = COALESCE(user_preferences.ai_tokens_used, 0) + tokens,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add partial indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_flight_bookings_upcoming 
ON flight_bookings(user_id, departure_date) 
WHERE departure_date >= CURRENT_DATE;

-- Analyze tables for better query planning
ANALYZE flight_bookings;
ANALYZE expenses;
ANALYZE user_preferences;
ANALYZE ai_chat_logs;
