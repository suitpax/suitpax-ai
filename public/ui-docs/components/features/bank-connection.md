# Bank Connection Component

The Bank Connection component showcases the financial integration capabilities of the Suitpax platform, allowing users to connect their bank accounts.

## Design Specifications

### Layout
- **Background**: Black with subtle pattern (bg-black)
- **Padding**: py-24
- **Container**: container mx-auto px-4 md:px-6
- **Structure**: Two-column grid on desktop, single column on mobile

### Typography
- **Heading**: text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white
- **Subheading**: text-sm font-medium text-white/70
- **Bank Name**: text-white font-medium
- **Bank Description**: text-xs text-white/70
- **Quote**: text-sm text-white/80
- **Author**: text-xs text-white/60

### Colors
- **Background**: bg-black
- **Text**: text-white, text-white/70, text-white/60
- **Cards**: bg-black/60 backdrop-blur-md border border-white/10
- **Buttons**: bg-white/10 hover:bg-white/20 border border-white/20
- **Active State**: text-emerald-400

### Bank Selection
- **Bank Card**: bg-black/60 backdrop-blur-md p-6 rounded-xl border border-white/10
- **Bank Logo**: h-12 w-24 bg-white/5 rounded-lg p-2
- **Features List**: space-y-2 text-left mb-6
- **Connect Button**: w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl

### Benefits Showcase
- **Benefit Cards**: bg-gradient-to-r from-black to-black/80 rounded-xl p-3 border border-white/10
- **Icon Container**: w-6 h-6 rounded-full bg-emerald-500/20
- **Stats Grid**: grid grid-cols-2 gap-2

### Responsive Behavior
- **Desktop**: Two-column grid (md:grid-cols-2)
- **Mobile**: Single column (grid-cols-1)
- **Spacing**: gap-8

## Animation
- **Bank Transition**: Smooth fade transition between banks
- **Connection Progress**: Animated progress bar during connection
- **Modal**: Animated entrance and exit

## Usage

\`\`\`jsx
import { BankConnection } from "@/components/features/bank-connection";

export default function FinancialSection() {
  return <BankConnection />;
}
\`\`\`

## Accessibility
- All interactive elements have appropriate focus states
- Progress indicators have appropriate ARIA attributes
- Modal is keyboard navigable and follows accessibility best practices
