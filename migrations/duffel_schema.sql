-- Esquema de base de datos para la integración con Duffel
-- Creado con las mejores prácticas y optimizado para la implementación

-- Tabla para registro de búsquedas de vuelos
CREATE TABLE IF NOT EXISTS flight_searches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users,
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  passengers JSONB NOT NULL,
  cabin_class VARCHAR(20),
  search_params JSONB,
  offers_count INTEGER,
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_flight_searches_user_id ON flight_searches(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_searches_origin_dest ON flight_searches(origin, destination);
CREATE INDEX IF NOT EXISTS idx_flight_searches_dates ON flight_searches(departure_date, return_date);

-- Tabla para reservas de vuelos
CREATE TABLE IF NOT EXISTS flight_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  duffel_order_id VARCHAR(255) NOT NULL UNIQUE,
  booking_reference VARCHAR(50),
  status VARCHAR(50) NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  total_currency VARCHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  return_date DATE,
  origin VARCHAR(3) NOT NULL,
  destination VARCHAR(3) NOT NULL,
  passenger_count INTEGER NOT NULL,
  metadata JSONB,
  payment_status VARCHAR(50),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para reservas
CREATE INDEX IF NOT EXISTS idx_flight_bookings_user_id ON flight_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_duffel_order_id ON flight_bookings(duffel_order_id);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_status ON flight_bookings(status);
CREATE INDEX IF NOT EXISTS idx_flight_bookings_dates ON flight_bookings(departure_date);

-- Tabla para historial de estado de órdenes
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  booking_reference VARCHAR(50),
  source VARCHAR(50) NOT NULL, -- 'webhook', 'api', 'manual'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);

-- Tabla para programas de fidelidad de usuarios
CREATE TABLE IF NOT EXISTS user_loyalty_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  airline_iata_code VARCHAR(2) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  account_holder_title VARCHAR(10),
  account_holder_first_name VARCHAR(255),
  account_holder_last_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, airline_iata_code)
);

CREATE INDEX IF NOT EXISTS idx_user_loyalty_programs_user_id ON user_loyalty_programs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_loyalty_programs_airline ON user_loyalty_programs(airline_iata_code);

-- Tabla para códigos corporativos de usuarios
CREATE TABLE IF NOT EXISTS user_corporate_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  airline_iata_code VARCHAR(2) NOT NULL,
  code VARCHAR(255) NOT NULL,
  code_type VARCHAR(50) DEFAULT 'corporate_code',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, airline_iata_code, code)
);

CREATE INDEX IF NOT EXISTS idx_user_corporate_codes_user_id ON user_corporate_codes(user_id);
CREATE INDEX IF NOT EXISTS idx_user_corporate_codes_airline ON user_corporate_codes(airline_iata_code);

-- Tabla para programas de fidelidad corporativos
CREATE TABLE IF NOT EXISTS corporate_loyalty_programs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES auth.users NOT NULL,
  airline_iata_code VARCHAR(2) NOT NULL,
  account_number VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  organization_id VARCHAR(255),
  expiry_date DATE,
  admin_email VARCHAR(255),
  admin_phone VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(airline_iata_code, account_number)
);

CREATE INDEX IF NOT EXISTS idx_corporate_loyalty_programs_admin_id ON corporate_loyalty_programs(admin_id);
CREATE INDEX IF NOT EXISTS idx_corporate_loyalty_programs_airline ON corporate_loyalty_programs(airline_iata_code);

-- Tabla para autorizaciones de programas corporativos
CREATE TABLE IF NOT EXISTS corporate_loyalty_authorizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  corporate_loyalty_id UUID REFERENCES corporate_loyalty_programs NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  expires_at DATE,
  allowed_routes JSONB,
  max_bookings INTEGER,
  remaining_bookings INTEGER,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(corporate_loyalty_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_corporate_loyalty_authorizations_corporate ON corporate_loyalty_authorizations(corporate_loyalty_id);
CREATE INDEX IF NOT EXISTS idx_corporate_loyalty_authorizations_user ON corporate_loyalty_authorizations(user_id);
CREATE INDEX IF NOT EXISTS idx_corporate_loyalty_authorizations_active ON corporate_loyalty_authorizations(active);

-- Tabla para cancelaciones de órdenes
CREATE TABLE IF NOT EXISTS order_cancellations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  duffel_cancellation_id VARCHAR(255),
  status VARCHAR(50) NOT NULL, -- 'pending', 'confirmed', 'reverted', 'failed'
  reason TEXT,
  request_refund BOOLEAN DEFAULT TRUE,
  refund_method VARCHAR(50) DEFAULT 'original',
  refund_amount VARCHAR(50),
  refund_currency VARCHAR(3),
  original_data JSONB,
  confirmation_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  reverted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_order_cancellations_order_id ON order_cancellations(order_id);
CREATE INDEX IF NOT EXISTS idx_order_cancellations_user_id ON order_cancellations(user_id);
CREATE INDEX IF NOT EXISTS idx_order_cancellations_status ON order_cancellations(status);

-- Tabla para cambios de órdenes
CREATE TABLE IF NOT EXISTS order_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  duffel_change_request_id VARCHAR(255),
  change_type VARCHAR(50) NOT NULL, -- 'date', 'time', 'passenger', 'route'
  status VARCHAR(50) NOT NULL, -- 'pending', 'confirmed', 'failed'
  reason TEXT,
  original_data JSONB,
  requested_changes JSONB,
  selected_offer_id VARCHAR(255),
  confirmation_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_order_changes_order_id ON order_changes(order_id);
CREATE INDEX IF NOT EXISTS idx_order_changes_user_id ON order_changes(user_id);
CREATE INDEX IF NOT EXISTS idx_order_changes_status ON order_changes(status);

-- Tabla para registro de eventos webhook
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id VARCHAR(255) NOT NULL UNIQUE,
  event_type VARCHAR(100) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed_at ON webhook_events(processed_at);

-- Tabla para caché de aeropuertos
CREATE TABLE IF NOT EXISTS airport_cache (
  iata_code VARCHAR(3) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  city_name VARCHAR(255),
  country_name VARCHAR(255),
  country_code VARCHAR(2),
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  is_major BOOLEAN DEFAULT FALSE,
  data JSONB,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Tabla para caché de aerolíneas
CREATE TABLE IF NOT EXISTS airline_cache (
  iata_code VARCHAR(2) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  logo_url VARCHAR(255),
  logo_symbol_url VARCHAR(255),
  conditions_url VARCHAR(255),
  data JSONB,
  cached_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

-- Funciones para actualización de timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualización automática de timestamps
CREATE TRIGGER set_timestamp_flight_bookings
BEFORE UPDATE ON flight_bookings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_user_loyalty_programs
BEFORE UPDATE ON user_loyalty_programs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_user_corporate_codes
BEFORE UPDATE ON user_corporate_codes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_corporate_loyalty_programs
BEFORE UPDATE ON corporate_loyalty_programs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_corporate_loyalty_authorizations
BEFORE UPDATE ON corporate_loyalty_authorizations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_timestamp_flight_searches
BEFORE UPDATE ON flight_searches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Políticas de seguridad RLS (Row Level Security)

-- Activar RLS en todas las tablas
ALTER TABLE flight_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_corporate_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_loyalty_authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_cancellations ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_changes ENABLE ROW LEVEL SECURITY;

-- Políticas para flight_searches
CREATE POLICY flight_searches_user_policy ON flight_searches
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para flight_bookings
CREATE POLICY flight_bookings_user_policy ON flight_bookings
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para user_loyalty_programs
CREATE POLICY user_loyalty_programs_user_policy ON user_loyalty_programs
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para user_corporate_codes
CREATE POLICY user_corporate_codes_user_policy ON user_corporate_codes
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para corporate_loyalty_programs
CREATE POLICY corporate_loyalty_programs_admin_policy ON corporate_loyalty_programs
  FOR ALL USING (auth.uid() = admin_id);

-- Políticas para corporate_loyalty_authorizations
CREATE POLICY corporate_loyalty_authorizations_user_policy ON corporate_loyalty_authorizations
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY corporate_loyalty_authorizations_admin_policy ON corporate_loyalty_authorizations
  FOR ALL USING (auth.uid() IN (
    SELECT admin_id FROM corporate_loyalty_programs 
    WHERE id = corporate_loyalty_id
  ));

-- Políticas para order_cancellations
CREATE POLICY order_cancellations_user_policy ON order_cancellations
  FOR ALL USING (auth.uid() = user_id);

-- Políticas para order_changes
CREATE POLICY order_changes_user_policy ON order_changes
  FOR ALL USING (auth.uid() = user_id);