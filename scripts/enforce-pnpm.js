#!/usr/bin/env node

const isPnpm = Boolean(process.env.npm_config_user_agent && process.env.npm_config_user_agent.includes('pnpm'));
if (!isPnpm) {
  console.error('\nEste proyecto usa pnpm. Por favor, instala usando:\n\n  pnpm install\n');
  process.exit(1);
}