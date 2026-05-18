"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type SheetSide = "left" | "right";

function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

function SheetContent({
  className,
  side = "right",
  children,
}: React.HTMLAttributes<HTMLDivElement> & { side?: SheetSide }) {
  return (
    <DialogContent
      showClose={false}
      className={cn(
        "flex h-full max-w-none items-stretch rounded-none border-0 p-0 shadow-2xl",
        side === "left"
          ? "ml-0 mr-auto w-full max-w-[320px]"
          : "ml-auto mr-0 w-full max-w-[320px]",
        className,
      )}
    >
      {children}
    </DialogContent>
  );
}

const SheetHeader = DialogHeader;
const SheetTitle = DialogTitle;
const SheetDescription = DialogDescription;

export { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle };
