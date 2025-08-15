# Task Management Component

The Task Management component showcases the task and project management capabilities of the Suitpax platform.

## Design Specifications

### Layout
- **Background**: Light gray (bg-gray-50)
- **Padding**: py-16
- **Container**: container mx-auto px-4 md:px-6
- **Structure**: Centered content with workspace UI demonstration

### Typography
- **Heading**: text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-black
- **Subheading**: text-xs font-medium text-gray-500
- **Tab Labels**: text-sm font-medium
- **Feature Titles**: font-medium text-black
- **Feature Descriptions**: text-sm text-gray-500

### Colors
- **Background**: bg-gray-50
- **Workspace UI**: bg-white/50 backdrop-blur-sm border border-gray-200
- **Active Tab**: text-emerald-950 border-b-2 border-emerald-950
- **Inactive Tab**: text-gray-500 hover:text-gray-700
- **Feature Icons**: bg-gray-200 text-black

### Workspace UI
- **Container**: bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-200 shadow-sm
- **Tabs**: flex border-b border-gray-200 mb-4
- **Tab Panels**: AnimatePresence for smooth transitions
- **Flow Effect**: Multiple animated background elements

### Features Grid
- **Layout**: grid md:grid-cols-2 gap-8
- **Feature Cards**: flex gap-3
- **Icon Container**: w-6 h-6 rounded-lg bg-gray-200 flex items-center justify-center
- **List Style**: space-y-4 text-left

### Responsive Behavior
- **Desktop**: Two-column features grid
- **Mobile**: Single column layout
- **Spacing**: Adjusted for different screen sizes

## Animation
- **Tab Switching**: Smooth transitions between tabs
- **Flow Effect**: Animated background elements
- **Feature Hover**: Subtle hover effects on feature items

## Usage

\`\`\`jsx
import { TaskManagement } from "@/components/features/task-management";

export default function WorkspaceSection() {
  return <TaskManagement />;
}
\`\`\`

## Accessibility
- Tabs follow ARIA tab pattern best practices
- All interactive elements have appropriate focus states
- Animation respects reduced motion preferences
