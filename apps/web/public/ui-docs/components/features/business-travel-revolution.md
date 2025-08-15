# Business Travel Revolution Component

The Business Travel Revolution component showcases the transformative impact of Suitpax on the business travel industry with an interactive grid of AI agents.

## Design Specifications

### Layout
- **Background**: Light gray (bg-gray-50)
- **Padding**: py-20
- **Container**: container mx-auto px-4 md:px-6
- **Structure**: Centered content with agent grid and call-to-action

### Typography
- **Heading**: text-4xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black
- **Subheading**: text-sm font-medium text-gray-600
- **Launch Badge**: text-lg font-semibold tracking-tighter
- **Button Text**: text-sm font-medium tracking-tighter

### Colors
- **Background**: bg-gray-50
- **Badges**: bg-black/10 text-black
- **Launch Badge**: bg-black text-white
- **Agent Highlight**: rgba(6, 95, 70, 0.3) with glow
- **Button**: bg-white text-black hover:bg-white/90

### Agent Grid
- **Layout**: grid grid-cols-10 gap-1.5 md:gap-2
- **Agent Container**: aspect-square relative
- **Agent Image**: rounded-lg overflow-hidden bg-gray-200
- **Selected Effect**: Glowing emerald highlight with animation

### Responsive Behavior
- **Desktop**: Full 10-column grid
- **Mobile**: Adjusted grid with smaller images
- **Spacing**: gap-1.5 md:gap-2

## Animation
- **Agent Selection**: Glowing effect on selected agents
- **Launch Badge**: Scale animation on hover
- **Button**: Y-axis movement on hover and tap

## Usage

\`\`\`jsx
import { BusinessTravelRevolution } from "@/components/features/business-travel-revolution";

export default function RevolutionSection() {
  return <BusinessTravelRevolution />;
}
\`\`\`

## Accessibility
- All interactive elements have appropriate focus states
- Images have appropriate alt text
- Animation respects reduced motion preferences
