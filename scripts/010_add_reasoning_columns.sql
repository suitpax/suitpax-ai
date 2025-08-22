-- Add reasoning columns to ai_chat_logs if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='ai_chat_logs' AND column_name='reasoning_included'
  ) THEN
    ALTER TABLE public.ai_chat_logs ADD COLUMN reasoning_included boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name='ai_chat_logs' AND column_name='reasoning_content'
  ) THEN
    ALTER TABLE public.ai_chat_logs ADD COLUMN reasoning_content text;
  END IF;
END $$;

