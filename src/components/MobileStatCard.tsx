import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

interface MobileStatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  variant: "income" | "expense" | "balance" | "neutral";
  subtitle?: string;
}

const variantConfig = {
  income: {
    iconBg: "bg-emerald-50 dark:bg-emerald-950",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    valueColor: "text-emerald-700 dark:text-emerald-300",
  },
  expense: {
    iconBg: "bg-rose-50 dark:bg-rose-950",
    iconColor: "text-rose-600 dark:text-rose-400",
    valueColor: "text-rose-700 dark:text-rose-300",
  },
  balance: {
    iconBg: "bg-sky-50 dark:bg-sky-950",
    iconColor: "text-sky-600 dark:text-sky-400",
    valueColor: "text-sky-700 dark:text-sky-300",
  },
  neutral: {
    iconBg: "bg-zinc-100 dark:bg-zinc-800",
    iconColor: "text-zinc-600 dark:text-zinc-400",
    valueColor: "text-zinc-900 dark:text-zinc-100",
  },
};

export default function MobileStatCard({
  title,
  value,
  icon: Icon,
  variant,
  subtitle,
}: MobileStatCardProps) {
  const config = variantConfig[variant];
  const formattedValue = typeof value === "number" ? formatCurrency(value) : value;

  return (
    <Card className="p-3 md:p-4 max-h-[80px] md:max-h-none">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg p-2 flex-shrink-0", config.iconBg)}>
          <Icon className={cn("h-4 w-4 md:h-5 md:w-5", config.iconColor)} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 truncate">
            {title}
          </p>
          <p className={cn("text-lg md:text-2xl font-semibold truncate", config.valueColor)}>
            {formattedValue}
          </p>
          {subtitle && (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
