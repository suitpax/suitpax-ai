-- Create agent status enum
CREATE TYPE agent_status AS ENUM ('active', 'inactive', 'training');
CREATE TYPE agent_type AS ENUM ('travel_assistant', 'expense_manager', 'policy_advisor', 'booking_specialist', 'custom');

-- Create ai_agents table
CREATE TABLE IF NOT EXISTS public.ai_agents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Agent details
  name TEXT NOT NULL,
  description TEXT,
  agent_type agent_type NOT NULL,
  status agent_status DEFAULT 'active',
  
  -- Agent configuration
  avatar_url TEXT,
  personality JSONB DEFAULT '{}',
  capabilities JSONB DEFAULT '[]',
  settings JSONB DEFAULT '{}',
  
  -- Usage stats
  total_interactions INTEGER DEFAULT 0,
  last_interaction_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_agents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own agents" ON public.ai_agents
  FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert own agents" ON public.ai_agents
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update own agents" ON public.ai_agents
  FOR UPDATE USING (auth.uid() = profile_id);

CREATE POLICY "Users can delete own agents" ON public.ai_agents
  FOR DELETE USING (auth.uid() = profile_id);

-- Create indexes
CREATE INDEX idx_ai_agents_profile_id ON public.ai_agents(profile_id);
CREATE INDEX idx_ai_agents_type ON public.ai_agents(agent_type);
CREATE INDEX idx_ai_agents_status ON public.ai_agents(status);
