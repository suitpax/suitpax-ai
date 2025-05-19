# Suitpax

Suitpax is the next-generation travel technology platform built to revolutionize business travel with AI-powered solutions.

---

## Table of Contents

1. [About Suitpax](#about-suitpax)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Features](#features)
5. [UI Documentation](#ui-documentation)
6. [Tech Stack](#tech-stack)
7. [Contributing](#contributing)

---

## About Suitpax

Suitpax offers modern, AI-powered tools for seamless corporate travel management. Our platform includes virtual agents, deep CRM and financial integrations, task management, and much more—designed to streamline the entire business travel experience.

---

## Project Structure

```
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
```

---

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000) to see the app running.

---

## Features

- **AI-Powered Travel Agents:** Virtual agents to handle travel arrangements.
- **Business Travel Management:** Comprehensive tools for managing corporate travel.
- **CRM Integration:** Customer relationship management tailored for travel businesses.
- **Financial Integration:** Connect with banking systems for seamless payments.
- **Task Management:** Organize and track all travel-related tasks.
- **Flight Booking:** Streamlined booking experience.

---

## UI Documentation

Full UI documentation is available in the `public/ui-docs` directory, including:
- Design system overview
- Component specifications
- Style guidelines
- Best practices

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** ShadCN UI
- **Animation:** Framer Motion
- **Icons:** Lucide React, React Icons

---

## Contributing

- Follow the established project structure.
- Document all new components in the UI docs.
- Maintain consistent styling using the design system.
- Ensure all components are responsive.
- Optimize code for performance and accessibility.

---

Let me know if you want to add badges, a demo section, or further customization!