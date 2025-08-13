-- Create travel_policies table
CREATE TABLE IF NOT EXISTS travel_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('travel', 'expense', 'approval', 'compliance')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'draft', 'archived')),
  description TEXT,
  rules JSONB NOT NULL DEFAULT '[]',
  applicable_roles TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  violations_count INTEGER DEFAULT 0,
  compliance_rate NUMERIC DEFAULT 100.0
);

-- Create policy_violations table
CREATE TABLE IF NOT EXISTS policy_violations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES travel_policies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  violation_type TEXT NOT NULL,
  description TEXT,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  booking_id UUID REFERENCES flight_bookings(id) ON DELETE SET NULL,
  expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL
);

-- Create policy_approvals table
CREATE TABLE IF NOT EXISTS policy_approvals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  policy_id UUID REFERENCES travel_policies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type TEXT NOT NULL CHECK (request_type IN ('booking', 'expense', 'policy_exception')),
  request_data JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  booking_id UUID REFERENCES flight_bookings(id) ON DELETE SET NULL,
  expense_id UUID REFERENCES expenses(id) ON DELETE SET NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_travel_policies_user_id ON travel_policies(user_id);
CREATE INDEX IF NOT EXISTS idx_travel_policies_status ON travel_policies(status);
CREATE INDEX IF NOT EXISTS idx_travel_policies_category ON travel_policies(category);

CREATE INDEX IF NOT EXISTS idx_policy_violations_policy_id ON policy_violations(policy_id);
CREATE INDEX IF NOT EXISTS idx_policy_violations_user_id ON policy_violations(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_violations_resolved ON policy_violations(resolved);

CREATE INDEX IF NOT EXISTS idx_policy_approvals_user_id ON policy_approvals(user_id);
CREATE INDEX IF NOT EXISTS idx_policy_approvals_approver_id ON policy_approvals(approver_id);
CREATE INDEX IF NOT EXISTS idx_policy_approvals_status ON policy_approvals(status);

-- Enable Row Level Security
ALTER TABLE travel_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE policy_approvals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own policies" ON travel_policies
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own policies" ON travel_policies
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own policies" ON travel_policies
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own policies" ON travel_policies
  FOR DELETE USING (auth.uid() = user_id);

-- Similar policies for violations and approvals
CREATE POLICY "Users can view their own violations" ON policy_violations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their approval requests" ON policy_approvals
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = approver_id);

-- Insert sample policies
INSERT INTO travel_policies (user_id, name, category, status, description, rules, applicable_roles, created_by, violations_count, compliance_rate) VALUES
(auth.uid(), 'Executive Travel Policy', 'travel', 'active', 'Comprehensive travel policy for executive-level employees', 
 '[{"id": "1", "type": "booking_class", "condition": "flight_class", "value": "business", "action": "allow", "priority": 1}]',
 ARRAY['Executive', 'VP', 'Director'], 'System', 2, 98.0),
(auth.uid(), 'Standard Employee Travel', 'travel', 'active', 'Standard travel policy for regular employees',
 '[{"id": "2", "type": "booking_class", "condition": "flight_class", "value": "economy", "action": "allow", "priority": 1}]',
 ARRAY['Employee', 'Manager'], 'System', 5, 94.0),
(auth.uid(), 'Expense Approval Workflow', 'approval', 'active', 'Automated approval workflow for expenses',
 '[{"id": "3", "type": "approval_required", "condition": "amount_over", "value": 1000, "action": "require_approval", "priority": 1}]',
 ARRAY['All'], 'System', 1, 99.0);
