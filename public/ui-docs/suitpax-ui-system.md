# Suitpax UI System

This document provides a comprehensive overview of the Suitpax UI design system, including colors, typography, spacing, components, and more.

## Color Palette

### Primary Colors
- **Black**: #000000 - Primary background for dark sections
- **White**: #FFFFFF - Primary text on dark backgrounds
- **Emerald**: 
  - Emerald-500: #10b981 - Primary accent color
  - Emerald-600: #059669 - Buttons, active states
  - Emerald-400: #34d399 - Secondary accent, highlights
  - Emerald-300: #6ee7b7 - Tertiary accent, subtle highlights

### Neutral Colors
- **Gray Scale**:
  - Gray-50: #f9fafb - Background for light sections
  - Gray-100: #f3f4f6 - Secondary background
  - Gray-200: #e5e7eb - Borders, dividers
  - Gray-300: #d1d5db - Disabled states
  - Gray-400: #9ca3af - Secondary text
  - Gray-500: #6b7280 - Placeholder text
  - Gray-600: #4b5563 - Tertiary text
  - Gray-700: #374151 - Secondary text on dark backgrounds
  - Gray-800: #1f2937 - Primary text on light backgrounds
  - Gray-900: #111827 - Headings on light backgrounds

### Functional Colors
- **Success**: Emerald-500 (#10b981)
- **Error**: Red-500 (#ef4444)
- **Warning**: Amber-500 (#f59e0b)
- **Info**: Blue-500 (#3b82f6)

### Opacity Variants
Common opacity values used throughout the system:
- 5%: /5
- 10%: /10
- 20%: /20
- 30%: /30
- 40%: /40
- 50%: /50
- 60%: /60
- 70%: /70
- 80%: /80
- 90%: /90

## Typography

### Font Families
- **Primary**: Inter - Used for all UI text
- **Mono**: JetBrains Mono - Used for code, numbers, and technical information

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Bold**: 700

### Font Sizes
- **xs**: 0.75rem (12px)
- **sm**: 0.875rem (14px)
- **base**: 1rem (16px)
- **lg**: 1.125rem (18px)
- **xl**: 1.25rem (20px)
- **2xl**: 1.5rem (24px)
- **3xl**: 1.875rem (30px)
- **4xl**: 2.25rem (36px)
- **5xl**: 3rem (48px)
- **6xl**: 3.75rem (60px)
- **7xl**: 4.5rem (72px)

### Line Heights
- **tight**: 1.25
- **normal**: 1.5
- **relaxed**: 1.75

### Text Styles
- **Headings**: font-medium tracking-tighter
- **Body**: font-normal
- **Buttons**: font-medium
- **Badges**: font-medium
- **Labels**: font-medium
- **Captions**: font-medium text-xs

## Spacing

### Margin and Padding
- **0**: 0
- **0.5**: 0.125rem (2px)
- **1**: 0.25rem (4px)
- **1.5**: 0.375rem (6px)
- **2**: 0.5rem (8px)
- **2.5**: 0.625rem (10px)
- **3**: 0.75rem (12px)
- **3.5**: 0.875rem (14px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)
- **32**: 8rem (128px)

### Gap
- **0**: 0
- **1**: 0.25rem (4px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)

## Border Radius
- **none**: 0
- **sm**: 0.125rem (2px)
- **DEFAULT**: 0.25rem (4px)
- **md**: 0.375rem (6px)
- **lg**: 0.5rem (8px)
- **xl**: 0.75rem (12px)
- **2xl**: 1rem (16px)
- **full**: 9999px

## Shadows
- **sm**: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
- **DEFAULT**: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)
- **md**: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)
- **lg**: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)
- **xl**: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
- **2xl**: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
- **inner**: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)
- **glow**: 0 0 15px 5px rgba(6, 95, 70, 0.2)
- **glow-sm**: 0 0 10px 2px rgba(6, 95, 70, 0.15)

## Components

### Navigation
- **Desktop**: Fixed top navigation with transparent background
- **Mobile**: Hamburger menu with expandable panel
- **Height**: h-16
- **Border Radius**: rounded-xl
- **Background**: bg-white/85 backdrop-blur-md

### Hero
- **Height**: min-h-[100vh]
- **Background**: bg-gradient-to-b from-emerald-950/40 to-black/80
- **Text Color**: text-white
- **Heading Size**: text-4xl md:text-5xl lg:text-6xl

### Cards
- **Border Radius**: rounded-xl
- **Border**: border border-white/10 (dark) or border border-gray-200 (light)
- **Background**: bg-black/40 backdrop-blur-md (dark) or bg-white (light)
- **Padding**: p-4 md:p-6
- **Shadow**: shadow-sm

### Buttons
- **Primary**: bg-black text-white hover:bg-gray-800
- **Secondary**: bg-white/10 backdrop-blur-md border border-white/20 text-white
- **Border Radius**: rounded-xl (default), rounded-full (alternative)
- **Padding**: px-4 py-2 (default), px-6 py-3 (large)
- **Font**: font-medium

### Badges
- **Border Radius**: rounded-xl
- **Padding**: px-2.5 py-0.5
- **Font Size**: text-[10px]
- **Font Weight**: font-medium
- **Border**: border border-white/20 (dark) or border border-gray-200 (light)

### Forms
- **Input Height**: h-10
- **Border Radius**: rounded-lg
- **Border**: border border-gray-300
- **Focus**: ring-2 ring-emerald-500
- **Padding**: px-3 py-2

### Modals
- **Background**: bg-black/40 backdrop-blur-md (dark) or bg-white (light)
- **Border Radius**: rounded-xl
- **Border**: border border-white/10 (dark) or border border-gray-200 (light)
- **Shadow**: shadow-xl
- **Padding**: p-6

### Tabs
- **Active**: bg-white/10 text-white (dark) or bg-gray-100 text-gray-900 (light)
- **Inactive**: text-white/60 (dark) or text-gray-500 (light)
- **Border Radius**: rounded-xl
- **Padding**: px-4 py-2

## Animation

### Transitions
- **Default**: transition-all duration-300
- **Fast**: transition-all duration-150
- **Slow**: transition-all duration-500

### Hover Effects
- **Scale**: hover:scale-105
- **Y-Axis Movement**: hover:y-2
- **Opacity**: hover:opacity-80

### Page Transitions
- **Enter**: initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
- **Exit**: exit={{ opacity: 0, y: -20 }}

## Dark Mode

### Text Colors
- **Primary**: text-white
- **Secondary**: text-white/70
- **Tertiary**: text-white/50

### Background Colors
- **Primary**: bg-black
- **Secondary**: bg-black/60
- **Tertiary**: bg-black/40

### Borders
- **Primary**: border-white/10
- **Secondary**: border-white/5

## Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Grid System

- **Container**: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- **Columns**: grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
- **Gap**: gap-4 md:gap-6 lg:gap-8

## Accessibility

- **Focus States**: ring-2 ring-offset-2 ring-emerald-500
- **Color Contrast**: All text meets WCAG AA standards
- **Reduced Motion**: respects prefers-reduced-motion
- **Screen Reader Text**: sr-only class for visually hidden text
\`\`\`

Let's organize the public directory:
