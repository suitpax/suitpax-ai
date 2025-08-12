-- Create web_sources table for storing user's web research and sources
CREATE TABLE IF NOT EXISTS web_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  href TEXT NOT NULL,
  title TEXT,
  description TEXT,
  favicon_url TEXT,
  content_snippet TEXT,
  tags TEXT[] DEFAULT '{}',
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_web_sources_user_id ON web_sources(user_id);
CREATE INDEX IF NOT EXISTS idx_web_sources_created_at ON web_sources(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_web_sources_is_favorite ON web_sources(is_favorite);

-- Enable RLS
ALTER TABLE web_sources ENABLE ROW LEVEL SECURITY;

-- RLS Policies for web_sources
CREATE POLICY "Users can view their own web sources" ON web_sources
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own web sources" ON web_sources
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own web sources" ON web_sources
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own web sources" ON web_sources
  FOR DELETE USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_web_sources_updated_at BEFORE UPDATE ON web_sources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
