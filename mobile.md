# Mobile UI Instructions

Prioritize mobile experience first.

The mobile UI must feel like a real modern production app, not an AI-generated layout.

---

## Mobile Layout Rules

Avoid:

- long vertical stacked cards
- oversized spacing
- giant sections
- repetitive full-width cards
- excessive empty space

Prefer:

- compact layouts
- horizontal card sections
- responsive grid layouts
- balanced spacing
- natural mobile scrolling

Cards should not always stack vertically.

Use responsive horizontal layouts such as:

- horizontal scroll cards
- 2-column mobile grids when possible
- compact statistics cards
- swipeable sections only when appropriate

Examples:

- grid-cols-2
- flex-row overflow-x-auto
- snap-x snap-mandatory

The UI should resemble:

- modern fintech apps
- modern dashboard mobile apps
- SaaS mobile admin panels

---

## Mobile Card Rules

Cards must:

- stay compact
- avoid excessive height
- display important information only
- maintain consistent spacing
- fit naturally on small screens

Avoid giant cards with too much padding.

Prefer:

- small stat cards
- compact transaction cards
- grouped information
- icon + value layouts

---

## Responsive Table Rules

Tables must be properly responsive without breaking layout.

Avoid:

- horizontal page overflow
- giant tables wider than screen
- forcing users to slide the whole page

Prefer:

- compact columns
- hidden less-important columns on mobile
- wrapped text
- truncated text when necessary
- responsive table containers

Use:

- text-sm
- whitespace-nowrap selectively
- truncate
- max-w
- hidden md:table-cell

Important:
The page itself must never horizontally slide.

Only the table container may scroll horizontally if absolutely necessary.

---

## Mobile Navigation Rules

Use:

- bottom navigation
- compact topbar
- Sheet/Drawer for menus
- sticky navigation when useful

Avoid:

- oversized sidebars on mobile
- cluttered menus

---

## Mobile Spacing Rules

Use tighter spacing on mobile:

- smaller padding
- smaller gaps
- compact sections

Avoid excessive whitespace.

---

## Mobile Typography Rules

Typography should:

- remain readable
- avoid giant headings
- use balanced hierarchy
- prioritize content density

Prefer:

- text-sm
- text-base
- compact headers

---

## Mobile UX Rules

Focus on:

- fast readability
- efficient interaction
- thumb-friendly buttons
- compact data presentation

The mobile experience should feel:

- natural
- smooth
- intentional
- production-quality

Not:

- stretched
- oversized
- obviously AI-generated
