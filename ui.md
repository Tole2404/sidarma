# UI Instructions

Build a modern, clean, responsive, production-quality UI using:

- shadcn/ui
- TailwindCSS
- Lucide Icons

Always use actual shadcn/ui components instead of recreating them manually.

Use:

- "@/components/ui/\*"

Prefer existing shadcn components:

- Button
- Card
- Input
- Dialog
- Sheet
- Table
- Tabs
- DropdownMenu
- Select
- Badge
- Skeleton
- Tooltip
- ScrollArea

Follow shadcn/ui composition patterns and styling conventions.

Prefer:

- variant props
- size props
- reusable component composition

Avoid:

- rebuilding existing shadcn components
- raw Tailwind-only replacements
- unnecessary wrapper divs

---

## Design Style

UI should feel:

- minimalist
- modern
- professional
- spacious
- human-designed
- startup/SaaS quality
- production-ready

Avoid AI-generated aesthetics such as:

- excessive gradients
- too much glassmorphism
- oversized rounded corners
- random bright colors
- excessive animations
- visually noisy layouts
- giant hero sections
- repetitive cards

Prefer:

- neutral palettes (zinc, slate, neutral)
- soft shadows
- subtle borders
- balanced whitespace
- readable typography
- compact layouts
- strong visual hierarchy

---

## Responsive Rules

Always design mobile-first.

UI must be fully responsive for:

- mobile
- tablet
- laptop
- desktop

Requirements:

- Prevent horizontal overflow
- Avoid fixed widths
- Keep layouts flexible
- Keep buttons/forms mobile-friendly
- Collapse navigation/sidebar on mobile
- Use Sheet/Drawer for mobile navigation

Use responsive Tailwind utilities:

- sm:
- md:
- lg:
- xl:
- 2xl:

Prefer responsive layouts such as:

- flex-col md:flex-row
- grid-cols-1 md:grid-cols-2 lg:grid-cols-4

Tables must remain usable on mobile.

---

## Component Rules

- Keep components modular and reusable
- Avoid huge monolithic files
- Reuse shared patterns
- Keep Tailwind classes readable
- Prefer concise maintainable code
- Use proper spacing and alignment
- Prioritize usability over decoration

---

## Dashboard Rules

Dashboards should:

- feel compact and readable
- avoid oversized widgets
- use muted colors
- maintain strong visual hierarchy
- resemble modern SaaS/admin dashboards

---

## Animation Rules

- Use minimal and subtle animations only when useful
- Avoid distracting motion
- Prefer simple transitions

---

## Code Rules

- Reuse existing project patterns
- Avoid unnecessary dependencies
- Keep implementations simple and scalable
- Prefer maintainable architecture
- Avoid unnecessary refactors

---

## Final Goal

The final UI should resemble:

- modern SaaS applications
- premium admin dashboards
- polished internal tools

The UI must feel:

- realistic
- intentional
- responsive
- professionally designed
- not obviously AI-generated
