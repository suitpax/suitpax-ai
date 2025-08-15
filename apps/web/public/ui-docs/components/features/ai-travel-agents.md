# AI Travel Agents Component

The AI Travel Agents component showcases the AI-powered travel agents that power the Suitpax platform.

## Design Specifications

### Layout
- **Background**: Light gray (bg-gray-50)
- **Padding**: pt-12 pb-6
- **Container**: container mx-auto px-4 md:px-6
- **Structure**: Centered content with AI chat interface and agent grid

### Typography
- **Heading**: text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter
- **Subheading**: text-xs font-medium text-gray-500
- **Agent Names**: text-[10px] font-medium
- **Agent Roles**: text-[8px] text-gray-500

### Colors
- **Background**: bg-gray-50
- **Badges**: bg-gray-200 text-gray-700
- **Active Agent**: border-emerald-950/30, text-emerald-950
- **Inactive Agent**: border-gray-200, text-gray-700

### Agent Grid
- **Layout**: grid grid-cols-5 gap-3 md:gap-4
- **Agent Container**: w-14 h-14 rounded-xl border-2
- **Active Highlight**: bg-emerald-950/10
- **Flow Effect**: Animated background elements

### AI Chat Interface
- **Container**: max-w-2xl w-full mx-auto mb-12
- **Input Field**: rounded-xl border border-gray-400
- **User Image**: w-10 h-10 rounded-full border border-gray-300

### Responsive Behavior
- **Desktop**: Full agent grid with flow effects
- **Mobile**: Simplified layout with stacked elements

## Animation
- **Agent Selection**: Scale effect on hover and selection
- **Flow Effect**: Multiple animated background elements
- **Chat Typing**: Animated typing effect in the chat interface

## Usage

\`\`\`jsx
import { AITravelAgents } from "@/components/features/ai-travel-agents";

export default function TravelAgentsSection() {
  return <AITravelAgents />;
}
\`\`\`

## Accessibility
- All images have appropriate alt text
- Interactive elements have appropriate focus states
- Animation can be reduced based on user preferences
