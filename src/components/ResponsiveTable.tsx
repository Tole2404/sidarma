"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export interface ColumnDef<T = any> {
  key: string;
  header: string;
  render: (value: any, row: T) => React.ReactNode;
  mobileVisible?: boolean;
  className?: string;
}

export interface ResponsiveTableProps<T = any> {
  columns: ColumnDef<T>[];
  data: T[];
  mobileColumns?: string[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

export function ResponsiveTable<T extends { id?: string | number }>({
  columns,
  data,
  mobileColumns = [],
  onRowClick,
  emptyMessage = "Tidak ada data.",
}: ResponsiveTableProps<T>) {
  // Determine mobile visibility for each column
  const columnsWithVisibility = columns.map((col) => ({
    ...col,
    mobileVisible: col.mobileVisible ?? mobileColumns.includes(col.key),
  }));

  // Ensure at least 3 columns are visible on mobile
  const mobileVisibleCount = columnsWithVisibility.filter((col) => col.mobileVisible).length;
  if (mobileVisibleCount < 3 && columnsWithVisibility.length >= 3) {
    // Auto-mark first 3 columns as mobile visible if less than 3 are marked
    columnsWithVisibility.forEach((col, index) => {
      if (index < 3) {
        col.mobileVisible = true;
      }
    });
  }

  return (
    <div className="w-full overflow-x-auto max-w-full">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columnsWithVisibility.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  col.mobileVisible ? "" : "hidden md:table-cell",
                  col.className,
                )}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={row.id ?? rowIndex}
                className={cn(
                  "min-h-[48px]",
                  onRowClick && "cursor-pointer",
                )}
                onClick={() => onRowClick?.(row)}
              >
                {columnsWithVisibility.map((col) => (
                  <TableCell
                    key={col.key}
                    className={cn(
                      "text-sm",
                      col.mobileVisible ? "" : "hidden md:table-cell",
                      col.className,
                    )}
                  >
                    {col.render((row as any)[col.key], row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columnsWithVisibility.length}
                className="py-12 text-center text-sm text-zinc-500"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
