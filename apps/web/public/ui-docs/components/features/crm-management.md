# CRM Management Component

The CRM Management component showcases the customer relationship management capabilities of the Suitpax platform with an interactive demo interface.

## Design Specifications

### Layout
- **Background**: Gradient from emerald to black (bg-gradient-to-b from-emerald-950/40 to-black/80)
- **Padding**: py-16
- **Container**: container mx-auto px-4 md:px-6
- **Structure**: Centered content with CRM demo UI and workflow visualization

### Typography
- **Heading**: text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-white
- **Subheading**: text-sm font-medium text-white/80
- **Tab Labels**: text-sm font-medium
- **Card Titles**: font-medium text-white
- **Card Details**: text-xs text-white/60

### Colors
- **Background**: Gradient from emerald-950/40 to black/80
- **CRM UI**: bg-black/40 backdrop-blur-md border border-white/10
- **Tabs**: bg-black/60 border-b border-white/10
- **Active Tab**: bg-white/10 text-white
- **Inactive Tab**: text-white/60 hover:text-white hover:bg-white/5
- **Stats Cards**: border border-white/20 rounded-xl

### CRM Demo UI
- **Container**: bg-black/40 backdrop-blur-md rounded-xl shadow-lg border border-white/10
- **Tabs**: flex overflow-x-auto bg-black/60 border-b border-white/10 p-1
- **Content Panels**: AnimatePresence for smooth transitions
- **Stats Grid**: grid grid-cols-2 md:grid-cols-4 gap-4

### Workflow Visualization
- **Container**: bg-black/40 backdrop-blur-md rounded-xl border border-white/10 p-3 md:p-4
- **Company Selection**: flex flex-wrap justify-center gap-2 mb-6
- **Workflow Steps**: grid grid-cols-1 sm:grid-cols-2 gap-3

### Features Grid
- **Layout**: grid md:grid-cols-3 gap-8
- **Feature Cards**: bg-black/40 backdrop-blur-md p-4 rounded-xl shadow-sm border border-white/10
- **Icon Container**: w-8 h-8 rounded-lg bg-transparent border border-white/20

### Responsive Behavior
- **Desktop**: Three-column features grid, four-column stats
- **Mobile**: Single/two-column layouts
- **Spacing**: Adjusted for different screen sizes

## Animation
- **Tab Switching**: Smooth transitions between tabs
- **Card Hover**: Y-axis movement and scale effect
- **Workflow Selection**: Scale animation on active workflow

## Usage

\`\`\`jsx
import { CrmManagement } from "@/components/features/crm-management";

export default function CrmSection() {
  return <CrmManagement />;
}
\`\`\`

## Accessibility
- Tabs follow ARIA tab pattern best practices
- All interactive elements have appropriate focus states
- Animation respects reduced motion preferences
