-- Cost Centers schema

-- Tables
CREATE TABLE IF NOT EXISTS public.cost_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  budget_monthly DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_cost_centers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin','member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cost_center_id, user_id)
);

-- References from existing tables (if present)
ALTER TABLE IF EXISTS public.expenses
  ADD COLUMN IF NOT EXISTS cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL;

ALTER TABLE IF EXISTS public.flight_bookings
  ADD COLUMN IF NOT EXISTS cost_center_id UUID REFERENCES public.cost_centers(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_cost_centers_owner ON public.cost_centers(owner_id);
CREATE INDEX IF NOT EXISTS idx_user_cost_centers_user ON public.user_cost_centers(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cost_centers_cc ON public.user_cost_centers(cost_center_id);
CREATE INDEX IF NOT EXISTS idx_expenses_cost_center ON public.expenses(cost_center_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_cost_center ON public.flight_bookings(cost_center_id);

-- RLS
ALTER TABLE public.cost_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cost_centers ENABLE ROW LEVEL SECURITY;

-- Policies
-- Cost centers: owners can do all, members can view
CREATE POLICY "cc_owner_select" ON public.cost_centers FOR SELECT USING (
  auth.uid() = owner_id OR EXISTS (
    SELECT 1 FROM public.user_cost_centers uc WHERE uc.cost_center_id = cost_centers.id AND uc.user_id = auth.uid()
  )
);
CREATE POLICY "cc_owner_insert" ON public.cost_centers FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "cc_owner_update" ON public.cost_centers FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "cc_owner_delete" ON public.cost_centers FOR DELETE USING (auth.uid() = owner_id);

-- User cost centers: user or owner of cost center can view; owner can manage
CREATE POLICY "ucc_member_select" ON public.user_cost_centers FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.cost_centers c WHERE c.id = user_cost_centers.cost_center_id AND c.owner_id = auth.uid()
  )
);
CREATE POLICY "ucc_owner_insert" ON public.user_cost_centers FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.cost_centers c WHERE c.id = cost_center_id AND c.owner_id = auth.uid())
);
CREATE POLICY "ucc_owner_update" ON public.user_cost_centers FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.cost_centers c WHERE c.id = user_cost_centers.cost_center_id AND c.owner_id = auth.uid())
);
CREATE POLICY "ucc_owner_delete" ON public.user_cost_centers FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.cost_centers c WHERE c.id = user_cost_centers.cost_center_id AND c.owner_id = auth.uid())
);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_updated_at_cost_centers
  BEFORE UPDATE ON public.cost_centers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();