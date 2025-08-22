# Security Policy

- Authentication is handled by Supabase Auth. Session tokens are managed by Supabase client libraries and not stored manually.
- Use HTTPS for all environments. Never commit secrets; configure via environment variables as per `.env.example`.
- Cookies issued by the password gate `/api/password/verify` are `httpOnly`, `sameSite=lax`, and `secure` in production.
- Input validation:
  - Zod is used for validating inputs in UI and API routes where applicable.
  - Always validate body/query params at API boundaries and return 4xx on invalid input.
- Least privilege:
  - Use `SUPABASE_SERVICE_ROLE` only on server-side API routes that require it.
  - Client uses `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Data access:
  - RLS should be enabled on all Supabase tables with policies.
- Dependencies:
  - Keep dependencies updated and run `pnpm audit` periodically.
- Reporting:
  - Report vulnerabilities privately to security@suitpax.com.