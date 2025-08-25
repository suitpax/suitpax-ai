# Suitpax Landing Page - Project Structure

## 📁 Project Organization

### `/app` - Next.js App Router
```
app/
├── layout.tsx              # Root layout with navigation & footer
├── page.tsx                # Homepage with main components
├── globals.css             # Global styles and CSS variables
├── ai-voice/
│   └── page.tsx            # AI Voice Assistant page
├── pricing/
│   └── page.tsx            # Pricing page with plans
├── manifesto/
│   └── page.tsx            # Company manifesto
├── travel-expense-management/
│   └── page.tsx            # Expense management features
├── solutions/
│   └── travel-policies/
│       └── page.tsx        # Travel policies solution
└── api/                    # API routes
    ├── chat/tools/         # Agent tool endpoints
    │   ├── flight-search/
    │   ├── code-generator/
    │   └── expense-analyzer/
    ├── elevenlabs/         # Voice AI endpoints
    ├── ai-chat/            # Chat functionality
    └── sitemap/            # Dynamic sitemap
```

### `/components` - Reusable Components
```
components/
├── ui/                     # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── marketing/              # Landing page sections
│   ├── hero.tsx           # Main hero section
│   ├── navigation.tsx     # Header navigation
│   ├── footer.tsx         # Footer component
│   ├── ai-travel-agents.tsx
│   ├── ai-voice-assistant.tsx
│   ├── plans.tsx          # Pricing plans
│   ├── compare-plans.tsx  # Feature comparison
│   └── ...
├── voice-ai/              # Voice AI components
└── intercom/              # Customer support
```

### `/lib` - Utilities & Configuration
```
lib/
├── utils.ts               # Utility functions
├── elevenlabs.ts          # Voice AI integration
├── language-detection.ts  # Language detection
├── chat/                  # Chat intent routing and helpers
│   └── router.ts
├── prompts/               # System prompts per agent
│   ├── system.ts
│   └── code/
│       └── index.ts
└── agents/                # Agent runner/types
    ├── runner.ts
    └── types.ts
```

### `/hooks` - Custom React Hooks
```
hooks/
├── use-speech-recognition.ts  # Speech-to-text
├── use-audio-recorder.ts      # Audio recording
└── use-media-query.ts         # Responsive utilities
```

### `/public` - Static Assets
```
public/
├── logo/                  # Brand logos
├── agents/                # AI agent avatars
├── images/                # General images
├── videos/                # Video content
├── legal/                 # Legal documents
├── manifest.json          # PWA manifest
├── sitemap.xml           # SEO sitemap
└── robots.txt            # SEO robots
```

## 🎯 Key Features

### ✅ Implemented
- **AI Voice Assistant** - Real-time speech recognition & synthesis
- **Modern Pricing** - Synchronized plans with 20% annual discount
- **Responsive Design** - Mobile-first approach
- **SEO Optimized** - Meta tags, sitemap, structured data
- **Performance** - Optimized images, lazy loading
- **Accessibility** - ARIA labels, keyboard navigation
- **Type Safety** - Full TypeScript implementation

### 🔧 Technical Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Voice AI**: ElevenLabs integration
- **Icons**: Lucide React + React Icons
- **Deployment**: Vercel optimized

## 📊 Performance Optimizations

### Core Web Vitals
- **LCP**: Optimized with Next.js Image component
- **FID**: Minimal JavaScript, efficient event handlers
- **CLS**: Proper image dimensions, stable layouts

### SEO Features
- Dynamic meta tags per page
- Structured data markup
- Optimized Open Graph images
- XML sitemap generation
- Robots.txt configuration

## 🚀 Development Workflow

### Getting Started
```bash
pnpm install
pnpm dev
```

### Build & Deploy
```bash
pnpm build
pnpm start
```

### Code Quality
```bash
pnpm lint
pnpm type-check
```

## 📱 Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 Design System
- **Colors**: Gray-based with emerald accents
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Components**: Reusable shadcn/ui base