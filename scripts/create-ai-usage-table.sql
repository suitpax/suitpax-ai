-- Create ai_usage table for tracking AI model usage and analytics
CREATE TABLE IF NOT EXISTS ai_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  model TEXT NOT NULL,
  provider TEXT DEFAULT 'anthropic',
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  context_type TEXT, -- 'chat', 'flight_search', 'expense_ocr', etc.
  session_id TEXT,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_id ON ai_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_created_at ON ai_usage(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_model ON ai_usage(model);
CREATE INDEX IF NOT EXISTS idx_ai_usage_context_type ON ai_usage(context_type);
CREATE INDEX IF NOT EXISTS idx_ai_usage_session_id ON ai_usage(session_id);

-- Enable RLS
ALTER TABLE ai_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for ai_usage
CREATE POLICY "Users can view their own AI usage" ON ai_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert AI usage records" ON ai_usage
  FOR INSERT WITH CHECK (true); -- Allow system to insert usage records

-- Create a view for user AI usage statistics
CREATE OR REPLACE VIEW user_ai_usage_stats AS
SELECT 
  user_id,
  DATE_TRUNC('day', created_at) as usage_date,
  model,
  context_type,
  COUNT(*) as request_count,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(total_tokens) as total_tokens,
  SUM(cost_usd) as total_cost_usd
FROM ai_usage
GROUP BY user_id, DATE_TRUNC('day', created_at), model, context_type;

-- Grant access to the view
GRANT SELECT ON user_ai_usage_stats TO authenticated;
