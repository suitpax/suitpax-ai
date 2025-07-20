-- Create usage tracking table
CREATE TABLE IF NOT EXISTS usage_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resource_type VARCHAR(50) NOT NULL, -- 'booking', 'api_call', 'report', etc.
  resource_id UUID, -- Reference to the specific resource
  quantity INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  period_start TIMESTAMP WITH TIME ZONE DEFAULT date_trunc('month', NOW()),
  period_end TIMESTAMP WITH TIME ZONE DEFAULT (date_trunc('month', NOW()) + INTERVAL '1 month' - INTERVAL '1 second')
);

-- Create bookings table for tracking travel bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_type VARCHAR(50) NOT NULL CHECK (booking_type IN ('flight', 'hotel', 'car', 'train')),
  booking_reference VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'canceled', 'completed')),
  departure_date TIMESTAMP WITH TIME ZONE,
  return_date TIMESTAMP WITH TIME ZONE,
  destination VARCHAR(255),
  origin VARCHAR(255),
  total_amount DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  booking_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create expenses table for expense tracking
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  expense_date DATE NOT NULL,
  receipt_url TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'reimbursed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
  p_user_id UUID,
  p_resource_type VARCHAR(50),
  p_resource_id UUID DEFAULT NULL,
  p_quantity INTEGER DEFAULT 1,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO usage_tracking (user_id, resource_type, resource_id, quantity, metadata)
  VALUES (p_user_id, p_resource_type, p_resource_id, p_quantity, p_metadata);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current usage for a user
CREATE OR REPLACE FUNCTION get_current_usage(
  p_user_id UUID,
  p_resource_type VARCHAR(50),
  p_period_start TIMESTAMP WITH TIME ZONE DEFAULT date_trunc('month', NOW())
)
RETURNS INTEGER AS $$
DECLARE
  total_usage INTEGER;
BEGIN
  SELECT COALESCE(SUM(quantity), 0) INTO total_usage
  FROM usage_tracking
  WHERE user_id = p_user_id
    AND resource_type = p_resource_type
    AND period_start = p_period_start;
  
  RETURN total_usage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has exceeded limits
CREATE OR REPLACE FUNCTION check_usage_limit(
  p_user_id UUID,
  p_resource_type VARCHAR(50)
)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  user_limit INTEGER;
  plan_limits JSONB;
BEGIN
  -- Get current usage
  SELECT get_current_usage(p_user_id, p_resource_type) INTO current_usage;
  
  -- Get user's plan limits
  SELECT sp.limits INTO plan_limits
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id AND us.status = 'active';
  
  -- Extract limit for the specific resource type
  user_limit := (plan_limits ->> (p_resource_type || '_per_month'))::INTEGER;
  
  -- If limit is -1, it means unlimited
  IF user_limit = -1 THEN
    RETURN true;
  END IF;
  
  -- Check if current usage is within limit
  RETURN current_usage < user_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to track booking creation
CREATE OR REPLACE FUNCTION track_booking_usage()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM track_usage(NEW.user_id, 'booking', NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION track_booking_usage();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_usage_tracking_user_period ON usage_tracking(user_id, period_start, resource_type);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_booking_id ON expenses(booking_id);

-- Enable RLS
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own usage" ON usage_tracking
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own bookings" ON bookings
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own expenses" ON expenses
  FOR ALL USING (auth.uid() = user_id);
