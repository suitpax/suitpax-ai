-- Remove Stripe-related columns from profiles table
ALTER TABLE profiles 
DROP COLUMN IF EXISTS stripe_customer_id,
DROP COLUMN IF EXISTS stripe_subscription_id;

-- Update any existing premium/enterprise users to free plan
UPDATE profiles 
SET subscription_plan = 'free', 
    subscription_status = 'active',
    ai_tokens_limit = 5000
WHERE subscription_plan IN ('premium', 'enterprise');
