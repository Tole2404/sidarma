import React from "react";
import { Landmark, TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  amount: number;
  type: "income" | "expense" | "balance";
}

const config = {
  income: {
    icon: TrendingUp,
    iconClass: "bg-emerald-50 text-emerald-600",
    valueClass: "text-emerald-700",
  },
  expense: {
    icon: TrendingDown,
    iconClass: "bg-rose-50 text-rose-600",
    valueClass: "text-rose-700",
  },
  balance: {
    icon: Landmark,
    iconClass: "bg-sky-50 text-sky-600",
    valueClass: "text-sky-700",
  },
};

export default function StatCard({ title, amount, type }: StatCardProps) {
  const Icon = config[type].icon;

  return (
    <Card className="border-zinc-200">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div>
          <p className="text-sm font-medium text-zinc-500">{title}</p>
          <CardTitle className={cn("mt-2 text-2xl", config[type].valueClass)}>
            {formatCurrency(amount)}
          </CardTitle>
        </div>
        <div className={cn("rounded-xl p-2.5", config[type].iconClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-zinc-500">
          {type === "balance"
            ? "Posisi kas terkini setelah semua transaksi."
            : type === "income"
              ? "Akumulasi pemasukan yang sudah tercatat."
              : "Akumulasi pengeluaran yang sudah tercatat."}
        </p>
      </CardContent>
    </Card>
  );
}
