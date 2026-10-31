// components/WeighingModal.tsx
"use client";

import React, { useState, useEffect, useId } from "react";

interface WeighingData {
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  notes?: string;
}

interface WeighingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: WeighingData) => void;
  title?: string;
  maxCapacityKg?: number;
  defaultTareKg?: number;
}

export default function WeighingModal({
  isOpen,
  onClose,
  onSubmit,
  title = "Input Timbangan Digital",
  maxCapacityKg = 500,
  defaultTareKg = 0.5,
}: WeighingModalProps) {
  const [grossInput, setGrossInput] = useState<string>("");
  const [tareInput, setTareInput] = useState<string>(defaultTareKg.toString());
  const [notes, setNotes] = useState<string>("");
  const [errors, setErrors] = useState<{ gross?: string; tare?: string }>({});

  const grossId = useId();
  const tareId = useId();
  const notesId = useId();

  useEffect(() => {
    if (isOpen) {
      setGrossInput("");
      setTareInput(defaultTareKg.toString());
      setNotes("");
      setErrors({});
    }
  }, [isOpen, defaultTareKg]);

  if (!isOpen) return null;

  const parseWeight = (val: string): number => {
    const clean = val.replace(",", ".");
    const num = parseFloat(clean);
    return isNaN(num) ? 0 : Math.round(num * 100) / 100;
  };

  const gross = parseWeight(grossInput);
  const tare = parseWeight(tareInput);
  const net = Math.max(0, Math.round((gross - tare) * 100) / 100);

  const validate = (): boolean => {
    const errs: { gross?: string; tare?: string } = {};

    if (!grossInput || gross <= 0) {
      errs.gross = "Berat kotor harus lebih dari 0 kg.";
    } else if (gross > maxCapacityKg) {
      errs.gross = `Melebihi kapasitas timbangan (${maxCapacityKg} kg).`;
    }

    if (tare < 0) {
      errs.tare = "Tara tidak boleh minus.";
    } else if (tare >= gross && gross > 0) {
      errs.tare = "Tara tidak boleh melebihi atau sama dengan berat kotor.";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      grossWeight: gross,
      tareWeight: tare,
      netWeight: net,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-neutral-700 bg-neutral-900 p-6 shadow-xl text-neutral-100">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            type="button"
            className="text-neutral-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Display Digital */}
          <div className="rounded border border-neutral-800 bg-neutral-950 p-4 text-center">
            <span className="text-xs uppercase tracking-widest text-neutral-400">
              Berat Bersih (Netto)
            </span>
            <div className="font-mono text-4xl font-bold tracking-tight text-emerald-400">
              {net.toFixed(2)}{" "}
              <span className="text-lg font-normal text-neutral-400">kg</span>
            </div>
          </div>

          {/* Gross Weight */}
          <div>
            <label htmlFor={grossId} className="block text-sm font-medium text-neutral-300">
              Berat Kotor (Gross) <span className="text-rose-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                id={grossId}
                type="number"
                step="0.01"
                min="0"
                value={grossInput}
                onChange={(e) => setGrossInput(e.target.value)}
                placeholder="0.00"
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-right font-mono text-white focus:border-emerald-500 focus:outline-none"
                autoFocus
              />
              <span className="absolute left-3 top-2 text-sm text-neutral-400">kg</span>
            </div>
            {errors.gross && (
              <p className="mt-1 text-xs text-rose-400">{errors.gross}</p>
            )}
          </div>

          {/* Tare Weight */}
          <div>
            <label htmlFor={tareId} className="block text-sm font-medium text-neutral-300">
              Tara (Wadah / Karung)
            </label>
            <div className="relative mt-1">
              <input
                id={tareId}
                type="number"
                step="0.01"
                min="0"
                value={tareInput}
                onChange={(e) => setTareInput(e.target.value)}
                placeholder="0.00"
                className="w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-right font-mono text-white focus:border-emerald-500 focus:outline-none"
              />
              <span className="absolute left-3 top-2 text-sm text-neutral-400">kg</span>
            </div>
            {errors.tare && (
              <p className="mt-1 text-xs text-rose-400">{errors.tare}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor={notesId} className="block text-sm font-medium text-neutral-300">
              Keterangan
            </label>
            <input
              id={notesId}
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Bal Majun Putih A1"
              className="mt-1 w-full rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded px-4 py-2 text-sm font-medium text-neutral-300 hover:bg-neutral-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
            >
              Simpan Timbangan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}