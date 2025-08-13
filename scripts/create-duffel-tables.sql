-- Create flight_searches table for tracking search requests
CREATE TABLE IF NOT EXISTS flight_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_params JSONB NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flight_bookings table for storing confirmed bookings
CREATE TABLE IF NOT EXISTS flight_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duffel_order_id TEXT NOT NULL UNIQUE,
  booking_reference TEXT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  total_currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
  passenger_details JSONB NOT NULL,
  flight_details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hotel_searches table for tracking hotel search requests
CREATE TABLE IF NOT EXISTS hotel_searches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  search_params JSONB NOT NULL,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hotel_bookings table for storing confirmed hotel bookings
CREATE TABLE IF NOT EXISTS hotel_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duffel_booking_id TEXT NOT NULL UNIQUE,
  confirmation_number TEXT NOT NULL,
  total_amount DECIMAL(15,2) NOT NULL,
  total_currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')),
  guest_details JSONB NOT NULL,
  hotel_details JSONB NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create travel_preferences table for user preferences
CREATE TABLE IF NOT EXISTS travel_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preferred_cabin_class TEXT DEFAULT 'economy' CHECK (preferred_cabin_class IN ('economy', 'premium_economy', 'business', 'first')),
  preferred_airlines TEXT[],
  loyalty_programs JSONB DEFAULT '[]',
  dietary_requirements TEXT[],
  accessibility_needs TEXT[],
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flight_searches_user_id ON flight_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_searches_created_at ON flight_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON flight_bookings(status);
CREATE INDEX IF NOT EXISTS idx_hotel_searches_user_id ON hotel_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_searches_created_at ON hotel_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_user_id ON hotel_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_status ON hotel_bookings(status);
CREATE INDEX IF NOT EXISTS idx_travel_preferences_user_id ON travel_preferences(user_id);

-- Enable RLS for security
ALTER TABLE flight_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for flight_searches
CREATE POLICY "Users can view their own flight searches" ON flight_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flight searches" ON flight_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for flight_bookings
CREATE POLICY "Users can view their own flight bookings" ON flight_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flight bookings" ON flight_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flight bookings" ON flight_bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for hotel_searches
CREATE POLICY "Users can view their own hotel searches" ON hotel_searches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hotel searches" ON hotel_searches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for hotel_bookings
CREATE POLICY "Users can view their own hotel bookings" ON hotel_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hotel bookings" ON hotel_bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hotel bookings" ON hotel_bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for travel_preferences
CREATE POLICY "Users can view their own travel preferences" ON travel_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own travel preferences" ON travel_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel preferences" ON travel_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own travel preferences" ON travel_preferences
  FOR DELETE USING (auth.uid() = user_id);
