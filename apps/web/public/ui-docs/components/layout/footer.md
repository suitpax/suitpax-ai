# Footer Component

The Footer component serves as the main footer for the Suitpax application, providing important links, company information, and social media connections.

## Design Specifications

### Layout
- **Background**: Black with subtle radial gradient pattern
- **Structure**: Three-column grid on desktop, single column on mobile
- **Padding**: pt-12 pb-8 (top: 3rem, bottom: 2rem)
- **Maximum Width**: max-w-7xl mx-auto

### Typography
- **Headings**: text-white font-medium text-sm
- **Body Text**: text-gray-400 text-xs/text-sm
- **Copyright**: text-gray-500 text-xs font-medium tracking-tighter

### Colors
- **Background**: bg-black
- **Text**: text-white, text-gray-400, text-gray-500
- **Borders**: border-gray-800, border-gray-600/30
- **Hover States**: hover:text-gray-200, hover:border-gray-500/30

### Badges & Certifications
- **Badge Container**: rounded-lg border border-gray-600/30
- **Badge Indicator**: w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse
- **Badge Text**: text-xs text-gray-400

### Social Icons
- **Size**: h-5 w-5
- **Color**: text-gray-400
- **Hover**: hover:text-gray-200

### Responsive Behavior
- **Desktop**: Three-column grid (md:grid-cols-3)
- **Mobile**: Single column (grid-cols-1)
- **Animation**: Mobile-only hover animations for certification badges

## Usage

\`\`\`jsx
import { Footer } from "@/components/layout/footer";

export default function Layout() {
  return (
    <div>
      {/* Page content */}
      <Footer />
    </div>
  );
}
\`\`\`

## Accessibility
- All social media links include screen reader text (sr-only)
- External links open in new tabs with appropriate attributes
- Color contrast meets WCAG AA standards

## Animation
- On mobile devices, certification badges have hover animations
- Desktop version has static badges to reduce motion
