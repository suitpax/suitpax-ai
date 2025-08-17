-- Duffel webhook events log
CREATE TABLE IF NOT EXISTS public.webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL DEFAULT 'duffel',
  event_id text,
  event_type text,
  resource_type text,
  resource_id text,
  order_id text,
  signature text,
  headers jsonb,
  payload jsonb NOT NULL,
  status text DEFAULT 'received',
  received_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  processing_error text
);

-- Indexes
CREATE INDEX IF NOT EXISTS webhook_events_provider_idx ON public.webhook_events(provider);
CREATE INDEX IF NOT EXISTS webhook_events_event_type_idx ON public.webhook_events(event_type);
CREATE INDEX IF NOT EXISTS webhook_events_resource_id_idx ON public.webhook_events(resource_id);
CREATE INDEX IF NOT EXISTS webhook_events_order_id_idx ON public.webhook_events(order_id);
CREATE UNIQUE INDEX IF NOT EXISTS webhook_events_event_id_key ON public.webhook_events(event_id) WHERE event_id IS NOT NULL;

-- RLS
ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
-- No public policies; service role inserts bypass RLS. Add read policies later if needed.