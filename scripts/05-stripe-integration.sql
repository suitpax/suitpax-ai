-- Crear tabla para eventos de Stripe
CREATE TABLE IF NOT EXISTS stripe_events (
  id VARCHAR(100) PRIMARY KEY, -- Stripe event ID
  type VARCHAR(100) NOT NULL,
  data JSONB NOT NULL,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para facturas
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  stripe_invoice_id VARCHAR(100) UNIQUE,
  amount_due DECIMAL(10,2),
  amount_paid DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
  invoice_pdf TEXT,
  period_start TIMESTAMP WITH TIME ZONE,
  period_end TIMESTAMP WITH TIME ZONE,
  due_date TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para métodos de pago
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_method_id VARCHAR(100) UNIQUE,
  type VARCHAR(50) NOT NULL,
  card_brand VARCHAR(50),
  card_last4 VARCHAR(4),
  card_exp_month INTEGER,
  card_exp_year INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla para webhooks de Stripe
CREATE TABLE IF NOT EXISTS stripe_webhooks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_event_id VARCHAR(100) NOT NULL UNIQUE,
  event_type VARCHAR(100) NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_stripe_events_type ON stripe_events(type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed ON stripe_events(processed);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_event_id ON stripe_webhooks(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_type ON stripe_webhooks(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_processed ON stripe_webhooks(processed);

CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_stripe_id ON invoices(stripe_invoice_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);

-- Trigger para updated_at en invoices
CREATE TRIGGER update_invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Función para procesar webhooks de Stripe
CREATE OR REPLACE FUNCTION process_stripe_webhook(
  p_stripe_event_id VARCHAR(100),
  p_event_type VARCHAR(100),
  p_data JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
    webhook_exists BOOLEAN;
    customer_id VARCHAR(100);
    subscription_id VARCHAR(100);
    user_record UUID;
    subscription_record UUID;
BEGIN
    -- Verificar si el webhook ya fue procesado
    SELECT EXISTS(
        SELECT 1 FROM stripe_webhooks 
        WHERE stripe_event_id = p_stripe_event_id AND processed = TRUE
    ) INTO webhook_exists;
    
    IF webhook_exists THEN
        RETURN TRUE; -- Ya procesado
    END IF;
    
    -- Insertar o actualizar el webhook
    INSERT INTO stripe_webhooks (stripe_event_id, event_type, data)
    VALUES (p_stripe_event_id, p_event_type, p_data)
    ON CONFLICT (stripe_event_id) 
    DO UPDATE SET 
        event_type = p_event_type,
        data = p_data;
    
    -- Procesar según el tipo de evento
    CASE p_event_type
        WHEN 'customer.subscription.created' THEN
            customer_id := p_data->'data'->'object'->>'customer';
            subscription_id := p_data->'data'->'object'->>'id';
            
            -- Actualizar suscripción del usuario
            UPDATE user_subscriptions 
            SET 
                stripe_subscription_id = subscription_id,
                status = p_data->'data'->'object'->>'status',
                current_period_start = TO_TIMESTAMP((p_data->'data'->'object'->>'current_period_start')::INTEGER),
                current_period_end = TO_TIMESTAMP((p_data->'data'->'object'->>'current_period_end')::INTEGER),
                updated_at = NOW()
            WHERE stripe_customer_id = customer_id;
            
        WHEN 'customer.subscription.updated' THEN
            subscription_id := p_data->'data'->'object'->>'id';
            
            UPDATE user_subscriptions 
            SET 
                status = p_data->'data'->'object'->>'status',
                current_period_start = TO_TIMESTAMP((p_data->'data'->'object'->>'current_period_start')::INTEGER),
                current_period_end = TO_TIMESTAMP((p_data->'data'->'object'->>'current_period_end')::INTEGER),
                cancel_at_period_end = (p_data->'data'->'object'->>'cancel_at_period_end')::BOOLEAN,
                updated_at = NOW()
            WHERE stripe_subscription_id = subscription_id;
            
        WHEN 'customer.subscription.deleted' THEN
            subscription_id := p_data->'data'->'object'->>'id';
            
            UPDATE user_subscriptions 
            SET 
                status = 'canceled',
                updated_at = NOW()
            WHERE stripe_subscription_id = subscription_id;
            
        WHEN 'invoice.payment_succeeded' THEN
            customer_id := p_data->'data'->'object'->>'customer';
            subscription_id := p_data->'data'->'object'->>'subscription';
            
            -- Buscar usuario y suscripción
            SELECT us.user_id, us.id INTO user_record, subscription_record
            FROM user_subscriptions us
            WHERE us.stripe_subscription_id = subscription_id;
            
            IF FOUND THEN
                -- Insertar factura
                INSERT INTO invoices (
                    user_id,
                    subscription_id,
                    stripe_invoice_id,
                    amount_due,
                    amount_paid,
                    currency,
                    status,
                    invoice_pdf,
                    period_start,
                    period_end,
                    paid_at
                ) VALUES (
                    user_record,
                    subscription_record,
                    p_data->'data'->'object'->>'id',
                    (p_data->'data'->'object'->>'amount_due')::DECIMAL(10,2),
                    (p_data->'data'->'object'->>'amount_paid')::DECIMAL(10,2),
                    p_data->'data'->'object'->>'currency',
                    p_data->'data'->'object'->>'status',
                    p_data->'data'->'object'->>'invoice_pdf',
                    TO_TIMESTAMP((p_data->'data'->'object'->'lines'->'data'->0->>'period_start')::INTEGER),
                    TO_TIMESTAMP((p_data->'data'->'object'->'lines'->'data'->0->>'period_end')::INTEGER),
                    NOW()
                )
                ON CONFLICT (stripe_invoice_id) 
                DO UPDATE SET 
                    amount_due = EXCLUDED.amount_due,
                    amount_paid = EXCLUDED.amount_paid,
                    status = EXCLUDED.status,
                    period_start = EXCLUDED.period_start,
                    period_end = EXCLUDED.period_end,
                    paid_at = EXCLUDED.paid_at,
                    updated_at = NOW();
            END IF;
            
        WHEN 'invoice.payment_failed' THEN
            subscription_id := p_data->'data'->'object'->>'subscription';
            
            UPDATE user_subscriptions 
            SET 
                status = 'past_due',
                updated_at = NOW()
            WHERE stripe_subscription_id = subscription_id;
            
    END CASE;
    
    -- Marcar webhook como procesado
    UPDATE stripe_webhooks 
    SET 
        processed = TRUE,
        processed_at = NOW()
    WHERE stripe_event_id = p_stripe_event_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Función para manejar cambios en el estado de suscripción
CREATE OR REPLACE FUNCTION handle_subscription_change(
  p_stripe_subscription_id VARCHAR(100),
  p_status VARCHAR(50),
  p_current_period_start TIMESTAMP WITH TIME ZONE,
  p_current_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
BEGIN
  UPDATE user_subscriptions
  SET 
    status = p_status,
    current_period_start = p_current_period_start,
    current_period_end = p_current_period_end,
    updated_at = NOW()
  WHERE stripe_subscription_id = p_stripe_subscription_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para manejar eventos de facturas
CREATE OR REPLACE FUNCTION handle_invoice_event(
  p_stripe_invoice_id VARCHAR(100),
  p_user_id UUID,
  p_amount_due DECIMAL(10,2),
  p_amount_paid DECIMAL(10,2),
  p_status VARCHAR(50),
  p_period_start TIMESTAMP WITH TIME ZONE,
  p_period_end TIMESTAMP WITH TIME ZONE
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO invoices (
    user_id,
    stripe_invoice_id,
    amount_due,
    amount_paid,
    status,
    period_start,
    period_end
  )
  VALUES (
    p_user_id,
    p_stripe_invoice_id,
    p_amount_due,
    p_amount_paid,
    p_status,
    p_period_start,
    p_period_end
  )
  ON CONFLICT (stripe_invoice_id)
  DO UPDATE SET
    amount_due = EXCLUDED.amount_due,
    amount_paid = EXCLUDED.amount_paid,
    status = EXCLUDED.status,
    period_start = EXCLUDED.period_start,
    period_end = EXCLUDED.period_end;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener la información de facturación de un usuario
CREATE OR REPLACE FUNCTION get_user_billing_info(p_user_id UUID)
RETURNS TABLE (
  subscription_status VARCHAR(50),
  plan_name VARCHAR(100),
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  stripe_customer_id VARCHAR(100)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.status,
    sp.display_name,
    us.current_period_end,
    us.trial_end,
    us.stripe_customer_id
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el historial de facturación de un usuario
CREATE OR REPLACE FUNCTION get_user_billing_history(p_user_id UUID)
RETURNS TABLE (
    invoice_id UUID,
    amount_paid DECIMAL(10,2),
    currency VARCHAR(3),
    status VARCHAR(50),
    invoice_pdf TEXT,
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.amount_paid,
        i.currency,
        i.status,
        i.invoice_pdf,
        i.period_start,
        i.period_end,
        i.created_at
    FROM invoices i
    WHERE i.user_id = p_user_id
    ORDER BY i.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de suscripciones
CREATE OR REPLACE FUNCTION get_subscription_stats()
RETURNS TABLE (
    plan_name VARCHAR(50),
    active_subscriptions BIGINT,
    total_revenue DECIMAL(10,2),
    avg_monthly_revenue NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sp.name,
        COUNT(us.id) FILTER (WHERE us.status = 'active'),
        COALESCE(SUM(i.amount_paid) FILTER (WHERE i.status = 'paid'), 0)::DECIMAL(10,2),
        COALESCE(AVG(i.amount_paid) FILTER (WHERE i.status = 'paid'), 0)
    FROM subscription_plans sp
    LEFT JOIN user_subscriptions us ON sp.id = us.plan_id
    LEFT JOIN invoices i ON us.id = i.subscription_id
    GROUP BY sp.id, sp.name
    ORDER BY sp.price_monthly;
END;
$$ LANGUAGE plpgsql;

-- Habilitar RLS
ALTER TABLE stripe_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
CREATE POLICY "Service role can manage stripe events" ON stripe_events
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Users can view own invoices" ON invoices
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own payment methods" ON payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own payment methods" ON payment_methods
  FOR ALL USING (auth.uid() = user_id);
