# Design Guidelines: EcoRed Comunal / EcoTrama

## Design Approach

**Reference-Based Strategy:** Drawing inspiration from Stripe's clarity, Airbnb's community-focused design, and modern environmental organization websites. This creates trust, engagement, and showcases innovation in sustainability.

**Design Principles:**
- Clean, modern aesthetic that reflects environmental consciousness
- Approachable yet professional to engage diverse community members
- Visual hierarchy that guides users through the program's story
- Interactive elements that demonstrate technological innovation

---

## Typography

**Font Families:**
- Primary: Inter or DM Sans (headings, UI elements)
- Secondary: System font stack for body text (optimal readability)

**Hierarchy:**
- Hero Heading: text-5xl md:text-6xl lg:text-7xl, font-bold
- Section Headings: text-3xl md:text-4xl, font-bold
- Subsection Headings: text-xl md:text-2xl, font-semibold
- Body Text: text-base md:text-lg, leading-relaxed
- Small Text: text-sm, for metadata and references

---

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Section padding: py-16 md:py-24
- Container max-width: max-w-7xl
- Component spacing: space-y-8 or space-y-12
- Grid gaps: gap-6 md:gap-8

**Grid Structure:**
- Hero: Full-width with centered content (max-w-4xl)
- Features: 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- App showcase: 2-column split (grid-cols-1 lg:grid-cols-2)
- Statistics: 4-column grid (grid-cols-2 lg:grid-cols-4)

---

## Core Sections & Components

### 1. Hero Section
- Height: min-h-[85vh], not forced 100vh
- Large hero image: Environmental/community theme (hands holding plant, community recycling together, vibrant greenery)
- Content overlay with blurred background button (px-8 py-3, backdrop-blur-md)
- Tagline + description + primary CTA
- Include trust indicator: "Conectando X+ hogares en Colombia"

### 2. Navigation
- Sticky header with backdrop-blur
- Logo left, menu items center/right
- Smooth scroll to sections
- Mobile: Hamburger menu with slide-in drawer

### 3. Program Overview Section
- Grid layout with icon cards (3 columns)
- Each card: Icon (Heroicons), heading, description
- Icons: recycling symbol, users/community, chart/growth, leaf/eco, book/education
- Subtle hover lift effect (translate-y-1)

### 4. EcoTrama App Showcase
- Two-column layout: Left (mockup/visual), Right (features list)
- Features as checklist items with icons
- Include app screenshot mockup placeholder or phone frame illustration
- Highlight key features with subtle accent backgrounds

### 5. Impact Statistics
- 4-column grid of stat cards
- Large animated numbers (text-4xl, font-bold)
- Labels below numbers
- Metrics: "Hogares Conectados", "Kg Reciclados", "Toneladas CO₂ Reducidas", "Empleos Verdes"
- Each card with subtle border and padding (p-8, rounded-lg)

### 6. Contact Section
- Two-column: Left (form), Right (info + map placeholder)
- Form fields: Name, Email, Message
- Input styling: px-4 py-3, rounded-lg, border
- Submit button: Full eco-style CTA
- Right side: Contact details, office hours placeholder, location info

### 7. References Section
- Clean list format with proper citation styling
- Each reference in a subtle card (p-4, rounded, subtle border)
- Links styled distinctly

### 8. Footer
- Multi-column layout (4 columns on desktop)
- Columns: About, Quick Links, Contact, Newsletter signup
- Social media icons (LinkedIn, Twitter, Instagram placeholders)
- Copyright and additional links at bottom
- Background: Subtle gradient

---

## Component Specifications

**Cards:**
- Padding: p-6 md:p-8
- Border radius: rounded-xl
- Shadow: shadow-sm with hover:shadow-md transition
- Border: subtle border (border-green-100)

**Buttons:**
- Primary CTA: px-6 py-3, rounded-lg, font-semibold
- Secondary: Similar sizing with outline variant
- Icon buttons: p-2, rounded-full

**Icons:**
- Use Heroicons exclusively
- Size: w-6 h-6 for inline, w-12 h-12 for feature cards
- Stroke width: 2

**Forms:**
- Input height: h-12
- Border radius: rounded-lg
- Focus states: ring-2 offset-2
- Labels: font-medium, mb-2

---

## Images

**Hero Image:**
- Full-width background image
- Subject: Community members sorting recyclables together, or hands holding seedling with blurred nature background
- Overlay: Dark gradient (from-black/60 to-black/30) for text readability

**App Mockup:**
- Phone mockup showing EcoTrama app interface
- Placement: App showcase section, left column
- Style: Modern phone frame with screenshot inside

**Section Accents:**
- Impact section: Subtle background pattern or illustration of leaves/recycling symbols
- Decorative eco-themed illustrations between major sections

---

## Animations

Use sparingly for impact:
- Stat counters: Count-up animation on scroll into view
- Cards: Subtle hover lift (transition-transform duration-200)
- Hero: Gentle fade-in on load
- Smooth scroll between sections

---

## Accessibility

- Semantic HTML5 elements throughout
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus visible states on all interactive elements
- Sufficient contrast ratios (WCAG AA minimum)
- Form labels properly associated with inputs