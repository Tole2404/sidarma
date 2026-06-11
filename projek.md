# Project Flow Instructions

## Project Overview

Build a modern web-based administration system for a kain majun business.

The system should focus on:

- transaction management
- purchase tracking
- expense tracking
- customer management
- stock management
- financial summaries
- clean administration workflow

The application must be scalable because a dynamic/public website may be added later.

---

# Main Business Flow

## Purchase Flow

Admin purchases kain majun from suppliers.

Data required:

- supplier name
- purchase date
- majun type:
  - putih
  - warna
- quantity (kg)
- price per kg
- total purchase price
- transport/shipping expense
- notes

The system should automatically calculate:

- subtotal
- total expenses
- stock increase

---

## Sales Flow

Admin sells kain majun to customer stores.

Data required:

- customer/store name
- sales date
- majun type:
  - putih
  - warna
- quantity sold (kg)
- selling price per kg
- delivery expense
- additional expenses
- payment status
- notes

The system should automatically calculate:

- subtotal
- profit/loss estimation
- total transaction value

---

## Expense Flow

Track operational expenses such as:

- delivery cost
- fuel
- worker salary
- packaging
- transportation
- miscellaneous expenses

Data required:

- expense category
- expense amount
- expense date
- description

---

## Stock Flow

System must automatically manage stock:

- incoming stock from purchases
- outgoing stock from sales
- current remaining stock

Stock should be separated by:

- majun putih
- majun warna

---

## Customer Management

Manage customer/store data:

- store name
- owner name
- phone number
- address
- transaction history
- outstanding payments

---

## Supplier Management

Manage supplier data:

- supplier name
- contact number
- address
- purchase history

---

# Dashboard Requirements

Dashboard should display:

- total sales
- total purchases
- operational expenses
- profit estimation
- stock summary
- recent transactions
- monthly charts
- top customers

Dashboard must be:

- responsive
- compact
- easy to read
- modern SaaS/admin style

---

# Technical Requirements

Use:

- Next.js
- TypeScript
- shadcn/ui
- TailwindCSS
- Prisma ORM
- PostgreSQL/MySQL

Architecture should be:

- modular
- scalable
- maintainable

---

# UI Requirements

UI must:

- feel modern and professional
- avoid AI-generated appearance
- be fully responsive
- support mobile/tablet/desktop
- prioritize usability and readability

Prefer:

- clean spacing
- compact forms
- strong hierarchy
- reusable components

---

# Code Rules

- Keep components modular
- Avoid huge files
- Reuse components
- Use proper folder structure
- Avoid unnecessary dependencies
- Use server actions/API cleanly
- Keep business logic separated

---

# Future Scalability

Prepare architecture for future features such as:

- public website
- customer portal
- invoice export
- analytics
- authentication & roles
- online orders
- WhatsApp integration
- reporting system

The project should be designed as a long-term scalable business system.
