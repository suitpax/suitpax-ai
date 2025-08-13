-- Add missing columns and indexes to existing tables for better functionality

-- Enhance ai_chat_logs table if it exists
DO $$
BEGIN
  -- Add session_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ai_chat_logs' AND column_name = 'session_id') THEN
    ALTER TABLE ai_chat_logs ADD COLUMN session_id TEXT;
    CREATE INDEX IF NOT EXISTS idx_ai_chat_logs_session_id ON ai_chat_logs(session_id);
  END IF;
  
  -- Add model_used if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'ai_chat_logs' AND column_name = 'model_used') THEN
    ALTER TABLE ai_chat_logs ADD COLUMN model_used TEXT DEFAULT 'claude-3-sonnet-20240229';
  END IF;
END $$;

-- Enhance expenses table for better categorization
DO $$
BEGIN
  -- Add project_id for expense tracking by project
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'expenses' AND column_name = 'project_id') THEN
    ALTER TABLE expenses ADD COLUMN project_id TEXT;
  END IF;
  
  -- Add approval status
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'expenses' AND column_name = 'approval_status') THEN
    ALTER TABLE expenses ADD COLUMN approval_status TEXT 
    CHECK (approval_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending';
  END IF;
END $$;

-- Create function to increment AI token usage
CREATE OR REPLACE FUNCTION increment_ai_tokens(
  p_user_id UUID,
  p_model TEXT,
  p_provider TEXT DEFAULT 'anthropic',
  p_input_tokens INTEGER DEFAULT 0,
  p_output_tokens INTEGER DEFAULT 0,
  p_context_type TEXT DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  usage_id UUID;
  token_cost NUMERIC(10,6) := 0;
BEGIN
  -- Calculate approximate cost based on model (rough estimates)
  CASE p_model
    WHEN 'claude-3-sonnet-20240229' THEN
      token_cost := (p_input_tokens * 0.000003) + (p_output_tokens * 0.000015);
    WHEN 'claude-3-haiku-20240307' THEN
      token_cost := (p_input_tokens * 0.00000025) + (p_output_tokens * 0.00000125);
    ELSE
      token_cost := (p_input_tokens * 0.000001) + (p_output_tokens * 0.000002);
  END CASE;

  INSERT INTO ai_usage (
    user_id, model, provider, input_tokens, output_tokens, 
    context_type, session_id, cost_usd
  ) VALUES (
    p_user_id, p_model, p_provider, p_input_tokens, p_output_tokens,
    p_context_type, p_session_id, token_cost
  ) RETURNING id INTO usage_id;
  
  RETURN usage_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
