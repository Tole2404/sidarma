# Requirements Document

## Introduction

This document defines requirements for implementing mobile UI improvements across the kain majun administration system. The system currently includes dashboard, purchases, sales, expenses, stock, customers, suppliers, and bale prices management. The goal is to transform the mobile experience from basic responsive layouts to production-quality mobile-first interfaces that resemble modern fintech and SaaS admin applications.

## Glossary

- **UI_System**: The user interface layer of the kain majun administration system
- **Mobile_Viewport**: Screen widths below 768px (mobile devices)
- **Tablet_Viewport**: Screen widths between 768px and 1024px
- **Desktop_Viewport**: Screen widths above 1024px
- **Stat_Card**: A compact card component displaying a single metric with icon and value
- **Transaction_Card**: A compact card component displaying transaction summary information
- **Responsive_Table**: A table component that adapts layout for different viewport sizes
- **Navigation_Component**: The primary navigation interface (sidebar, topbar, or bottom navigation)
- **Page_Container**: The main content wrapper for each application page
- **Data_Grid**: A responsive grid layout for displaying multiple data items

## Requirements

### Requirement 1: Mobile-First Layout System

**User Story:** As a mobile user, I want compact and efficient layouts, so that I can view more information without excessive scrolling.

#### Acceptance Criteria

1. WHEN viewing any page on Mobile_Viewport, THE UI_System SHALL use compact spacing with reduced padding and gaps
2. THE UI_System SHALL avoid vertical stacked full-width cards that exceed 200px height on Mobile_Viewport
3. WHERE horizontal card sections are appropriate, THE UI_System SHALL use 2-column grids or horizontal scroll layouts on Mobile_Viewport
4. THE UI_System SHALL maintain balanced spacing without excessive whitespace on Mobile_Viewport
5. FOR ALL pages, the layout SHALL prioritize content density over decorative spacing on Mobile_Viewport

### Requirement 2: Compact Stat Cards

**User Story:** As a mobile user, I want to see key metrics in compact cards, so that I can quickly scan important information.

#### Acceptance Criteria

1. WHEN displaying statistics on Mobile_Viewport, THE UI_System SHALL render Stat_Cards in a 2-column grid layout
2. THE Stat_Card SHALL display an icon and value in a horizontal layout with minimal padding
3. THE Stat_Card SHALL use text-sm or text-base typography for values on Mobile_Viewport
4. THE Stat_Card SHALL have a maximum height of 100px on Mobile_Viewport
5. FOR ALL Stat_Cards, the icon size SHALL be proportional to the card size (16px-20px on mobile)

### Requirement 3: Compact Transaction Cards

**User Story:** As a mobile user, I want transaction information displayed compactly, so that I can see more transactions without scrolling excessively.

#### Acceptance Criteria

1. WHEN displaying transaction lists on Mobile_Viewport, THE UI_System SHALL render Transaction_Cards with grouped information
2. THE Transaction_Card SHALL use text-sm typography for secondary information on Mobile_Viewport
3. THE Transaction_Card SHALL display primary information (amount, date, status) prominently with larger text
4. THE Transaction_Card SHALL have compact padding (p-3 or p-4) on Mobile_Viewport
5. THE Transaction_Card SHALL group related information horizontally when space permits

### Requirement 4: Responsive Table Implementation

**User Story:** As a mobile user, I want tables to display properly without horizontal page overflow, so that I can view data without awkward scrolling.

#### Acceptance Criteria

1. THE Page_Container SHALL never allow horizontal overflow on Mobile_Viewport
2. WHEN displaying tables on Mobile_Viewport, THE Responsive_Table SHALL hide less-important columns using hidden md:table-cell classes
3. THE Responsive_Table SHALL use text-sm typography for table cells on Mobile_Viewport
4. THE Responsive_Table SHALL use compact column widths with truncate or wrap for long text on Mobile_Viewport
5. WHERE horizontal scrolling is necessary for table content, THE Responsive_Table SHALL scroll within its container without affecting Page_Container scroll
6. THE Responsive_Table SHALL display a minimum of 3 most important columns on Mobile_Viewport

### Requirement 5: Mobile Navigation System

**User Story:** As a mobile user, I want efficient navigation that doesn't consume screen space, so that I can access features quickly while viewing content.

#### Acceptance Criteria

1. WHEN viewing on Mobile_Viewport, THE Navigation_Component SHALL use either bottom navigation or compact topbar layout
2. WHERE a menu is needed on Mobile_Viewport, THE UI_System SHALL use Sheet or Drawer components instead of full sidebars
3. WHERE navigation needs to remain accessible during scrolling, THE Navigation_Component SHALL use sticky positioning on Mobile_Viewport
4. THE Navigation_Component SHALL use icon-only or icon-with-label layouts on Mobile_Viewport
5. THE Navigation_Component SHALL occupy maximum 64px of vertical space on Mobile_Viewport

### Requirement 6: Mobile Typography System

**User Story:** As a mobile user, I want readable text that maintains hierarchy without consuming excessive space, so that I can read content efficiently.

#### Acceptance Criteria

1. WHEN displaying page headers on Mobile_Viewport, THE UI_System SHALL use text-lg or text-xl typography
2. WHEN displaying section headers on Mobile_Viewport, THE UI_System SHALL use text-base or text-sm typography
3. WHEN displaying body text on Mobile_Viewport, THE UI_System SHALL use text-sm typography
4. THE UI_System SHALL maintain visual hierarchy through font weight and color contrast rather than size alone on Mobile_Viewport
5. THE UI_System SHALL avoid text smaller than 12px (text-xs) for primary content on Mobile_Viewport

### Requirement 7: Dashboard Mobile Layout

**User Story:** As a mobile user, I want the dashboard to display key metrics and recent activity compactly, so that I can quickly assess business status.

#### Acceptance Criteria

1. WHEN viewing dashboard on Mobile_Viewport, THE UI_System SHALL display Stat_Cards in a 2-column grid
2. WHEN displaying charts on Mobile_Viewport, THE UI_System SHALL render them at full width with appropriate height (250px-300px)
3. WHEN displaying recent transactions on Mobile_Viewport, THE UI_System SHALL show compact Transaction_Cards with essential information only
4. THE dashboard SHALL prioritize displaying total sales, total purchases, expenses, and profit in the first viewport on Mobile_Viewport
5. THE dashboard SHALL use horizontal scroll for secondary metrics if needed on Mobile_Viewport

### Requirement 8: Purchases Page Mobile Layout

**User Story:** As a mobile user, I want to view and manage purchases efficiently, so that I can record supplier transactions on the go.

#### Acceptance Criteria

1. WHEN viewing purchases page on Mobile_Viewport, THE UI_System SHALL display purchase list using Responsive_Table with supplier, date, amount, and status columns visible
2. WHEN viewing purchases page on Mobile_Viewport, THE UI_System SHALL hide quantity, price per kg, and notes columns using hidden md:table-cell
3. WHEN adding a purchase on Mobile_Viewport, THE UI_System SHALL display form fields in single column layout with compact spacing
4. THE purchases page SHALL display summary statistics in 2-column Stat_Card grid on Mobile_Viewport
5. THE purchases page SHALL use Sheet component for add/edit forms on Mobile_Viewport

### Requirement 9: Sales Page Mobile Layout

**User Story:** As a mobile user, I want to view and manage sales efficiently, so that I can record customer transactions on the go.

#### Acceptance Criteria

1. WHEN viewing sales page on Mobile_Viewport, THE UI_System SHALL display sales list using Responsive_Table with customer, date, amount, and payment status columns visible
2. WHEN viewing sales page on Mobile_Viewport, THE UI_System SHALL hide quantity, price per kg, delivery expense, and notes columns using hidden md:table-cell
3. WHEN adding a sale on Mobile_Viewport, THE UI_System SHALL display form fields in single column layout with compact spacing
4. THE sales page SHALL display summary statistics in 2-column Stat_Card grid on Mobile_Viewport
5. THE sales page SHALL use Sheet component for add/edit forms on Mobile_Viewport

### Requirement 10: Expenses Page Mobile Layout

**User Story:** As a mobile user, I want to view and record expenses efficiently, so that I can track operational costs on the go.

#### Acceptance Criteria

1. WHEN viewing expenses page on Mobile_Viewport, THE UI_System SHALL display expense list using Responsive_Table with category, date, and amount columns visible
2. WHEN viewing expenses page on Mobile_Viewport, THE UI_System SHALL hide description column using hidden md:table-cell
3. WHEN adding an expense on Mobile_Viewport, THE UI_System SHALL display form fields in single column layout with compact spacing
4. THE expenses page SHALL display total expenses and category breakdown in 2-column Stat_Card grid on Mobile_Viewport
5. THE expenses page SHALL use Sheet component for add/edit forms on Mobile_Viewport

### Requirement 11: Stock Page Mobile Layout

**User Story:** As a mobile user, I want to view current stock levels efficiently, so that I can check inventory on the go.

#### Acceptance Criteria

1. WHEN viewing stock page on Mobile_Viewport, THE UI_System SHALL display stock summary using 2-column Stat_Card grid for majun putih and majun warna
2. WHEN displaying stock movements on Mobile_Viewport, THE UI_System SHALL use Responsive_Table with date, type, quantity, and balance columns visible
3. WHEN viewing stock page on Mobile_Viewport, THE UI_System SHALL hide transaction reference and notes columns using hidden md:table-cell
4. THE stock page SHALL display current stock levels prominently at the top on Mobile_Viewport
5. THE stock page SHALL use compact Transaction_Cards for recent stock movements on Mobile_Viewport

### Requirement 12: Customers Page Mobile Layout

**User Story:** As a mobile user, I want to view and manage customer information efficiently, so that I can access customer details on the go.

#### Acceptance Criteria

1. WHEN viewing customers page on Mobile_Viewport, THE UI_System SHALL display customer list using Responsive_Table with name, phone, and outstanding balance columns visible
2. WHEN viewing customers page on Mobile_Viewport, THE UI_System SHALL hide address and transaction count columns using hidden md:table-cell
3. WHEN adding a customer on Mobile_Viewport, THE UI_System SHALL display form fields in single column layout with compact spacing
4. THE customers page SHALL display total customers and total outstanding in 2-column Stat_Card grid on Mobile_Viewport
5. THE customers page SHALL use Sheet component for add/edit forms on Mobile_Viewport

### Requirement 13: Suppliers Page Mobile Layout

**User Story:** As a mobile user, I want to view and manage supplier information efficiently, so that I can access supplier details on the go.

#### Acceptance Criteria

1. WHEN viewing suppliers page on Mobile_Viewport, THE UI_System SHALL display supplier list using Responsive_Table with name, phone, and total purchases columns visible
2. WHEN viewing suppliers page on Mobile_Viewport, THE UI_System SHALL hide address and last purchase date columns using hidden md:table-cell
3. WHEN adding a supplier on Mobile_Viewport, THE UI_System SHALL display form fields in single column layout with compact spacing
4. THE suppliers page SHALL display total suppliers and total purchase value in 2-column Stat_Card grid on Mobile_Viewport
5. THE suppliers page SHALL use Sheet component for add/edit forms on Mobile_Viewport

### Requirement 14: Bale Prices Page Mobile Layout

**User Story:** As a mobile user, I want to view and manage bale prices efficiently, so that I can update pricing on the go.

#### Acceptance Criteria

1. WHEN viewing bale prices page on Mobile_Viewport, THE UI_System SHALL display price list using Responsive_Table with customer tag, price, and status columns visible
2. WHEN viewing bale prices page on Mobile_Viewport, THE UI_System SHALL hide created date and updated date columns using hidden md:table-cell
3. WHEN adding a bale price on Mobile_Viewport, THE UI_System SHALL display form fields in single column layout with compact spacing
4. THE bale prices page SHALL display active prices count and average price in 2-column Stat_Card grid on Mobile_Viewport
5. THE bale prices page SHALL use Sheet component for add/edit forms on Mobile_Viewport

### Requirement 15: Responsive Breakpoint System

**User Story:** As a user on any device, I want the interface to adapt smoothly across different screen sizes, so that I have an optimal experience on my device.

#### Acceptance Criteria

1. THE UI_System SHALL apply mobile-specific styles for viewports below 768px width
2. THE UI_System SHALL apply tablet-specific styles for viewports between 768px and 1024px width
3. THE UI_System SHALL apply desktop-specific styles for viewports above 1024px width
4. WHEN transitioning between breakpoints, THE UI_System SHALL maintain layout stability without content jumps
5. FOR ALL responsive components, the transition between breakpoints SHALL be smooth and visually coherent

### Requirement 16: Touch-Friendly Interaction

**User Story:** As a mobile user, I want interactive elements to be easy to tap, so that I can use the application efficiently with my fingers.

#### Acceptance Criteria

1. THE UI_System SHALL ensure all buttons have minimum touch target size of 44px on Mobile_Viewport
2. THE UI_System SHALL ensure all interactive elements have minimum touch target size of 44px on Mobile_Viewport
3. THE UI_System SHALL provide adequate spacing between interactive elements (minimum 8px) on Mobile_Viewport
4. WHEN displaying action buttons on Mobile_Viewport, THE UI_System SHALL use full-width or prominent sizing
5. THE UI_System SHALL avoid placing interactive elements too close to screen edges (minimum 16px margin) on Mobile_Viewport

### Requirement 17: Performance Optimization

**User Story:** As a mobile user, I want pages to load and render quickly, so that I can access information without delays.

#### Acceptance Criteria

1. WHEN rendering on Mobile_Viewport, THE UI_System SHALL prioritize above-the-fold content rendering
2. WHEN loading data on Mobile_Viewport, THE UI_System SHALL display skeleton loaders for pending content
3. THE UI_System SHALL avoid rendering hidden desktop-only content on Mobile_Viewport
4. THE UI_System SHALL use lazy loading for below-the-fold images and components on Mobile_Viewport
5. WHEN transitioning between pages on Mobile_Viewport, THE UI_System SHALL maintain smooth 60fps animations

### Requirement 18: Consistent Component Library

**User Story:** As a developer, I want reusable mobile-optimized components, so that I can maintain consistency across pages efficiently.

#### Acceptance Criteria

1. THE UI_System SHALL provide a reusable Stat_Card component with mobile-optimized styling
2. THE UI_System SHALL provide a reusable Transaction_Card component with mobile-optimized styling
3. THE UI_System SHALL provide a reusable Responsive_Table component with mobile-optimized behavior
4. THE UI_System SHALL provide a reusable Mobile_Navigation component with configurable layout
5. FOR ALL reusable components, mobile-specific props and variants SHALL be documented and consistent
