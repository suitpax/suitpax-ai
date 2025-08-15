# AI Chat Component

The AI Chat component provides a visual demonstration of the AI chat capabilities of the Suitpax platform.

## Design Specifications

### Layout
- **Width**: w-full
- **Structure**: Badges section, chat input, and "Powered by" text

### Typography
- **Badge Text**: text-[10px] font-medium
- **List Items**: text-xs
- **Chat Input**: text-sm text-gray-500
- **Powered By**: text-[10px] text-gray-400

### Colors
- **Badges**: rounded-lg border border-black/30 px-2 py-0.5 text-[10px] font-medium text-black
- **Chat Input**: border border-gray-400 shadow-sm
- **User Image Border**: border border-gray-300
- **Send Button**: text-gray-400

### Chat Input
- **Container**: relative flex items-center gap-2 p-1 rounded-xl border border-gray-400 shadow-sm
- **User Image**: w-10 h-10 overflow-hidden rounded-full border border-gray-300
- **Input Area**: flex-1 py-2 px-2 text-sm text-gray-500 h-10 flex items-center
- **Cursor Animation**: motion.span animate={{ opacity: [1, 0] }}

### Responsive Behavior
- **Width**: w-full
- **Badges**: flex flex-wrap justify-center gap-3 mb-8

## Animation
- **Component Entrance**: motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
- **Typing Effect**: Animated typing with cursor blink
- **User Image Transition**: AnimatePresence for smooth transitions

## Usage

\`\`\`jsx
import { AIChat } from "@/components/ui/ai-chat";

export default function ChatSection() {
  return <AIChat />;
}
\`\`\`

## Accessibility
- Typing animation respects reduced motion preferences
- Input area has appropriate visual cues
- User images have appropriate alt text
\`\`\`

Let's create a comprehensive UI system documentation:
