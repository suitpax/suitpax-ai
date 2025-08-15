# 🚀 SuitPax AI - Intelligent Business Travel Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.2-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TurboRepo](https://img.shields.io/badge/TurboRepo-Latest-red?logo=vercel)](https://turbo.build/)
[![License](https://img.shields.io/badge/License-Private-red.svg)](https://github.com/suitpax/suitpax-ai)

SuitPax AI is a cutting-edge business travel management platform that leverages artificial intelligence to revolutionize corporate travel planning and execution. Built as a modern monorepo with TurboRepo, our platform combines natural language processing, voice assistance, and intelligent automation to provide a seamless travel management experience.

## 🏗️ Architecture

This project is structured as a **TurboRepo monorepo** with multiple applications and shared packages:

```
suitpax-ai/
├── apps/
│   ├── web/                    # Public website (Port 3000)
│   └── dashboard/              # Business dashboard (Port 3001)
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── utils/                  # Utility functions
│   ├── domains/                # Business logic
│   └── shared/                 # Common types & configs
└── packages.json               # Workspace configuration
```

### 🌐 Applications

#### **Web App** (`apps/web`)
- **Purpose**: Public-facing website and marketing pages
- **Port**: 3000
- **Features**: Landing pages, marketing content, public API
- **Tech**: Next.js 15.2, React 19, TailwindCSS

#### **Dashboard App** (`apps/dashboard`)
- **Purpose**: Business intelligence and management dashboard
- **Port**: 3001
- **Features**: Travel management, expense tracking, AI chat, analytics
- **Tech**: Next.js 15.2, React 19, Zustand state management

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **AI Voice Assistant**: Natural language interaction with ElevenLabs integration
- **SuitPax AI Chat**: Advanced conversational AI with Mem0 memory persistence
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

### **Core Framework**
- **Monorepo**: TurboRepo for build optimization and caching
- **Frontend**: Next.js 15.2 with App Router
- **Language**: TypeScript 5.9
- **Runtime**: Node.js 20.x
- **Package Manager**: pnpm 9.0+

### **Frontend & UI**
- **Styling**: TailwindCSS 3.4+
- **Components**: Radix UI + shadcn/ui
- **Animations**: Framer Motion 11.11+
- **Rich Text**: TipTap Editor
- **Charts**: Recharts 2.15+
- **State Management**: Zustand 5.0+

### **Backend & Database**
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with JWT
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime subscriptions

### **AI & Machine Learning**
- **Primary AI**: Anthropic Claude (latest)
- **Alternative AI**: xAI Grok, Google Gemini
- **Voice Processing**: ElevenLabs
- **Memory**: Mem0 for persistent AI memory
- **Document AI**: Google Cloud Vision, OCR.space

### **External APIs**
- **Travel**: Duffel API (flights, hotels)
- **Email**: Brevo for transactional emails
- **Maps**: Google Maps API
- **Payments**: Stripe (planned integration)

### **Development & DevOps**
- **Build System**: TurboRepo with caching
- **Linting**: ESLint 9.0+ with TypeScript rules
- **Testing**: Jest + Testing Library + Playwright
- **Analytics**: Vercel Analytics + Speed Insights
- **Monitoring**: Sentry for error tracking
- **Deployment**: Vercel + Docker support

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 20.x or later
- **pnpm**: 9.0 or later
- **Git**: Latest version
- **Supabase account**: For database and auth

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/suitpax/suitpax-ai.git
cd suitpax-ai
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Environment setup**:
```bash
cp .env.example .env.local
```

Configure your `.env.local`:
```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_DASHBOARD_URL=http://localhost:3001

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

# Email & Communication
BREVO_API_KEY=your_brevo_key

# Analytics & Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_token
```

### Development Commands

```bash
# Start all applications
pnpm dev

# Start specific application
pnpm dev:web          # Web app only (port 3000)
pnpm dev:dashboard    # Dashboard only (port 3001)

# Build and test
pnpm build            # Build all apps and packages
pnpm lint             # Lint all code
pnpm test             # Run all tests
pnpm type-check       # TypeScript validation

# Clean and reset
pnpm clean            # Clean all build artifacts
```

### Access Points

- **Web App**: [http://localhost:3000](http://localhost:3000)
- **Dashboard**: [http://localhost:3001](http://localhost:3001)

## 📦 Package Structure

### **@suitpax/ui**
Shared UI components library with consistent design system
- Radix UI primitives
- shadcn/ui components
- Custom business components
- Theme configuration

### **@suitpax/utils**
Common utility functions and helpers
- Date/time utilities
- String manipulation
- API helpers
- Validation schemas

### **@suitpax/domains**
Business logic and domain models
- Travel booking logic
- Expense management
- User management
- Policy enforcement

### **@suitpax/shared**
Shared types, constants, and configurations
- TypeScript definitions
- API response types
- Configuration constants
- Shared schemas

## 🧪 Testing Strategy

```bash
# Unit tests
pnpm test:unit

# Integration tests
pnpm test:integration

# End-to-end tests
pnpm test:e2e

# Coverage report
pnpm test:coverage

# Watch mode
pnpm test:watch
```

## 🚀 Deployment

### **Vercel (Recommended)**

1. **Connect repository** to Vercel
2. **Configure environment variables** in dashboard
3. **Deploy**:
```bash
vercel --prod
```

### **Docker Deployment**

```bash
# Development
docker-compose up --build

# Production
docker-compose -f docker-compose.prod.yml up --build -d

# Health check
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health
```

### **Manual Deployment**

```bash
# Build for production
pnpm build

# Start production servers
pnpm start
```

For detailed deployment instructions, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## 🔧 Key Integrations

### **AI & Intelligence**
- **Anthropic Claude**: Primary conversational AI
- **Mem0**: Persistent memory for AI agents
- **ElevenLabs**: Voice synthesis and recognition
- **Google Cloud Vision**: Advanced document OCR
- **OCR.space**: Backup OCR service

### **Travel & Business**
- **Duffel**: Flight search and booking
- **Google Maps**: Location and mapping services
- **Supabase**: Database, auth, and real-time features
- **Brevo**: Email automation and marketing

### **Development & Analytics**
- **Vercel**: Hosting and edge functions
- **Sentry**: Error monitoring and performance
- **Vercel Analytics**: User behavior tracking

## 🎯 Dashboard Features

### **Core Modules**
- **🏠 Overview**: Dashboard with KPIs and quick actions
- **✈️ Flights**: Search, book, and manage business travel
- **💰 Expenses**: OCR-powered expense tracking and reporting
- **📋 Policies**: AI-driven policy management and compliance
- **🤖 SuitPax AI**: Conversational AI with persistent memory
- **🎙️ Voice AI**: Advanced voice interaction capabilities
- **📊 Analytics**: Business intelligence and reporting
- **📅 Calendar**: Meeting and travel scheduling
- **👥 Team**: Collaboration and user management

### **AI Capabilities**
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
- **Privacy**: Data minimization and user consent management

## 📈 Performance & Monitoring

- **Build Optimization**: TurboRepo caching and parallelization
- **Code Splitting**: Automatic route-based splitting
- **Analytics**: Vercel Analytics integration
- **Error Tracking**: Sentry for error monitoring
- **Performance**: Core Web Vitals optimization
- **Caching**: Smart caching with persistence
- **Rate Limiting**: API protection and abuse prevention

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### **Development Guidelines**
- Follow conventional commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all checks pass

## 📄 License

This project is **private and proprietary**. All rights reserved.

## 👥 Team

- **Alberto Z. Burillo** - *Founder & CEO* - [@azburillo](https://github.com/azburillo)

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) - React framework
- [TurboRepo](https://turbo.build/) - Monorepo build system
- [Supabase](https://supabase.com/) - Backend as a Service
- [Anthropic](https://www.anthropic.com/) - AI language models
- [ElevenLabs](https://elevenlabs.io/) - Voice AI technology
- [Mem0](https://mem0.ai/) - AI memory platform
- [Duffel](https://duffel.com/) - Travel booking API
- [Vercel](https://vercel.com/) - Deployment platform

## 📞 Support

For support and questions:
- 📧 **Email**: support@suitpax.com
- 📖 **Documentation**: [docs.suitpax.com](https://docs.suitpax.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/suitpax/suitpax-ai/issues)

---

<div align="center">
  <sub>Built with ❤️ by the SuitPax Team</sub><br>
  <sub>Powered by AI • Made for the Future of Business Travel</sub>
</div>
