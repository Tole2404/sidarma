import React from "react";
import { Badge } from "@/components/ui/badge";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <Badge variant="secondary" className="mb-3">
            {eyebrow}
          </Badge>
        )}
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">{title}</h1>
        <p className="mt-2 text-sm text-zinc-500">{description}</p>
      </div>
      {action}
    </section>
  );
}
