# Suitpax

Suitpax is a next-generation travel technology platform designed to revolutionize business travel with AI-powered solutions.

## Project Structure

The project follows a well-organized structure:

\`\`\`
suitpax-landing/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── manifesto/          # Manifesto page
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── features/           # Feature components
│   ├── layout/             # Layout components
│   ├── ui/                 # UI components
│   └── workspace/          # Workspace components
├── lib/                    # Utility functions
├── public/                 # Static assets
│   ├── agents/             # Agent avatars
│   ├── community/          # Community member images
│   ├── founders/           # Founder images
│   ├── images/             # General images
│   ├── logo/               # Logo assets
│   └── ui-docs/            # UI documentation
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
\`\`\`

## Getting Started

First, install the dependencies:

\`\`\`bash
npm install
# or
yarn install
# or
pnpm install
\`\`\`

Then, run the development server:

\`\`\`bash
npm run dev
# or
yarn dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## UI Documentation

Comprehensive UI documentation is available in the `public/ui-docs` directory. This documentation covers:

- Design system overview
- Component specifications
- Style guidelines
- Best practices

## Features

- **AI-Powered Travel Agents**: Virtual agents that handle travel arrangements
- **Business Travel Management**: Comprehensive tools for managing corporate travel
- **CRM Integration**: Customer relationship management for travel businesses
- **Financial Integration**: Connect with banking systems for seamless payments
- **Task Management**: Organize and track travel-related tasks
- **Flight Booking**: Streamlined flight booking experience

## Tech Stack

- **Framework**: Next.js with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: ShadCN UI
- **Animation**: Framer Motion
- **Icons**: Lucide React, React Icons

## Contributing

1. Follow the project structure
2. Document new components in the UI docs
3. Maintain consistent styling using the design system
4. Ensure responsive design for all components
5. Optimize for performance and accessibility
