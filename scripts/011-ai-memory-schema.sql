-- Create AI memory and conversation tables
CREATE TABLE IF NOT EXISTS ai_memories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mem0_memory_id TEXT UNIQUE,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('travel_preference', 'expense_pattern', 'policy_compliance', 'general')),
  metadata JSONB DEFAULT '{}',
  relevance_score FLOAT DEFAULT 0.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create enhanced AI chat logs table
DROP TABLE IF EXISTS ai_chat_logs;
CREATE TABLE ai_chat_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id UUID DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context TEXT DEFAULT 'chat',
  memory_used JSONB DEFAULT '[]',
  tokens_used INTEGER DEFAULT 0,
  response_time_ms INTEGER DEFAULT 0,
  model_used TEXT DEFAULT 'claude-3-5-sonnet',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create conversation sessions table
CREATE TABLE IF NOT EXISTS conversation_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  context TEXT DEFAULT 'general',
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create travel insights table
CREATE TABLE IF NOT EXISTS travel_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  insight_type TEXT NOT NULL CHECK (insight_type IN ('cost_optimization', 'policy_compliance', 'travel_pattern', 'recommendation')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'dismissed', 'acted_upon')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_ai_memories_user_id ON ai_memories(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_memories_category ON ai_memories(category);
CREATE INDEX IF NOT EXISTS idx_ai_memories_mem0_id ON ai_memories(mem0_memory_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_user_id ON ai_chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_conversation_id ON ai_chat_logs(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_sessions_user_id ON conversation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_insights_user_id ON travel_insights(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_insights_type ON travel_insights(insight_type);

-- Enable RLS
ALTER TABLE ai_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_insights ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own AI memories" ON ai_memories
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own chat logs" ON ai_chat_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own conversation sessions" ON conversation_sessions
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own travel insights" ON travel_insights
  FOR ALL USING (auth.uid() = user_id);

-- Function to create or update conversation session
CREATE OR REPLACE FUNCTION upsert_conversation_session(
  user_uuid UUID,
  session_id UUID DEFAULT NULL,
  session_title TEXT DEFAULT NULL,
  session_context TEXT DEFAULT 'general'
)
RETURNS UUID AS $$
DECLARE
  result_id UUID;
BEGIN
  IF session_id IS NULL THEN
    -- Create new session
    INSERT INTO conversation_sessions (user_id, title, context, message_count, last_message_at)
    VALUES (user_uuid, session_title, session_context, 1, NOW())
    RETURNING id INTO result_id;
  ELSE
    -- Update existing session
    UPDATE conversation_sessions 
    SET 
      message_count = message_count + 1,
      last_message_at = NOW(),
      updated_at = NOW()
    WHERE id = session_id AND user_id = user_uuid
    RETURNING id INTO result_id;
  END IF;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate travel insights
CREATE OR REPLACE FUNCTION generate_travel_insight(
  user_uuid UUID,
  insight_type_param TEXT,
  title_param TEXT,
  description_param TEXT,
  data_param JSONB DEFAULT '{}',
  priority_param TEXT DEFAULT 'medium'
)
RETURNS UUID AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO travel_insights (user_id, insight_type, title, description, data, priority)
  VALUES (user_uuid, insight_type_param, title_param, description_param, data_param, priority_param)
  RETURNING id INTO result_id;
  
  RETURN result_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
