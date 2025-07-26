-- Function to create default AI agents for new users
CREATE OR REPLACE FUNCTION public.create_default_ai_agents()
RETURNS TRIGGER AS $$
BEGIN
  -- Create default travel assistant agent
  INSERT INTO public.ai_agents (profile_id, name, description, agent_type, avatar_url, personality, capabilities)
  VALUES (
    NEW.id,
    'Travel Assistant',
    'Your personal AI travel assistant to help with bookings and recommendations',
    'travel_assistant',
    '/agents/agent-sophia.jpeg',
    '{"tone": "friendly", "expertise": "travel_planning", "language_style": "professional"}',
    '["flight_booking", "hotel_search", "itinerary_planning", "travel_recommendations"]'
  );

  -- Create default expense manager agent
  INSERT INTO public.ai_agents (profile_id, name, description, agent_type, avatar_url, personality, capabilities)
  VALUES (
    NEW.id,
    'Expense Manager',
    'AI agent specialized in expense tracking and policy compliance',
    'expense_manager',
    '/agents/agent-marcus.jpeg',
    '{"tone": "analytical", "expertise": "financial_management", "language_style": "precise"}',
    '["expense_categorization", "receipt_processing", "policy_compliance", "reporting"]'
  );

  -- Create default policy advisor agent
  INSERT INTO public.ai_agents (profile_id, name, description, agent_type, avatar_url, personality, capabilities)
  VALUES (
    NEW.id,
    'Policy Advisor',
    'AI agent that helps you understand and comply with travel policies',
    'policy_advisor',
    '/agents/agent-emma.jpeg',
    '{"tone": "helpful", "expertise": "policy_guidance", "language_style": "clear"}',
    '["policy_interpretation", "compliance_checking", "approval_workflows", "guidelines"]'
  );

  -- Create default travel policies
  INSERT INTO public.travel_policies (profile_id, name, description, policy_type, status, rules)
  VALUES 
    (
      NEW.id,
      'Flight Booking Policy',
      'Standard policy for flight bookings and approvals',
      'flight',
      'active',
      '{"max_domestic_flight": 800, "max_international_flight": 2000, "advance_booking_days": 14, "class_restriction": "economy"}'
    ),
    (
      NEW.id,
      'Hotel Accommodation Policy',
      'Guidelines for hotel bookings and expense limits',
      'hotel',
      'active',
      '{"max_night_rate_domestic": 200, "max_night_rate_international": 300, "star_rating_limit": 4, "location_restrictions": []}'
    ),
    (
      NEW.id,
      'General Expense Policy',
      'Overall expense limits and approval workflows',
      'expense_limit',
      'active',
      '{"daily_meal_allowance": 75, "max_single_expense": 500, "requires_receipt_above": 25, "auto_approval_limit": 100}'
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run after profile creation
CREATE OR REPLACE TRIGGER create_user_defaults
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_default_ai_agents();
