import { render, screen, fireEvent } from '@testing-library/react';
import MobileTransactionCard from './MobileTransactionCard';

describe('MobileTransactionCard', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with all required props', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Customer A"
          subtitle="10 kg Majun Putih"
          amount={1000000}
          date="2024-01-15"
        />
      );

      expect(screen.getByText('Customer A')).toBeInTheDocument();
      expect(screen.getByText('10 kg Majun Putih')).toBeInTheDocument();
      expect(screen.getByText('Rp 1.000.000')).toBeInTheDocument();
      expect(screen.getByText('15 Jan 2024')).toBeInTheDocument();
    });

    it('renders with optional status badge', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Customer B"
          subtitle="5 kg Majun Warna"
          amount={500000}
          date="2024-01-20"
          status="Lunas"
        />
      );

      expect(screen.getByText('Lunas')).toBeInTheDocument();
    });

    it('renders without status badge when not provided', () => {
      const { container } = render(
        <MobileTransactionCard
          type="purchase"
          title="Supplier A"
          subtitle="20 kg"
          amount={2000000}
          date="2024-01-10"
        />
      );

      const badges = container.querySelectorAll('.inline-flex.items-center.rounded-full');
      expect(badges).toHaveLength(0);
    });

    it('renders without action buttons when handlers not provided', () => {
      render(
        <MobileTransactionCard
          type="expense"
          title="Listrik"
          subtitle="Biaya operasional"
          amount={300000}
          date="2024-01-05"
        />
      );

      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.queryByText('Hapus')).not.toBeInTheDocument();
    });

    it('renders with edit button when onEdit provided', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Customer C"
          subtitle="15 kg"
          amount={1500000}
          date="2024-01-25"
          onEdit={mockOnEdit}
        />
      );

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.queryByText('Hapus')).not.toBeInTheDocument();
    });

    it('renders with delete button when onDelete provided', () => {
      render(
        <MobileTransactionCard
          type="purchase"
          title="Supplier B"
          subtitle="30 kg"
          amount={3000000}
          date="2024-01-12"
          onDelete={mockOnDelete}
        />
      );

      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
      expect(screen.getByText('Hapus')).toBeInTheDocument();
    });

    it('renders with both action buttons when both handlers provided', () => {
      render(
        <MobileTransactionCard
          type="expense"
          title="Transport"
          subtitle="Pengiriman"
          amount={150000}
          date="2024-01-08"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Hapus')).toBeInTheDocument();
    });
  });

  describe('Transaction Type Styling', () => {
    it('applies sale type styling', () => {
      const { container } = render(
        <MobileTransactionCard
          type="sale"
          title="Sale Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          status="Paid"
        />
      );

      const amount = screen.getByText('Rp 1.000.000');
      expect(amount).toHaveClass('text-emerald-700');

      const badge = container.querySelector('.border-emerald-200');
      expect(badge).toBeInTheDocument();
    });

    it('applies purchase type styling', () => {
      const { container } = render(
        <MobileTransactionCard
          type="purchase"
          title="Purchase Transaction"
          subtitle="Details"
          amount={2000000}
          date="2024-01-15"
          status="Completed"
        />
      );

      const amount = screen.getByText('Rp 2.000.000');
      expect(amount).toHaveClass('text-rose-700');

      const badge = container.querySelector('.border-zinc-200');
      expect(badge).toBeInTheDocument();
    });

    it('applies expense type styling', () => {
      const { container } = render(
        <MobileTransactionCard
          type="expense"
          title="Expense Transaction"
          subtitle="Details"
          amount={500000}
          date="2024-01-15"
          status="Paid"
        />
      );

      const amount = screen.getByText('Rp 500.000');
      expect(amount).toHaveClass('text-rose-700');

      const badge = container.querySelector('.border-rose-200');
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Layout and Spacing', () => {
    it('applies compact padding', () => {
      const { container } = render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const card = container.querySelector('.p-3');
      expect(card).toBeInTheDocument();
    });

    it('uses grouped information layout', () => {
      const { container } = render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const flexContainer = container.querySelector('.flex.items-start.justify-between.gap-3');
      expect(flexContainer).toBeInTheDocument();
    });

    it('applies text truncation to prevent overflow', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Very Long Transaction Title That Should Be Truncated"
          subtitle="Very Long Subtitle That Should Also Be Truncated"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const title = screen.getByText('Very Long Transaction Title That Should Be Truncated');
      expect(title).toHaveClass('truncate');

      const subtitle = screen.getByText('Very Long Subtitle That Should Also Be Truncated');
      expect(subtitle).toHaveClass('truncate');
    });

    it('renders action buttons with border separator', () => {
      const { container } = render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const separator = container.querySelector('.border-t');
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveClass('mt-3', 'pt-3');
    });
  });

  describe('Typography', () => {
    it('uses text-sm for title', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction Title"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const title = screen.getByText('Transaction Title');
      expect(title).toHaveClass('text-sm', 'font-medium');
    });

    it('uses text-xs for subtitle and date', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Subtitle Text"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const subtitle = screen.getByText('Subtitle Text');
      expect(subtitle).toHaveClass('text-xs');

      const date = screen.getByText('15 Jan 2024');
      expect(date).toHaveClass('text-xs');
    });

    it('uses text-base for amount', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const amount = screen.getByText('Rp 1.000.000');
      expect(amount).toHaveClass('text-base', 'font-semibold');
    });
  });

  describe('Touch Target Sizes', () => {
    it('applies minimum 44px touch target to edit button', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onEdit={mockOnEdit}
        />
      );

      const editButton = screen.getByText('Edit').closest('button');
      expect(editButton).toHaveClass('min-h-[44px]');
    });

    it('applies minimum 44px touch target to delete button', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByText('Hapus').closest('button');
      expect(deleteButton).toHaveClass('min-h-[44px]');
    });

    it('makes action buttons full width with flex-1', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const editButton = screen.getByText('Edit').closest('button');
      const deleteButton = screen.getByText('Hapus').closest('button');

      expect(editButton).toHaveClass('flex-1');
      expect(deleteButton).toHaveClass('flex-1');
    });
  });

  describe('Event Handlers', () => {
    it('calls onEdit when edit button clicked', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onEdit={mockOnEdit}
        />
      );

      const editButton = screen.getByText('Edit');
      fireEvent.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });

    it('calls onDelete when delete button clicked', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByText('Hapus');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('calls correct handler when both buttons present', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const editButton = screen.getByText('Edit');
      const deleteButton = screen.getByText('Hapus');

      fireEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
      expect(mockOnDelete).not.toHaveBeenCalled();

      fireEvent.click(deleteButton);
      expect(mockOnDelete).toHaveBeenCalledTimes(1);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Value Formatting', () => {
    it('formats amount as Indonesian currency', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1234567}
          date="2024-01-15"
        />
      );

      expect(screen.getByText('Rp 1.234.567')).toBeInTheDocument();
    });

    it('formats date as Indonesian locale', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-03-25"
        />
      );

      expect(screen.getByText('25 Mar 2024')).toBeInTheDocument();
    });

    it('handles zero amount correctly', () => {
      render(
        <MobileTransactionCard
          type="expense"
          title="Free Item"
          subtitle="No charge"
          amount={0}
          date="2024-01-15"
        />
      );

      expect(screen.getByText('Rp 0')).toBeInTheDocument();
    });

    it('handles large amounts correctly', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Large Transaction"
          subtitle="Bulk order"
          amount={999999999}
          date="2024-01-15"
        />
      );

      expect(screen.getByText('Rp 999.999.999')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('renders semantic HTML structure', () => {
      const { container } = render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const paragraphs = container.querySelectorAll('p');
      expect(paragraphs.length).toBeGreaterThan(0);
    });

    it('uses button elements for actions', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
    });

    it('maintains readable text hierarchy', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const title = screen.getByText('Transaction');
      const subtitle = screen.getByText('Details');
      const amount = screen.getByText('Rp 1.000.000');

      expect(title).toHaveClass('text-sm');
      expect(subtitle).toHaveClass('text-xs');
      expect(amount).toHaveClass('text-base');
    });

    it('includes icons with action buttons for better recognition', () => {
      const { container } = render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const svgElements = container.querySelectorAll('svg');
      expect(svgElements.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Dark Mode Support', () => {
    it('includes dark mode classes for text', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const title = screen.getByText('Transaction');
      expect(title).toHaveClass('dark:text-zinc-100');

      const subtitle = screen.getByText('Details');
      expect(subtitle).toHaveClass('dark:text-zinc-400');
    });

    it('includes dark mode classes for amount colors', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
        />
      );

      const amount = screen.getByText('Rp 1.000.000');
      expect(amount).toHaveClass('dark:text-emerald-300');
    });

    it('includes dark mode classes for delete button', () => {
      render(
        <MobileTransactionCard
          type="sale"
          title="Transaction"
          subtitle="Details"
          amount={1000000}
          date="2024-01-15"
          onDelete={mockOnDelete}
        />
      );

      const deleteButton = screen.getByText('Hapus').closest('button');
      expect(deleteButton).toHaveClass('dark:text-rose-400', 'dark:hover:text-rose-300');
    });
  });
});
