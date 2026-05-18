import React from 'react';
import { render, screen } from '@testing-library/react';
import { TrendingUp, TrendingDown, Landmark, Package } from 'lucide-react';
import MobileStatCard from './MobileStatCard';

describe('MobileStatCard', () => {
  describe('Rendering', () => {
    it('renders with title and numeric value', () => {
      render(
        <MobileStatCard
          title="Total Sales"
          value={1000000}
          icon={TrendingUp}
          variant="income"
        />
      );
      
      expect(screen.getByText('Total Sales')).toBeInTheDocument();
      expect(screen.getByText('Rp 1.000.000')).toBeInTheDocument();
    });

    it('renders with title and string value', () => {
      render(
        <MobileStatCard
          title="Total Items"
          value="150 items"
          icon={Package}
          variant="neutral"
        />
      );
      
      expect(screen.getByText('Total Items')).toBeInTheDocument();
      expect(screen.getByText('150 items')).toBeInTheDocument();
    });

    it('renders with optional subtitle', () => {
      render(
        <MobileStatCard
          title="Balance"
          value={2000000}
          icon={Landmark}
          variant="balance"
          subtitle="Last updated today"
        />
      );
      
      expect(screen.getByText('Balance')).toBeInTheDocument();
      expect(screen.getByText('Rp 2.000.000')).toBeInTheDocument();
      expect(screen.getByText('Last updated today')).toBeInTheDocument();
    });

    it('renders without subtitle when not provided', () => {
      const { container } = render(
        <MobileStatCard
          title="Expenses"
          value={500000}
          icon={TrendingDown}
          variant="expense"
        />
      );
      
      // Should only have title and value, no subtitle
      const textElements = container.querySelectorAll('p');
      expect(textElements).toHaveLength(2); // title and value only
    });
  });

  describe('Variant Styling', () => {
    it('applies income variant styling', () => {
      const { container } = render(
        <MobileStatCard
          title="Income"
          value={1000000}
          icon={TrendingUp}
          variant="income"
        />
      );
      
      expect(container.querySelector('.bg-emerald-50')).toBeInTheDocument();
      expect(container.querySelector('.text-emerald-600')).toBeInTheDocument();
      expect(container.querySelector('.text-emerald-700')).toBeInTheDocument();
    });

    it('applies expense variant styling', () => {
      const { container } = render(
        <MobileStatCard
          title="Expense"
          value={500000}
          icon={TrendingDown}
          variant="expense"
        />
      );
      
      expect(container.querySelector('.bg-rose-50')).toBeInTheDocument();
      expect(container.querySelector('.text-rose-600')).toBeInTheDocument();
      expect(container.querySelector('.text-rose-700')).toBeInTheDocument();
    });

    it('applies balance variant styling', () => {
      const { container } = render(
        <MobileStatCard
          title="Balance"
          value={2000000}
          icon={Landmark}
          variant="balance"
        />
      );
      
      expect(container.querySelector('.bg-sky-50')).toBeInTheDocument();
      expect(container.querySelector('.text-sky-600')).toBeInTheDocument();
      expect(container.querySelector('.text-sky-700')).toBeInTheDocument();
    });

    it('applies neutral variant styling', () => {
      const { container } = render(
        <MobileStatCard
          title="Items"
          value="100"
          icon={Package}
          variant="neutral"
        />
      );
      
      expect(container.querySelector('.bg-zinc-100')).toBeInTheDocument();
      expect(container.querySelector('.text-zinc-600')).toBeInTheDocument();
      expect(container.querySelector('.text-zinc-900')).toBeInTheDocument();
    });
  });

  describe('Responsive Classes', () => {
    it('applies responsive padding classes', () => {
      const { container } = render(
        <MobileStatCard
          title="Balance"
          value={2000000}
          icon={Landmark}
          variant="balance"
        />
      );
      
      const card = container.querySelector('.p-3');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('md:p-4');
    });

    it('applies responsive icon size classes', () => {
      const { container } = render(
        <MobileStatCard
          title="Income"
          value={1000000}
          icon={TrendingUp}
          variant="income"
        />
      );
      
      const icon = container.querySelector('.h-4');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-4', 'md:h-5', 'md:w-5');
    });

    it('applies responsive typography classes', () => {
      const { container } = render(
        <MobileStatCard
          title="Sales"
          value={1500000}
          icon={TrendingUp}
          variant="income"
        />
      );
      
      // Title should have text-xs on mobile, text-sm on desktop
      const title = screen.getByText('Sales');
      expect(title).toHaveClass('text-xs', 'md:text-sm');
      
      // Value should have text-lg on mobile, text-2xl on desktop
      const value = screen.getByText('Rp 1.500.000');
      expect(value).toHaveClass('text-lg', 'md:text-2xl');
    });

    it('applies max height constraint on mobile', () => {
      const { container } = render(
        <MobileStatCard
          title="Balance"
          value={2000000}
          icon={Landmark}
          variant="balance"
        />
      );
      
      const card = container.querySelector('.max-h-\\[80px\\]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass('md:max-h-none');
    });
  });

  describe('Layout Structure', () => {
    it('uses horizontal layout with icon left and content right', () => {
      const { container } = render(
        <MobileStatCard
          title="Income"
          value={1000000}
          icon={TrendingUp}
          variant="income"
        />
      );
      
      const flexContainer = container.querySelector('.flex.items-center.gap-3');
      expect(flexContainer).toBeInTheDocument();
      
      // Icon container should be first child
      const iconContainer = flexContainer?.firstChild;
      expect(iconContainer).toHaveClass('rounded-lg', 'p-2', 'flex-shrink-0');
      
      // Content container should be second child
      const contentContainer = flexContainer?.lastChild;
      expect(contentContainer).toHaveClass('min-w-0', 'flex-1');
    });

    it('applies truncate to prevent text overflow', () => {
      render(
        <MobileStatCard
          title="Very Long Title That Should Be Truncated"
          value={1000000}
          icon={TrendingUp}
          variant="income"
          subtitle="Very long subtitle that should also be truncated"
        />
      );
      
      const title = screen.getByText('Very Long Title That Should Be Truncated');
      expect(title).toHaveClass('truncate');
      
      const value = screen.getByText('Rp 1.000.000');
      expect(value).toHaveClass('truncate');
      
      const subtitle = screen.getByText('Very long subtitle that should also be truncated');
      expect(subtitle).toHaveClass('truncate');
    });
  });

  describe('Value Formatting', () => {
    it('formats numeric values as currency', () => {
      render(
        <MobileStatCard
          title="Sales"
          value={1234567}
          icon={TrendingUp}
          variant="income"
        />
      );
      
      expect(screen.getByText('Rp 1.234.567')).toBeInTheDocument();
    });

    it('displays string values as-is', () => {
      render(
        <MobileStatCard
          title="Status"
          value="Active"
          icon={Package}
          variant="neutral"
        />
      );
      
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('handles zero value correctly', () => {
      render(
        <MobileStatCard
          title="Balance"
          value={0}
          icon={Landmark}
          variant="balance"
        />
      );
      
      expect(screen.getByText('Rp 0')).toBeInTheDocument();
    });

    it('handles negative values correctly', () => {
      render(
        <MobileStatCard
          title="Loss"
          value={-500000}
          icon={TrendingDown}
          variant="expense"
        />
      );
      
      expect(screen.getByText('-Rp 500.000')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders semantic HTML structure', () => {
      const { container } = render(
        <MobileStatCard
          title="Income"
          value={1000000}
          icon={TrendingUp}
          variant="income"
        />
      );
      
      // Should use paragraph elements for text content
      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('maintains readable text hierarchy', () => {
      render(
        <MobileStatCard
          title="Sales"
          value={1000000}
          icon={TrendingUp}
          variant="income"
          subtitle="Today"
        />
      );
      
      const title = screen.getByText('Sales');
      const value = screen.getByText('Rp 1.000.000');
      const subtitle = screen.getByText('Today');
      
      // Title should be smaller than value
      expect(title).toHaveClass('text-xs');
      expect(value).toHaveClass('text-lg');
      expect(subtitle).toHaveClass('text-xs');
    });
  });
});
