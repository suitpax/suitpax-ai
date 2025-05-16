# Business Workflow Visualization Component

The Business Workflow Visualization component displays business processes and negotiation stages in a visual format.

## Design Specifications

### Layout
- **Background**: bg-black/40 backdrop-blur-md
- **Border**: border border-white/10
- **Border Radius**: rounded-xl
- **Padding**: p-3 md:p-4
- **Structure**: Header with company info, followed by workflow steps

### Typography
- **Company Name**: text-lg font-medium text-white
- **Location**: text-xs text-white/60
- **Workflow Badge**: text-[10px] font-medium text-white tracking-wide
- **Step Title**: text-sm text-white font-medium
- **Step Description**: text-xs text-white/70
- **Status Badge**: text-[8px] font-medium text-white/80

### Colors
- **Background**: bg-black/40 backdrop-blur-md
- **Company Logo**: bg-black/60 border border-white/10
- **Workflow Badge**: bg-white/10 border border-white/20
- **Step Container**: bg-black/60 rounded-xl border border-white/15
- **Active Step**: ring-1 ring-emerald-500/30
- **Step Icon**: bg-gradient-to-br from-emerald-900/60 to-black/60 border border-emerald-500/20
- **Icon Color**: text-emerald-300
- **Status Badge**: bg-white/10 border border-white/20
- **Active Indicator**: bg-emerald-500 animate-pulse

### Workflow Steps
- **Layout**: grid grid-cols-1 sm:grid-cols-2 gap-3
- **Step Container**: bg-black/60 rounded-xl border border-white/15 p-3
- **Icon Container**: w-7 h-7 rounded-xl
- **Status Badge**: rounded-xl bg-white/10 px-2 py-0.5
- **Update Section**: mt-2 pt-2 border-t border-white/10

### Responsive Behavior
- **Desktop**: Two-column grid for steps
- **Mobile**: Single column layout
- **Padding**: p-3 md:p-4

## Usage

\`\`\`jsx
import { BusinessWorkflowVisualization } from "@/components/features/business-workflow-visualization";

export default function WorkflowSection() {
  const workflow = {
    name: "Company Name",
    logo: <CompanyLogo />,
    domain: "company.com",
    location: "City, Country",
    steps: [
      {
        title: "Step Title",
        icon: <StepIcon />,
        description: "Step description"
      },
      // More steps...
    ]
  };

  return <BusinessWorkflowVisualization workflow={workflow} />;
}
\`\`\`

## Accessibility
- All icons have appropriate ARIA labels
- Status indicators use both color and text
- Interactive elements have appropriate focus states
