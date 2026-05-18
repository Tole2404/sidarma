import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Pencil, Trash2, Printer } from "lucide-react";

interface MobileTransactionCardProps {
  type: "purchase" | "sale" | "expense";
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  status?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
}

const typeConfig = {
  purchase: {
    amountColor: "text-rose-700 dark:text-rose-300",
    badgeVariant: "default" as const,
  },
  sale: {
    amountColor: "text-emerald-700 dark:text-emerald-300",
    badgeVariant: "default" as const,
  },
  expense: {
    amountColor: "text-amber-700 dark:text-amber-300",
    badgeVariant: "secondary" as const,
  },
};

export default function MobileTransactionCard({
  type,
  title,
  subtitle,
  amount,
  date,
  status,
  onEdit,
  onDelete,
  onPrint,
}: MobileTransactionCardProps) {
  const config = typeConfig[type];

  return (
    <Card className="p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {title}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
            {subtitle}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {date}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={cn("text-base font-semibold", config.amountColor)}>
            {formatCurrency(amount)}
          </p>
          {status && (
            <Badge variant={config.badgeVariant} className="mt-1 text-xs">
              {status}
            </Badge>
          )}
        </div>
      </div>
      {(onEdit || onDelete || onPrint) && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
          {onPrint && (
            <Button
              size="sm"
              variant="outline"
              onClick={onPrint}
              className="h-10 flex-1 border-zinc-200 text-zinc-700 hover:bg-zinc-50"
            >
              <Printer className="h-4 w-4 mr-2 text-zinc-500" />
              Nota
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onEdit}
              className="h-10 flex-1 text-zinc-700"
            >
              <Pencil className="h-4 w-4 mr-2 text-zinc-500" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onDelete}
              className="h-10 flex-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Hapus
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
