import { unstable_cache } from 'next/cache';

   export const getDashboardSummary = unstable_cache(
     async () => {
       const [stock, debts] = await Promise.all([
         getInventoryStock(),
         getUnpaidDebts()
       ]);
       return { stock, debts };
     },
     ['dashboard-summary'],
     { revalidate: 60, tags: ['dashboard'] }
   );