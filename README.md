# 🚀 Suitpax - AI-Powered Business Travel Platform

Transform your business travel with AI-powered agents. Book flights, manage expenses, and streamline travel policies with intelligent automation.

## ✨ Features

- 🤖 **AI Travel Agents** - Intelligent booking and recommendations
- 💰 **Expense Management** - Automated expense tracking and reporting
- 📊 **Analytics Dashboard** - Real-time insights and reporting
- 🔄 **Approval Workflows** - Customizable approval processes
- 🌍 **Global Integration** - Connect with major travel providers
- 📱 **Mobile Ready** - Responsive design for all devices

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Supabase Auth
- **AI**: Anthropic Claude + xAI Grok
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- PostgreSQL database

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/suitpax-landing.git
   cd suitpax-landing
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   # Edit .env.local with your actual values
   \`\`\`

4. **Set up the database**
   \`\`\`bash
   pnpm db:generate
   pnpm db:push
   \`\`\`

5. **Run the development server**
   \`\`\`bash
   pnpm dev
   \`\`\`

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

\`\`\`
suitpax-landing/
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── (marketing)/       # Public marketing pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── marketing/        # Marketing page components
│   ├── dashboard/        # Dashboard components
│   ├── ui/              # Reusable UI components
│   └── intercom/        # Intercom integration
├── lib/                  # Utility functions
├── prisma/              # Database schema
├── public/              # Static assets
└── types/               # TypeScript definitions
\`\`\`

## 🔧 Available Scripts

\`\`\`bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:studio        # Open Prisma Studio
pnpm db:migrate       # Run migrations
pnpm db:reset         # Reset database

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript checks
\`\`\`

## 🌐 Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Database
DATABASE_URL="your-database-url"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"

# AI Services
ANTHROPIC_API_KEY="your-anthropic-api-key"
XAI_API_KEY="your-xai-api-key"

# Intercom
NEXT_PUBLIC_INTERCOM_APP_ID="t7e59vcn"
\`\`\`

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables in Vercel dashboard**
3. **Deploy automatically on push to main**

### Manual Deployment

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@suitpax.com
- 💬 Intercom: Available in the app
- 📖 Documentation: [docs.suitpax.com](https://docs.suitpax.com)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI features
- [ ] More travel integrations
- [ ] Enterprise features
- [ ] Multi-language support

---

Made with ❤️ by the Suitpax Team
