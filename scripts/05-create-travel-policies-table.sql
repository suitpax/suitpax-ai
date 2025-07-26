-- Create travel policies table
CREATE TYPE policy_status AS ENUM ('active', 'inactive', 'draft');
CREATE TYPE policy_type AS ENUM ('flight', 'hotel', 'expense_limit', 'approval_workflow', 'general');

CREATE TABLE IF NOT EXISTS public.travel_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Policy details
  name TEXT NOT NULL,
  description TEXT,
  policy_type policy_type NOT NULL,
  status policy_status DEFAULT 'draft',
  
  -- Policy rules (JSON for flexibility)
  rules JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.travel_policies ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own policies" ON public.travel_policies
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own policies" ON public.travel_policies
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own policies" ON public.travel_policies
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own policies" ON public.travel_policies
  FOR DELETE USING (auth.uid() = profile_id);

-- Create indexes
CREATE INDEX idx_travel_policies_profile_id ON public.travel_policies(profile_id);
CREATE INDEX idx_travel_policies_type ON public.travel_policies(policy_type);
CREATE INDEX idx_travel_policies_status ON public.travel_policies(status);
