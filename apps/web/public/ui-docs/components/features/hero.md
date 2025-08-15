# Hero Component

The Hero component serves as the main landing section for the Suitpax application, providing a visually striking introduction to the platform.

## Design Specifications

### Layout
- **Background**: Gradient from emerald to black (bg-gradient-to-b from-emerald-950/40 to-black/80)
- **Minimum Height**: min-h-[100vh] md:min-h-[90vh] lg:min-h-[100vh]
- **Padding**: py-20 md:py-32 lg:py-40 pt-24
- **Container**: container px-4 md:px-6 mx-auto
- **Structure**: Centered content with badge, heading, animated city text, and CTA buttons

### Typography
- **Heading**: text-3xl font-medium tracking-tighter text-white sm:text-5xl md:text-6xl xl:text-7xl/none leading-tight
- **Subheading**: text-white/80 md:text-xl lg:text-2xl leading-relaxed
- **Badge Text**: text-[10px] font-medium

### Colors
- **Background**: Gradient from emerald-950/40 to black/80
- **Text**: text-white, text-white/80
- **Badges**: bg-white/10 backdrop-blur-sm border-white/20
- **Primary Button**: bg-white text-black hover:bg-white/90
- **Secondary Button**: bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20

### City Animation
- **Container**: bg-black/30 backdrop-blur-sm p-6 rounded-xl border border-white/10
- **Animation**: Smooth transitions between city names

### Call-to-Action
- **Button Size**: px-8 py-3 md:px-10 md:py-4
- **Button Width**: min-w-[180px] md:min-w-[220px]
- **Button Text**: text-base md:text-lg
- **Button Radius**: rounded-xl

### Responsive Behavior
- **Desktop**: Larger text, more spacing
- **Mobile**: Stacked buttons, smaller text
- **Breakpoints**: sm, md, lg, xl

## Animation
- **Title**: Fade-in animation
- **Subtitle**: Fade-in animation with delay
- **City Text**: Animated transitions between different city names
- **Buttons**: Subtle hover effects

## Usage

\`\`\`jsx
import { Hero } from "@/components/features/hero";

export default function LandingPage() {
  return <Hero />;
}
\`\`\`

## Accessibility
- All animations respect reduced motion preferences
- Buttons have appropriate focus states
- Text contrast meets WCAG AA standards
