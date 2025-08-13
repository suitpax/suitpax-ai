# GoCardless Bank Account Data Integration

## Overview

Suitpax integrates with GoCardless Bank Account Data API to provide secure, read-only access to users' business bank accounts for automated expense tracking and financial management.

## Architecture

### Components

1. **GoCardless Client** (`lib/gocardless/client.ts`)
   - Handles authentication and API requests
   - Implements rate limiting (10 requests/day per scope per account)
   - Manages access tokens and refresh logic

2. **API Routes** (`app/api/gocardless/`)
   - `/institutions` - Get available banks by country
   - `/connect` - Create bank connection requisitions
   - `/accounts` - Fetch account details and balances
   - `/transactions` - Retrieve transaction history
   - `/webhooks` - Handle real-time status updates

3. **Database Schema** (Supabase)
   - `bank_connections` - Connection status and metadata
   - `bank_accounts` - Account details and balances
   - `bank_transactions` - Transaction history
   - `webhook_events` - Event processing logs

## User Flow

### 1. Bank Selection
\`\`\`
User → Dashboard → Connect Bank → Select Country → Choose Bank
\`\`\`

### 2. Authentication Flow
\`\`\`
1. Create End User Agreement (optional)
2. Create Requisition with redirect URL
3. User redirected to bank's secure login
4. User authenticates and grants permissions
5. Bank redirects back to Suitpax
6. Webhook confirms connection status
\`\`\`

### 3. Data Synchronization
\`\`\`
1. Fetch account details (name, IBAN, currency)
2. Get current balances
3. Retrieve transaction history (up to 24 months)
4. Store data in Supabase with encryption
5. Set up automatic sync via webhooks
\`\`\`

## Rate Limiting

GoCardless enforces strict rate limits:
- **10 requests per day** per account per scope (details, balances, transactions)
- **1000 requests per minute** for general operations
- Future reduction to **4 requests per day** planned

### Implementation
- Pre-request rate limit checking
- Local rate limit tracking with daily reset
- Graceful error handling for 429 responses
- User-friendly error messages with reset times

## Security

### Data Protection
- **256-bit SSL encryption** for all API communications
- **Read-only access** - no ability to initiate payments
- **Explicit user consent** required for each connection
- **No credential storage** - uses secure OAuth-like flow

### Webhook Verification
- **HMAC SHA-256 signature** verification
- **Timing-safe comparison** to prevent timing attacks
- **Event deduplication** using unique event IDs

## Environment Variables

Required configuration:

\`\`\`env
# GoCardless API Credentials
GOCARDLESS_SECRET_ID=your_secret_id
GOCARDLESS_SECRET_KEY=your_secret_key
GOCARDLESS_BASE_URL=https://bankaccountdata.gocardless.com  # Production
# GOCARDLESS_BASE_URL=https://api-sandbox.gocardless.com    # Sandbox

# Webhook Security
GOCARDLESS_WEBHOOK_SECRET=your_webhook_secret

# Database
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Error Handling

### Rate Limit Errors (429)
\`\`\`typescript
try {
  const transactions = await client.getAccountTransactions(accountId)
} catch (error) {
  if (error instanceof GoCardlessRateLimitError) {
    // Show user-friendly message with reset time
    const resetTime = new Date(error.resetTime)
    showMessage(`Rate limit reached. Try again after ${resetTime.toLocaleString()}`)
  }
}
\`\`\`

### Connection Errors
- **400 Bad Request**: Invalid parameters or malformed request
- **401 Unauthorized**: Invalid or expired credentials
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource doesn't exist
- **500+ Server Errors**: GoCardless service issues

## Webhook Events

### Requisition Events
- `created` - Connection request created
- `linked` - User completed bank authentication
- `expired` - Connection link expired
- `rejected` - User declined connection
- `error` - Connection failed

### Account Events
- `ready` - Account ready for data access
- `error` - Account access error
- `expired` - Account access expired
- `suspended` - Account temporarily suspended

### End User Agreement Events
- `accepted` - User accepted terms
- `expired` - Agreement expired
- `timed_out` - Agreement timed out

## Testing

### Sandbox Environment
Use `https://api-sandbox.gocardless.com` for development and testing.

### Test Banks
GoCardless provides test institutions for each supported country:
- **UK**: Lloyds Bank (Sandbox)
- **Germany**: Deutsche Bank (Sandbox)
- **France**: BNP Paribas (Sandbox)

### Webhook Testing
Use tools like ngrok to expose local webhook endpoints:
\`\`\`bash
ngrok http 3000
# Use the HTTPS URL for webhook configuration
\`\`\`

## Monitoring

### Rate Limit Monitoring
\`\`\`typescript
const rateLimitInfo = client.getRateLimitInfo(accountId, 'transactions')
console.log(`Requests used: ${rateLimitInfo.requestCount}/${rateLimitInfo.dailyLimit}`)
\`\`\`

### Connection Health
- Monitor webhook event processing
- Track failed API requests
- Alert on rate limit exhaustion
- Monitor token refresh failures

## Troubleshooting

### Common Issues

1. **"Authentication failed"**
   - Check GOCARDLESS_SECRET_ID and GOCARDLESS_SECRET_KEY
   - Verify environment (sandbox vs production)

2. **"Rate limit exceeded"**
   - Wait until reset time (shown in error message)
   - Consider caching data to reduce API calls
   - Contact GoCardless for exemption if needed

3. **"Webhook signature invalid"**
   - Verify GOCARDLESS_WEBHOOK_SECRET matches GoCardless configuration
   - Check webhook URL is accessible and returns 200

4. **"Account not ready"**
   - Wait for account webhook events
   - Some banks take time to provision access
   - Check account status in GoCardless dashboard

### Support
- GoCardless Documentation: https://developer.gocardless.com/bank-account-data/
- GoCardless Support: support@gocardless.com
- Suitpax Internal: Check logs in Supabase `webhook_events` table

## Future Enhancements

1. **Automatic Categorization**: Use transaction descriptions for expense categorization
2. **Spending Insights**: Analyze patterns and provide recommendations
3. **Budget Alerts**: Notify users when approaching spending limits
4. **Multi-Currency Support**: Handle accounts in different currencies
5. **Bulk Operations**: Batch process multiple accounts efficiently
