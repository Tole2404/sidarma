# Design Document: Mobile UI Improvements

## Overview

This design document outlines the technical approach for transforming the kain majun administration system into a production-quality mobile-first application. The system currently provides basic responsive layouts but lacks the compact, efficient mobile experience expected in modern fintech and SaaS applications.

### Current State

The existing application includes:
- Desktop-optimized layouts with sidebar navigation
- Basic responsive breakpoints using Tailwind CSS
- shadcn/ui component library (Card, Table, Sheet, Dialog, Button, Input, Select)
- 8 main pages: Dashboard, Purchases, Sales, Expenses, Stock, Customers, Suppliers, Bale Prices
- Existing components: StatCard, Sidebar, PageHeader, Modal

### Design Goals

1. **Mobile-First Experience**: Transform from desktop-first to mobile-first design philosophy
2. **Content Density**: Maximize information visibility without excessive scrolling
3. **Touch-Friendly**: Ensure all interactive elements meet minimum touch target sizes
4. **Performance**: Optimize rendering and loading for mobile devices
5. **Consistency**: Establish reusable mobile-optimized component patterns
6. **Production Quality**: Match the polish of modern fintech and SaaS mobile applications

### Technical Constraints

- Must maintain existing Next.js 14+ App Router architecture
- Must use existing shadcn/ui component library
- Must preserve existing API contracts and data models
- Must support progressive enhancement (mobile-first, desktop-enhanced)
- Must maintain dark mode support

## Architecture

### Component Hierarchy

```
App Layout (layout.tsx)
├── Sidebar (desktop) / MobileNav (mobile)
├── Page Container
│   ├── PageHeader (responsive)
│   ├── StatCardGrid (2-col mobile, 4-col desktop)
│   ├── ResponsiveTable (adaptive columns)
│   ├── TransactionCardList (mobile alternative)
│   └── FormSheet (mobile) / Dialog (desktop)
```

### Responsive Strategy

**Breakpoint System:**
- Mobile: `< 768px` (default, mobile-first)
- Tablet: `768px - 1024px` (md: prefix)
- Desktop: `> 1024px` (lg: prefix)

**Layout Adaptation:**
- Mobile: Single column, compact spacing, bottom/top navigation
- Tablet: 2-column grids, sidebar drawer, moderate spacing
- Desktop: Multi-column grids, persistent sidebar, generous spacing

### State Management

No additional state management libraries required. Component-level state using React hooks:
- `useState` for local UI state (forms, dialogs, sheets)
- `useEffect` for data fetching and side effects
- `useRouter` for navigation
- Existing patterns maintained

## Components and Interfaces

### 1. MobileStatCard Component

**Purpose:** Display key metrics in compact 2-column grid layout for mobile viewports.

**Interface:**
```typescript
interface MobileStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance" | "neutral";
  subtitle?: string;
}
```

**Behavior:**
- Horizontal layout: icon left, content right
- Compact padding: `p-3` on mobile, `p-4` on tablet+
- Typography: `text-sm` for title, `text-lg` for value on mobile
- Icon size: `h-4 w-4` on mobile, `h-5 w-5` on desktop
- Max height: 80px on mobile

**Responsive Classes:**
```tsx
<Card className="p-3 md:p-4">
  <div className="flex items-center gap-3">
    <div className="rounded-lg p-2 bg-{variant}-50">
      <Icon className="h-4 w-4 md:h-5 md:h-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs md:text-sm text-zinc-500">{title}</p>
      <p className="text-lg md:text-2xl font-semibold">{value}</p>
    </div>
  </div>
</Card>
```

### 2. MobileTransactionCard Component

**Purpose:** Display transaction information in compact card format as mobile alternative to tables.

**Interface:**
```typescript
interface MobileTransactionCardProps {
  type: "purchase" | "sale" | "expense";
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  status?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}
```

**Behavior:**
- Compact padding: `p-3`
- Grouped information: title/subtitle stacked, amount/date horizontal
- Typography: `text-sm` for secondary info, `text-base` for primary
- Action buttons: icon-only, minimum 44px touch target
- Color coding by transaction type

**Layout:**
```tsx
<Card className="p-3">
  <div className="flex items-start justify-between gap-3">
    <div className="min-w-0 flex-1">
      <p className="text-sm font-medium text-zinc-900">{title}</p>
      <p className="text-xs text-zinc-500">{subtitle}</p>
      <p className="text-xs text-zinc-500 mt-1">{formatDate(date)}</p>
    </div>
    <div className="text-right">
      <p className="text-base font-semibold text-{variant}-700">{formatCurrency(amount)}</p>
      {status && <Badge size="sm">{status}</Badge>}
    </div>
  </div>
  {(onEdit || onDelete) && (
    <div className="flex items-center gap-2 mt-3 pt-3 border-t">
      {onEdit && <Button size="sm" variant="ghost" onClick={onEdit}>Edit</Button>}
      {onDelete && <Button size="sm" variant="ghost" onClick={onDelete}>Hapus</Button>}
    </div>
  )}
</Card>
```

### 3. ResponsiveTable Component

**Purpose:** Adaptive table that hides columns on mobile and provides horizontal scroll when needed.

**Interface:**
```typescript
interface ResponsiveTableProps {
  columns: ColumnDef[];
  data: any[];
  mobileColumns: string[]; // Column keys visible on mobile
  onRowClick?: (row: any) => void;
}

interface ColumnDef {
  key: string;
  header: string;
  render: (value: any, row: any) => React.ReactNode;
  mobileVisible?: boolean; // Explicitly mark mobile visibility
  className?: string;
}
```

**Behavior:**
- Desktop: Show all columns
- Mobile: Show only `mobileColumns`, hide others with `hidden md:table-cell`
- Compact typography: `text-sm` on mobile
- Horizontal scroll container: `overflow-x-auto` with `max-w-full`
- Minimum 3 columns visible on mobile
- Touch-friendly row height: minimum 48px

**Implementation Pattern:**
```tsx
<div className="w-full overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        {columns.map(col => (
          <TableHead 
            key={col.key}
            className={cn(
              col.mobileVisible ? "" : "hidden md:table-cell",
              col.className
            )}
          >
            {col.header}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map(row => (
        <TableRow key={row.id} className="min-h-[48px]">
          {columns.map(col => (
            <TableCell
              key={col.key}
              className={cn(
                "text-sm",
                col.mobileVisible ? "" : "hidden md:table-cell",
                col.className
              )}
            >
              {col.render(row[col.key], row)}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>
```

### 4. MobileNavigation Component

**Purpose:** Provide efficient navigation for mobile viewports using bottom navigation or compact topbar.

**Interface:**
```typescript
interface MobileNavigationProps {
  user: SessionUser | null;
  currentPath: string;
  onLogout: () => void;
}

interface NavLink {
  name: string;
  href: string;
  icon: LucideIcon;
}
```

**Behavior:**
- Mobile: Sticky top header (64px) with hamburger menu
- Sheet drawer for full navigation menu
- Desktop: Persistent sidebar (existing behavior)
- Theme toggle accessible in both mobile and desktop
- User profile and logout in drawer footer

**Mobile Header:**
```tsx
<header className="sticky top-0 z-30 h-16 border-b bg-white/90 backdrop-blur lg:hidden">
  <div className="flex h-full items-center justify-between px-4">
    <Link href="/dashboard" className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-zinc-950 flex items-center justify-center">
        <Package className="h-4 w-4 text-white" />
      </div>
      <div>
        <p className="text-sm font-semibold">Majun Admin</p>
        <p className="text-xs text-zinc-500">Dashboard</p>
      </div>
    </Link>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" onClick={toggleTheme}>
        <Sun className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
        <Menu className="h-5 w-5" />
      </Button>
    </div>
  </div>
</header>
```

### 5. MobileFormSheet Component

**Purpose:** Display forms in Sheet component on mobile, Dialog on desktop.

**Interface:**
```typescript
interface MobileFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}
```

**Behavior:**
- Mobile: Full-height Sheet from bottom or side
- Desktop: Centered Dialog with max-width
- Responsive form layout: single column mobile, multi-column desktop
- Touch-friendly input fields: minimum 44px height
- Sticky footer for action buttons on mobile

**Responsive Wrapper:**
```tsx
// Mobile: Sheet
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent side="bottom" className="h-[90vh] lg:hidden">
    <SheetHeader>
      <SheetTitle>{title}</SheetTitle>
      <SheetDescription>{description}</SheetDescription>
    </SheetHeader>
    <div className="overflow-y-auto py-4">
      {children}
    </div>
  </SheetContent>
</Sheet>

// Desktop: Dialog
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="hidden lg:block max-w-2xl">
    <DialogHeader>
      <DialogTitle>{title}</DialogTitle>
      <DialogDescription>{description}</DialogDescription>
    </DialogHeader>
    {children}
  </DialogContent>
</Dialog>
```

### 6. PageContainer Component

**Purpose:** Consistent page wrapper with responsive padding and max-width.

**Interface:**
```typescript
interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}
```

**Behavior:**
- Responsive padding: `px-4` mobile, `px-6` tablet, `px-8` desktop
- Responsive vertical spacing: `py-4` mobile, `py-6` desktop
- Max-width constraint: `max-w-7xl` default
- Prevents horizontal overflow: `overflow-x-hidden`

**Implementation:**
```tsx
<main className="admin-main max-w-7xl px-4 py-4 md:px-6 md:py-6 lg:px-8">
  {children}
</main>
```

## Data Models

No changes to existing data models. All interfaces remain the same:
- `DashboardData`
- `PurchaseRecord`
- `SaleRecord`
- `ExpenseRecord`
- `StockSummary`
- `CustomerRecord`
- `SupplierRecord`
- `BalePriceRecord`

The mobile improvements are purely presentational and do not affect data structures or API contracts.

## Error Handling

### Mobile-Specific Error Scenarios

1. **Touch Target Too Small**
   - Detection: Manual testing and accessibility audit
   - Handling: Ensure minimum 44px touch targets
   - User feedback: N/A (preventive design)

2. **Horizontal Overflow**
   - Detection: Visual testing on mobile devices
   - Handling: `overflow-x-hidden` on page container, `overflow-x-auto` on table containers
   - User feedback: Proper scroll behavior

3. **Form Validation on Mobile**
   - Detection: HTML5 validation + custom validation
   - Handling: Same as desktop, with mobile-optimized error messages
   - User feedback: Inline error messages below fields

4. **Network Errors on Mobile**
   - Detection: Fetch API error handling
   - Handling: Same as existing error handling
   - User feedback: Toast notifications or inline error messages

5. **Loading States**
   - Detection: Async operation in progress
   - Handling: Skeleton loaders for content, spinner for actions
   - User feedback: Visual loading indicators

### Error Recovery

All error handling follows existing patterns:
- Try-catch blocks for async operations
- User-friendly error messages
- Graceful degradation
- Retry mechanisms where appropriate

## Testing Strategy

### Why Property-Based Testing Does Not Apply

Property-based testing (PBT) is **not appropriate** for this feature because:

1. **UI Rendering Focus:** This feature is primarily about visual presentation, responsive layouts, and CSS styling - areas where PBT provides minimal value
2. **No Business Logic:** There are no algorithms, data transformations, or complex business rules to test with universal properties
3. **Configuration-Based:** Responsive breakpoints and layout rules are declarative configuration, not computational logic
4. **Better Alternatives:** Visual regression testing, snapshot testing, and manual device testing are more effective for validating UI correctness

**Appropriate Testing Approaches:**
- **Snapshot tests** for component rendering consistency
- **Visual regression tests** for responsive layout validation
- **Integration tests** for user interactions and form submissions
- **Manual testing** on real devices for touch interactions and visual quality

### Unit Testing

**Component Tests:**
- MobileStatCard: rendering, variant styling, responsive classes
- MobileTransactionCard: rendering, action handlers, conditional rendering
- ResponsiveTable: column visibility, mobile column filtering, row rendering
- MobileNavigation: drawer open/close, navigation links, theme toggle
- MobileFormSheet: responsive rendering, form submission, validation

**Test Framework:** Jest + React Testing Library

**Example Test:**
```typescript
describe("MobileStatCard", () => {
  it("renders with compact layout on mobile", () => {
    render(<MobileStatCard title="Total Sales" value={1000000} icon={TrendingUp} variant="income" />);
    expect(screen.getByText("Total Sales")).toBeInTheDocument();
    expect(screen.getByText("Rp 1.000.000")).toBeInTheDocument();
  });

  it("applies correct variant styling", () => {
    const { container } = render(<MobileStatCard title="Expenses" value={500000} icon={TrendingDown} variant="expense" />);
    expect(container.querySelector(".bg-rose-50")).toBeInTheDocument();
  });

  it("renders with responsive classes", () => {
    const { container } = render(<MobileStatCard title="Balance" value={2000000} icon={Landmark} variant="balance" />);
    expect(container.querySelector(".p-3")).toBeInTheDocument();
    expect(container.querySelector(".md\\:p-4")).toBeInTheDocument();
  });
});
```

**Snapshot Testing:**
```typescript
describe("MobileStatCard snapshots", () => {
  it("matches snapshot for income variant", () => {
    const { container } = render(<MobileStatCard title="Income" value={1000000} icon={TrendingUp} variant="income" />);
    expect(container).toMatchSnapshot();
  });

  it("matches snapshot for expense variant", () => {
    const { container } = render(<MobileStatCard title="Expense" value={500000} icon={TrendingDown} variant="expense" />);
    expect(container).toMatchSnapshot();
  });
});
```

### Integration Testing

**Page Tests:**
- Dashboard: stat cards render, recent activities display, responsive layout
- Purchases: table displays, form submission, mobile sheet behavior
- Sales: table displays, form submission, mobile sheet behavior
- Expenses: table displays, form submission, mobile sheet behavior
- Stock: stat cards render, stock movements display
- Customers: table displays, form submission
- Suppliers: table displays, form submission
- Bale Prices: table displays, form submission

**Test Scenarios:**
- Mobile viewport (375px width)
- Tablet viewport (768px width)
- Desktop viewport (1280px width)
- Touch interactions
- Form validation
- Data loading states

### Visual Regression Testing

**Tools:** Playwright or Cypress with visual testing plugin

**Test Cases:**
- Screenshot comparison for each page at mobile, tablet, desktop breakpoints
- Component library screenshots
- Dark mode screenshots
- Loading state screenshots

### Manual Testing Checklist

**Mobile Devices:**
- iPhone SE (375px)
- iPhone 12/13/14 (390px)
- iPhone 14 Pro Max (430px)
- Samsung Galaxy S21 (360px)
- iPad Mini (768px)

**Test Scenarios:**
- [ ] All pages render without horizontal overflow
- [ ] Touch targets are minimum 44px
- [ ] Forms are usable with on-screen keyboard
- [ ] Navigation drawer opens and closes smoothly
- [ ] Tables display correctly with hidden columns
- [ ] Stat cards display in 2-column grid
- [ ] Transaction cards are compact and readable
- [ ] Theme toggle works in mobile header
- [ ] Loading states display correctly
- [ ] Error messages are readable

### Performance Testing

**Metrics:**
- First Contentful Paint (FCP): < 1.5s on 3G
- Largest Contentful Paint (LCP): < 2.5s on 3G
- Time to Interactive (TTI): < 3.5s on 3G
- Cumulative Layout Shift (CLS): < 0.1

**Tools:**
- Lighthouse (mobile audit)
- WebPageTest (mobile device testing)
- Chrome DevTools (network throttling)

**Optimization Targets:**
- Lazy load below-the-fold content
- Optimize images for mobile
- Minimize JavaScript bundle size
- Use skeleton loaders for perceived performance

## Implementation Plan

### Phase 1: Core Components (Week 1)
1. Create MobileStatCard component
2. Create MobileTransactionCard component
3. Create ResponsiveTable component
4. Update MobileNavigation component
5. Create MobileFormSheet wrapper
6. Update PageContainer component

### Phase 2: Dashboard & Transactions (Week 2)
1. Implement Dashboard mobile layout
2. Implement Purchases page mobile layout
3. Implement Sales page mobile layout
4. Implement Expenses page mobile layout

### Phase 3: Master Data Pages (Week 3)
1. Implement Stock page mobile layout
2. Implement Customers page mobile layout
3. Implement Suppliers page mobile layout
4. Implement Bale Prices page mobile layout

### Phase 4: Testing & Refinement (Week 4)
1. Unit tests for all components
2. Integration tests for all pages
3. Visual regression tests
4. Manual testing on real devices
5. Performance optimization
6. Bug fixes and refinements

## Appendix

### Responsive Utility Classes Reference

**Spacing:**
- Mobile: `p-3`, `gap-3`, `space-y-3`
- Tablet: `md:p-4`, `md:gap-4`, `md:space-y-4`
- Desktop: `lg:p-6`, `lg:gap-6`, `lg:space-y-6`

**Typography:**
- Mobile: `text-xs`, `text-sm`, `text-base`, `text-lg`
- Desktop: `md:text-sm`, `md:text-base`, `md:text-lg`, `md:text-xl`, `md:text-2xl`

**Grid Layouts:**
- Mobile: `grid-cols-1`, `grid-cols-2`
- Tablet: `md:grid-cols-2`, `md:grid-cols-3`
- Desktop: `lg:grid-cols-3`, `lg:grid-cols-4`, `xl:grid-cols-4`

**Visibility:**
- Hide on mobile: `hidden md:block`, `hidden md:table-cell`
- Show on mobile only: `block md:hidden`, `table-cell md:hidden`

### Design Tokens

**Touch Targets:**
- Minimum: 44px × 44px
- Recommended: 48px × 48px
- Spacing between: 8px minimum

**Card Heights:**
- Mobile stat card: 80px max
- Mobile transaction card: 100px max
- Desktop stat card: 120px max

**Navigation Heights:**
- Mobile header: 64px (h-16)
- Desktop sidebar: full height
- Bottom navigation (if used): 64px

### Accessibility Considerations

1. **Touch Targets:** All interactive elements meet WCAG 2.1 Level AAA (44px minimum)
2. **Color Contrast:** All text meets WCAG AA standards (4.5:1 for normal text)
3. **Focus Indicators:** Visible focus states for keyboard navigation
4. **Screen Reader Support:** Proper ARIA labels and semantic HTML
5. **Responsive Text:** Text remains readable at all viewport sizes (minimum 12px)
6. **Keyboard Navigation:** All functionality accessible via keyboard
7. **Motion Preferences:** Respect `prefers-reduced-motion` media query
