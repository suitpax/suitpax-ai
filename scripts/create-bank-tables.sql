-- Create bank_connections table for storing GoCardless connections
CREATE TABLE IF NOT EXISTS bank_connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gocardless_requisition_id TEXT NOT NULL UNIQUE,
  institution_id TEXT NOT NULL,
  institution_name TEXT NOT NULL,
  institution_logo TEXT,
  country_code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'suspended', 'error')),
  access_valid_for_days INTEGER DEFAULT 90,
  max_historical_days INTEGER DEFAULT 730,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  last_sync_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create bank_accounts table for storing connected bank accounts
CREATE TABLE IF NOT EXISTS bank_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  connection_id UUID NOT NULL REFERENCES bank_connections(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gocardless_account_id TEXT NOT NULL UNIQUE,
  account_name TEXT,
  account_holder_name TEXT,
  iban TEXT,
  account_number TEXT,
  sort_code TEXT,
  currency TEXT NOT NULL DEFAULT 'EUR',
  account_type TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'closed')),
  current_balance DECIMAL(15,2),
  available_balance DECIMAL(15,2),
  balance_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bank_transactions table for storing synchronized transactions
CREATE TABLE IF NOT EXISTS bank_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES bank_accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  gocardless_transaction_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'EUR',
  transaction_date DATE NOT NULL,
  booking_date DATE,
  value_date DATE,
  merchant_name TEXT,
  counterparty_name TEXT,
  description TEXT,
  reference TEXT,
  transaction_code TEXT,
  category TEXT,
  auto_category TEXT,
  is_business_expense BOOLEAN DEFAULT false,
  expense_id UUID REFERENCES expenses(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bank_categorization_rules table for automatic categorization
CREATE TABLE IF NOT EXISTS bank_categorization_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('merchant', 'description', 'amount', 'reference')),
  pattern TEXT NOT NULL,
  category TEXT NOT NULL,
  is_business_expense BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bank_connections_user_id ON bank_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_connections_status ON bank_connections(status);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_connection_id ON bank_accounts(connection_id);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_user_id ON bank_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account_id ON bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_user_id ON bank_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_date ON bank_transactions(transaction_date);
CREATE INDEX IF NOT EXISTS idx_bank_categorization_rules_user_id ON bank_categorization_rules(user_id);

-- Create RLS policies for security
ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_categorization_rules ENABLE ROW LEVEL SECURITY;

-- Policies for bank_connections
CREATE POLICY "Users can view their own bank connections" ON bank_connections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank connections" ON bank_connections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank connections" ON bank_connections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank connections" ON bank_connections
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for bank_accounts
CREATE POLICY "Users can view their own bank accounts" ON bank_accounts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank accounts" ON bank_accounts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank accounts" ON bank_accounts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank accounts" ON bank_accounts
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for bank_transactions
CREATE POLICY "Users can view their own bank transactions" ON bank_transactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bank transactions" ON bank_transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bank transactions" ON bank_transactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bank transactions" ON bank_transactions
  FOR DELETE USING (auth.uid() = user_id);

-- Policies for bank_categorization_rules
CREATE POLICY "Users can view their own categorization rules" ON bank_categorization_rules
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own categorization rules" ON bank_categorization_rules
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categorization rules" ON bank_categorization_rules
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categorization rules" ON bank_categorization_rules
  FOR DELETE USING (auth.uid() = user_id);
