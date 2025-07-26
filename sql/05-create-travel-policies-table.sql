CREATE TABLE public.travel_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id),
  policy_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  destination TEXT NOT NULL,
  purpose TEXT,
  budget NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.travel_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY travel_policies_policy ON public.travel_policies
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());
