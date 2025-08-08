Suitpax AI is a cutting-edge business travel management platform that leverages artificial intelligence to revolutionize corporate travel planning and execution. Our platform combines natural language processing, voice assistance, and intelligent automation to provide a seamless travel management experience.

### Key Features

- **AI Voice Assistant**: Natural language interaction for travel planning and management
- **Smart Itinerary Planning**: AI-powered travel recommendations and optimization
- **Real-time Updates**: Live flight and hotel information
- **Expense Management**: Automated receipt processing and expense reporting
- **Policy Compliance**: Built-in corporate travel policy enforcement
- **Multi-language Support**: Global travel assistance in multiple languages

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later
- Supabase account and project
- Anthropic API key
- Brevo API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/suitpax/suitpax-ai.git
cd suitpax-ai
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Configure the following variables in `.env.local`:
```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
ANTHROPIC_API_KEY=your_anthropic_key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Email (Brevo)
BREVO_API_KEY=your_brevo_key
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
suitpax-ai/
├── app/                   # Next.js app directory
│   ├── (auth)/           # Authentication routes
│   ├── (dashboard)/      # Dashboard routes
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ai/              # AI-related components
│   ├── dashboard/       # Dashboard components
│   ├── layout/         # Layout components
│   └── ui/             # UI components
├── lib/                 # Utility functions and shared code
│   ├── actions/        # Server actions
│   ├── api/            # API clients
│   ├── config/         # Configuration
│   ├── hooks/          # Custom React hooks
│   ├── stores/         # State management
│   ├── types/          # TypeScript types
│   └── utils/          # Utility functions
├── public/             # Static files
└── styles/             # Global styles
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Radix UI
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **Data Visualization**: Recharts

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude
- **Voice**: ElevenLabs
- **Email**: Brevo

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Git Hooks**: husky
- **Formatting**: Prettier

## Security

- **Authentication**: JWT-based authentication with Supabase
- **Authorization**: Role-based access control
- **API Security**: Rate limiting and request validation
- **Data Protection**: End-to-end encryption for sensitive data
- **Compliance**: GDPR and SOC 2 compliant

## Testing

```bash
# Run unit tests
pnpm test

# Run integration tests
pnpm test:integration

# Run e2e tests
pnpm test:e2e

# Run all tests with coverage
pnpm test:coverage
```

## Deployment

The application is deployed using Vercel's Platform:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy using the Vercel CLI:
```bash
vercel --prod
```

## API Documentation

API documentation is available at `/api/docs` when running the development server. The API follows RESTful principles and includes:

- Authentication endpoints
- Travel management endpoints
- AI interaction endpoints
- Voice processing endpoints
- Expense management endpoints

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Performance Monitoring

- **Analytics**: Vercel Analytics
- **Error Tracking**: Sentry
- **Performance Metrics**: Web Vitals
- **Uptime Monitoring**: UptimeRobot

## Internationalization

The application supports multiple languages through:
- Dynamic language detection
- RTL support
- Locale-specific formatting
- Translation management

## License

This project is private and proprietary. All rights reserved.

## Team

- **Alberto Z. Burillo** - *Founder & CEO* - [@azburillo](https://github.com/azburillo)

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Anthropic](https://www.anthropic.com/)
- [ElevenLabs](https://elevenlabs.io/)
- [Vercel](https://vercel.com/)

## Support

For support, email support@suitpax.com or join our Slack channel.

---

<div align="center">
  <sub>Built with ❤️ by Suitpax Team</sub>
</div>
```


