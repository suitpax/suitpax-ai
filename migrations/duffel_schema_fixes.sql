-- Safe fixes for Duffel schema
-- Ensure required extensions exist (for uuid functions)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add trigger to maintain updated_at on order_changes (field exists but trigger was missing)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'order_changes' AND column_name = 'updated_at'
  ) THEN
    CREATE TRIGGER set_timestamp_order_changes
    BEFORE UPDATE ON order_changes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Add explicit INSERT policies with WITH CHECK to complement existing FOR ALL USING policies
-- flight_searches
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'flight_searches' AND policyname = 'flight_searches_insert_policy'
  ) THEN
    CREATE POLICY flight_searches_insert_policy ON flight_searches
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- flight_bookings
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'flight_bookings' AND policyname = 'flight_bookings_insert_policy'
  ) THEN
    CREATE POLICY flight_bookings_insert_policy ON flight_bookings
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- user_loyalty_programs
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_loyalty_programs' AND policyname = 'user_loyalty_programs_insert_policy'
  ) THEN
    CREATE POLICY user_loyalty_programs_insert_policy ON user_loyalty_programs
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- user_corporate_codes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_corporate_codes' AND policyname = 'user_corporate_codes_insert_policy'
  ) THEN
    CREATE POLICY user_corporate_codes_insert_policy ON user_corporate_codes
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- corporate_loyalty_programs (admin-based)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'corporate_loyalty_programs' AND policyname = 'corporate_loyalty_programs_insert_policy'
  ) THEN
    CREATE POLICY corporate_loyalty_programs_insert_policy ON corporate_loyalty_programs
      FOR INSERT WITH CHECK (auth.uid() = admin_id);
  END IF;
END $$;

-- corporate_loyalty_authorizations (admin can create)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'corporate_loyalty_authorizations' AND policyname = 'corporate_loyalty_authorizations_insert_policy'
  ) THEN
    CREATE POLICY corporate_loyalty_authorizations_insert_policy ON corporate_loyalty_authorizations
      FOR INSERT WITH CHECK (
        auth.uid() IN (
          SELECT admin_id FROM corporate_loyalty_programs WHERE id = corporate_loyalty_id
        )
      );
  END IF;
END $$;

-- order_cancellations
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_cancellations' AND policyname = 'order_cancellations_insert_policy'
  ) THEN
    CREATE POLICY order_cancellations_insert_policy ON order_cancellations
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- order_changes
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'order_changes' AND policyname = 'order_changes_insert_policy'
  ) THEN
    CREATE POLICY order_changes_insert_policy ON order_changes
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;
