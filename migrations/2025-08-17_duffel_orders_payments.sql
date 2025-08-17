-- Duffel flight orders and payments
CREATE TABLE IF NOT EXISTS public.flight_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  duffel_order_id text NOT NULL,
  total_amount numeric,
  total_currency text,
  status text,
  raw jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.flight_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  duffel_payment_id text NOT NULL,
  duffel_order_id text,
  amount numeric,
  currency text,
  status text,
  method text,
  raw jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS flight_orders_user_idx ON public.flight_orders(user_id);
CREATE INDEX IF NOT EXISTS flight_payments_user_idx ON public.flight_payments(user_id);
CREATE INDEX IF NOT EXISTS flight_payments_order_idx ON public.flight_payments(duffel_order_id);

-- RLS
ALTER TABLE public.flight_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flight_payments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY flight_orders_rw ON public.flight_orders
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY flight_payments_rw ON public.flight_payments
    FOR ALL USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN others THEN NULL; END $$;