"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

function normalizeCurrencyValue(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (!digitsOnly) {
    return "";
  }

  return digitsOnly.replace(/^0+(?=\d)/, "");
}

function formatCurrencyInput(value: string) {
  const normalizedValue = normalizeCurrencyValue(value);

  if (!normalizedValue) {
    return "";
  }

  return `Rp ${Number(normalizedValue).toLocaleString("id-ID")}`;
}

interface CurrencyInputProps
  extends Omit<React.ComponentProps<typeof Input>, "type" | "value" | "onChange" | "inputMode"> {
  value: string;
  onValueChange: (value: string) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, ...props }, ref) => (
    <Input
      {...props}
      ref={ref}
      type="text"
      inputMode="numeric"
      value={formatCurrencyInput(value)}
      onChange={(event) => onValueChange(normalizeCurrencyValue(event.target.value))}
    />
  ),
);

CurrencyInput.displayName = "CurrencyInput";

export { CurrencyInput, formatCurrencyInput, normalizeCurrencyValue };
