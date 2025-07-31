-- Create AI chat logs table for tracking conversations
CREATE TABLE IF NOT EXISTS ai_chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context_type VARCHAR(50) DEFAULT 'general',
  tokens_used INTEGER DEFAULT 0,
  model_used VARCHAR(100) DEFAULT 'claude-3-haiku-20240307',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS ai_chat_logs_user_id_idx ON ai_chat_logs(user_id);
CREATE INDEX IF NOT EXISTS ai_chat_logs_created_at_idx ON ai_chat_logs(created_at);
CREATE INDEX IF NOT EXISTS ai_chat_logs_context_type_idx ON ai_chat_logs(context_type);

-- Enable RLS
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own chat logs" ON ai_chat_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat logs" ON ai_chat_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ai_chat_logs_updated_at 
  BEFORE UPDATE ON ai_chat_logs 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON ai_chat_logs TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
