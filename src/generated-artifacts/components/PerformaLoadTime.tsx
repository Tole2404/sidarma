// app/dashboard/page.tsx
import { Suspense } from 'react';
import StockWidget from './StockWidget';
import DebtWidget from './DebtWidget';
import Skeleton from '@/components/Skeleton';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Suspense fallback={<Skeleton />}>
        <StockWidget />
      </Suspense>
      <Suspense fallback={<Skeleton />}>
        <DebtWidget />
      </Suspense>
    </div>
  );
}