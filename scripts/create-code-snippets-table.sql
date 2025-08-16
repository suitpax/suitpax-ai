CREATE TABLE IF NOT EXISTS public.code_snippets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own snippets" ON public.code_snippets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own snippets" ON public.code_snippets
  FOR INSERT WITH CHECK (auth.uid() = user_id);