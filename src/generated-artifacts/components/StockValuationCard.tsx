### 💻 FULLSTACK CODE BUILDER: DRAF KOMPONEN BARU
Contoh komponen React TypeScript untuk widget Ringkasan Valuasi Stok Gudang:

```tsx
// components/StockValuationCard.tsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

interface StockValuationProps {
  totalKg: number;
  estimatedValue: number;
  averageCostPerKg: number;
}

export function StockValuationCard({ totalKg, estimatedValue, averageCostPerKg }: StockValuationProps) {
  return (
    <Card className="border border-zinc-200 dark:border-zinc-800 shadow-sm">
      <CardHeader className="pb-2">
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Total Nilai Aset Stok</p>
        <CardTitle className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
          {formatCurrency(estimatedValue)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-xs text-zinc-500 border-t border-zinc-100 dark:border-zinc-800/80 pt-2 mt-1">
          <span>Total Tonase: {totalKg.toLocaleString("id-ID")} kg</span>
          <span>Rata-rata HPP: {formatCurrency(averageCostPerKg)}/kg</span>
        </div>
      </CardContent>
    </Card>
  );
}
```

Komponen ini siap di-import ke halaman `/dashboard` atau `/stock`.