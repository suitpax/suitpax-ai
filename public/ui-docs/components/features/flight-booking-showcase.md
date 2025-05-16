# Flight Booking Showcase Component

The Flight Booking Showcase component demonstrates the flight booking capabilities of the Suitpax platform with an interactive card interface.

## Design Specifications

### Layout
- **Background**: Black gradient with pattern (bg-gradient-to-b from-black via-black/95 to-emerald-950/40)
- **Padding**: pt-24 pb-12
- **Container**: container mx-auto px-4 md:px-6
- **Structure**: Centered content with interactive booking card

### Typography
- **Heading**: text-3xl md:text-4xl lg:text-5xl font-medium tracking-tighter text-white
- **Subheading**: text-sm font-medium text-white/70
- **Card Title**: text-2xl font-bold text-white
- **Card Details**: text-[10px] text-white/60
- **Airport Codes**: text-2xl font-bold text-white
- **City Names**: text-[10px] text-white/60

### Colors
- **Background**: Black gradient to emerald
- **Text**: text-white, text-white/70, text-white/60
- **Card**: bg-black/40 backdrop-blur-md border border-white/10
- **Header**: bg-black/80
- **Status Badge**: bg-emerald-500/20 border border-emerald-500/30 text-emerald-400

### Flight Card
- **Container**: bg-black/40 backdrop-blur-md p-5 rounded-xl border border-white/10
- **Header**: bg-black/80 p-3 flex justify-between items-center border-b border-white/10
- **Flight Route**: flex items-center justify-between mb-5
- **Time Details**: flex justify-between text-xs mb-5
- **Passenger Info**: flex justify-between items-center text-xs border-t border-white/10 pt-4 mb-4
- **Amenities**: flex flex-wrap gap-2

### Airline Partners
- **Logo Container**: h-6 relative
- **Logo Style**: h-4 w-auto object-contain invert brightness-0 filter opacity-70 hover:opacity-100

### Responsive Behavior
- **Desktop**: Larger card with more details
- **Mobile**: Simplified card with essential information
- **Spacing**: Adjusted for different screen sizes

## Animation
- **Card Transition**: AnimatePresence for smooth transitions between bookings
- **Progress Bar**: Animated progress bar for flight duration
- **Amenities Toggle**: Smooth transition between passenger info and amenities

## Usage

\`\`\`jsx
import { FlightBookingShowcase } from "@/components/features/flight-booking-showcase";

export default function BookingSection() {
  return <FlightBookingShowcase />;
}
\`\`\`

## Accessibility
- All interactive elements have appropriate focus states
- Animation respects reduced motion preferences
- Time and date information is clearly presented
