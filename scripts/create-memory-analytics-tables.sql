-- Optional tables for local memory analytics and user preferences backup
-- Mem0 handles the main memory, these are for analytics and backup

-- User memory analytics
CREATE TABLE IF NOT EXISTS user_memory_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  memory_type TEXT NOT NULL, -- 'preference', 'conversation', 'travel_history'
  memory_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences backup (local copy of key preferences)
CREATE TABLE IF NOT EXISTS user_travel_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  preference_type TEXT NOT NULL, -- 'airline', 'hotel', 'destination', 'budget'
  preference_value TEXT NOT NULL,
  confidence_score FLOAT DEFAULT 1.0,
  mem0_memory_id TEXT, -- Reference to Mem0 memory ID
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE user_memory_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_travel_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own memory analytics" ON user_memory_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own travel preferences" ON user_travel_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_user_memory_analytics_user_id ON user_memory_analytics(user_id);
CREATE INDEX idx_user_travel_preferences_user_id ON user_travel_preferences(user_id);
CREATE INDEX idx_user_travel_preferences_type ON user_travel_preferences(preference_type);
