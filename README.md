# 🚀 Suitpax AI - Business Travel Intelligence Platform

Suitpax AI is a cutting-edge business travel management platform that leverages artificial intelligence to revolutionize corporate travel planning and execution. Our platform combines natural language processing, voice assistance, and intelligent automation to provide a seamless travel management experience.

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **AI Voice Assistant**: Natural language interaction with ElevenLabs integration
- **Suitpax AI Chat**: Advanced conversational AI with Mem0 memory persistence
- **Smart Policy Management**: AI-powered document analysis and policy recommendations
- **Intelligent Expense Processing**: OCR-powered receipt scanning and categorization

### 🛫 Travel Management
- **Flight Search & Booking**: Real-time flight search with Duffel API integration
- **Hotel & Accommodation**: Comprehensive booking management
- **Itinerary Planning**: AI-optimized travel recommendations
- **Real-time Updates**: Live flight and hotel information with notifications

### 💼 Business Intelligence
- **Expense Management**: Automated receipt processing and expense reporting
- **Cost Center Analytics**: Comprehensive spending analysis and reporting
- **Policy Compliance**: Built-in corporate travel policy enforcement
- **Team Collaboration**: Shared dashboards and approval workflows

### 🎯 Advanced Features
- **Voice AI Integration**: Speech-to-text and text-to-speech capabilities
- **Document Processing**: Advanced OCR with Google Cloud Vision and OCR.space
- **Multi-language Support**: Global travel assistance in multiple languages
- **Calendar Integration**: Seamless meeting and travel scheduling

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion
- **Rich Text**: TipTap Editor
- **Charts**: Recharts

### Backend & AI
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Models**: Anthropic Claude, Grok (xAI)
- **Voice Processing**: ElevenLabs
- **Memory**: Mem0 for persistent AI memory
- **Document Processing**: Google Cloud Vision, OCR.space
- **Travel APIs**: Duffel for flights

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Analytics**: Vercel Analytics
- **Monitoring**: Sentry

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later
- Supabase account and project
- Required API keys (see Environment Variables)

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/suitpax/suitpax-ai.git
cd suitpax-ai
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure the following variables in `.env.local`:
\`\`\`env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Database & Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
ANTHROPIC_API_KEY=your_anthropic_key
XAI_API_KEY=your_grok_key
ELEVENLABS_API_KEY=your_elevenlabs_key
MEM0_API_KEY=your_mem0_key

# Document Processing
GOOGLE_CLOUD_VISION_API_KEY=your_google_vision_key
OCR_SPACE_API_KEY=your_ocr_space_key

# Travel APIs
DUFFEL_API_KEY=your_duffel_key
DUFFEL_WEBHOOK_SECRET=your_duffel_webhook_secret

# Flights Data (optional)
AIRLABS_API_KEY=your_airlabs_key

# Email Services
BREVO_API_KEY=your_brevo_key

# Analytics & Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
\`\`\`

4. Run the development server:
\`\`\`bash
pnpm dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

\`\`\`
suitpax-ai/
├── app/                          # Next.js app directory
│   ├── (auth)/                  # Authentication routes
│   ├── dashboard/               # Dashboard routes
│   │   ├── flights/            # Flight management
│   │   ├── expenses/           # Expense tracking
│   │   ├── policies/           # Policy management
│   │   ├── suitpax-ai/         # AI chat interface
│   │   ├── voice-ai/           # Voice AI features
│   │   └── analytics/          # Business analytics
│   ├── api/                    # API routes
│   │   ├── ai/                 # AI processing endpoints
│   │   ├── flights/            # Flight API routes
│   │   ├── elevenlabs/         # Voice processing
│   │   └── suitpax-ai/         # AI chat API
│   └── layout.tsx              # Root layout
├── components/                  # React components
│   ├── dashboard/              # Dashboard components
│   ├── flights/                # Flight-related components
│   ├── marketing/              # Landing page components
│   └── ui/                     # Reusable UI components
├── lib/                        # Utility functions and services
│   ├── intelligence/           # AI services (Mem0, etc.)
│   ├── ocr/                    # Document processing
│   ├── supabase/               # Database clients
│   └── utils/                  # Utility functions
├── contexts/                   # React contexts
├── hooks/                      # Custom React hooks
├── scripts/                    # Database scripts
└── public/                     # Static assets
\`\`\`

## 🔧 Key Integrations

### AI & Intelligence
- **Anthropic Claude**: Primary AI model for conversations
- **Mem0**: Persistent memory for AI agents
- **ElevenLabs**: Voice synthesis and speech recognition
- **Google Cloud Vision**: Advanced document OCR
- **OCR.space**: Backup OCR service

### Travel & Business
- **Duffel**: Flight search and booking API
- **Supabase**: Database and authentication
- **Brevo**: Email automation
- **Vercel**: Hosting and analytics

## 🧪 Testing

\`\`\`bash
# Run unit tests
pnpm test

# Run integration tests
pnpm test:integration

# Run e2e tests
pnpm test:e2e

# Run all tests with coverage
pnpm test:coverage
\`\`\`

## 🚀 Deployment

The application is deployed using Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy using the Vercel CLI:
\`\`\`bash
vercel --prod
\`\`\`

## 📊 Features Overview

### Dashboard Pages
- **Main Dashboard**: Overview with user stats and quick actions
- **Flights**: Search, book, and manage flights with Duffel integration
- **Expenses**: OCR-powered expense tracking and reporting
- **Policies**: AI-driven policy management and compliance
- **Voice AI**: Advanced voice interaction capabilities
- **Suitpax AI**: Conversational AI with persistent memory
- **Analytics**: Business intelligence and reporting
- **Calendar**: Meeting and travel scheduling
- **Team**: Collaboration and user management

### AI Capabilities
- **Natural Language Processing**: Advanced conversation handling
- **Document Analysis**: Intelligent policy and receipt processing
- **Voice Interaction**: Speech-to-text and text-to-speech
- **Memory Persistence**: Context-aware conversations
- **Smart Recommendations**: AI-powered travel and policy suggestions

## 🔒 Security & Compliance

- **Authentication**: JWT-based with Supabase Auth
- **Authorization**: Role-based access control (RBAC)
- **Data Encryption**: End-to-end encryption for sensitive data
- **API Security**: Rate limiting and request validation
- **Compliance**: GDPR and SOC 2 ready

## 📈 Performance & Monitoring

- **Analytics**: Vercel Analytics integration
- **Error Tracking**: Sentry for error monitoring
- **Performance**: Core Web Vitals optimization
- **Caching**: Smart caching with LRU and persistence
- **Rate Limiting**: API protection and abuse prevention

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Team

- **Alberto Z. Burillo** - *Founder & CEO* - [@azburillo](https://github.com/azburillo)

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Anthropic](https://www.anthropic.com/)
- [ElevenLabs](https://elevenlabs.io/)
- [Mem0](https://mem0.ai/)
- [Duffel](https://duffel.com/)
- [Vercel](https://vercel.com/)

## 📞 Support

For support, email support@suitpax.com or visit our documentation.

---

<div align="center">
  <sub>Built with ❤️ by the Suitpax Team</sub>
</div>
