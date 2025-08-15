# Navigation Component

The Navigation component serves as the main navigation bar for the Suitpax application, providing access to key pages and features.

## Design Specifications

### Layout
- **Position**: Fixed at the top of the page (fixed top-0 left-0)
- **Background**: Semi-transparent white with blur effect (bg-white/85 backdrop-blur-md)
- **Border**: Light border that becomes more prominent on scroll (border border-black/5)
- **Border Radius**: rounded-xl
- **Shadow**: Appears on scroll (shadow-lg)
- **Padding**: px-4 py-2 (horizontal: 1rem, vertical: 0.5rem)

### Typography
- **Navigation Links**: text-base text-black font-medium tracking-tighter
- **Mobile Menu Links**: text-lg font-medium tracking-tighter
- **Button Text**: text-xs font-medium tracking-tighter

### Colors
- **Background**: bg-white/85 (semi-transparent white)
- **Text**: text-black for links, text-white for button
- **Button**: bg-black text-white
- **Hover States**: hover:bg-black/5 for links, hover:bg-gray-500 for button
- **Mobile Menu Button**: bg-gray-100 border-black/10

### Interactive Elements
- **Desktop Links**: Horizontal layout with hover effect
- **Mobile Menu Button**: Toggles mobile navigation
- **Pre-register Button**: Rounded button with arrow icon
- **Social Icons**: Displayed in mobile menu only

### Responsive Behavior
- **Desktop**: Full navigation with centered links
- **Mobile**: Hamburger menu that expands to full navigation panel
- **Breakpoint**: md (768px)

## States
- **Default**: Semi-transparent background
- **Scrolled**: Added shadow and darker border
- **Mobile Menu Open**: Solid white background

## Usage

\`\`\`jsx
import { Navigation } from "@/components/layout/navigation";

export default function Layout() {
  return (
    <>
      <Navigation />
      {/* Page content */}
    </>
  );
}
\`\`\`

## Accessibility
- Mobile menu button includes aria-expanded attribute
- All interactive elements have appropriate focus states
- Social media links include screen reader text (sr-only)
