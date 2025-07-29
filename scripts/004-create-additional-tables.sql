-- Create flight_bookings table
CREATE TABLE IF NOT EXISTS flight_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    airline VARCHAR(100) NOT NULL,
    flight_number VARCHAR(20) NOT NULL,
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME,
    arrival_date DATE NOT NULL,
    arrival_time TIME,
    passengers INTEGER DEFAULT 1,
    class VARCHAR(20) DEFAULT 'economy',
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'confirmed',
    booking_reference VARCHAR(50),
    booking_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hotel_bookings table
CREATE TABLE IF NOT EXISTS hotel_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    hotel_name VARCHAR(200) NOT NULL,
    hotel_address TEXT,
    city VARCHAR(100) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guests INTEGER DEFAULT 1,
    rooms INTEGER DEFAULT 1,
    nights INTEGER NOT NULL,
    price_per_night DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'EUR',
    status VARCHAR(20) DEFAULT 'confirmed',
    booking_reference VARCHAR(50),
    booking_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    type VARCHAR(50) DEFAULT 'meeting',
    location VARCHAR(200),
    attendees TEXT[],
    status VARCHAR(20) DEFAULT 'confirmed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create team_members table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    organization_id UUID, -- In a real app, you'd have an organizations table
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(200) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    department VARCHAR(100),
    phone VARCHAR(20),
    status VARCHAR(20) DEFAULT 'active',
    invited_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address TEXT,
    rating DECIMAL(2,1) DEFAULT 0,
    visits INTEGER DEFAULT 0,
    last_visit DATE,
    notes TEXT,
    amenities TEXT[],
    coordinates JSONB,
    average_cost DECIMAL(10,2),
    preferred_by TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_departure_date ON flight_bookings(departure_date);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_user_id ON hotel_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_hotel_bookings_check_in_date ON hotel_bookings(check_in_date);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date ON calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_team_members_organization_id ON team_members(organization_id);
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_type ON locations(type);

-- Enable Row Level Security (RLS)
ALTER TABLE flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own flight bookings" ON flight_bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own flight bookings" ON flight_bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own flight bookings" ON flight_bookings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own flight bookings" ON flight_bookings
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own hotel bookings" ON hotel_bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hotel bookings" ON hotel_bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hotel bookings" ON hotel_bookings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hotel bookings" ON hotel_bookings
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own calendar events" ON calendar_events
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar events" ON calendar_events
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar events" ON calendar_events
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar events" ON calendar_events
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view team members in their organization" ON team_members
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = invited_by);

CREATE POLICY "Users can insert team members" ON team_members
    FOR INSERT WITH CHECK (auth.uid() = invited_by);

CREATE POLICY "Users can update team members they invited" ON team_members
    FOR UPDATE USING (auth.uid() = invited_by);

CREATE POLICY "Users can delete team members they invited" ON team_members
    FOR DELETE USING (auth.uid() = invited_by);

CREATE POLICY "Users can view their own locations" ON locations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own locations" ON locations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own locations" ON locations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own locations" ON locations
    FOR DELETE USING (auth.uid() = user_id);
