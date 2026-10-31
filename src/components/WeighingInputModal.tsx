"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const scaleSchema = z
  .object({
    productType: z.enum(["PUTIH_A1", "PUTIH_C3", "WARNA_A1", "WARNA_B2", "WARNA_C3", "AFVAL"]),
    grossWeight: z
      .number({ invalid_type_error: "Bruto wajib angka" })
      .positive("Bruto harus > 0")
      .max(500, "Maksimal bobot 1 bal 500 kg")
      .multipleOf(0.01, "Presisi maksimal 2 desimal"),
    tareWeight: z
      .number({ invalid_type_error: "Tara wajib angka" })
      .min(0, "Tara tidak boleh negatif")
      .max(50, "Maksimal tara 50 kg")
      .multipleOf(0.01, "Presisi maksimal 2 desimal"),
    netWeight: z.number(),
    notes: z.string().max(100).optional(),
  })
  .refine((data) => data.grossWeight > data.tareWeight, {
    message: "Bruto harus lebih besar dari tara",
    path: ["grossWeight"],
  });

export type ScaleFormData = z.infer<typeof scaleSchema>;

interface ScaleInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitWeight: (data: ScaleFormData) => Promise<void> | void;
}

export default function ScaleInputModal({
  isOpen,
  onClose,
  onSubmitWeight,
}: ScaleInputModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ScaleFormData>({
    resolver: zodResolver(scaleSchema),
    defaultValues: {
      productType: "PUTIH_A1",
      grossWeight: 0,
      tareWeight: 0,
      netWeight: 0,
      notes: "",
    },
  });

  const gross = watch("grossWeight");
  const tare = watch("tareWeight");

  useEffect(() => {
    const g = Number(gross) || 0;
    const t = Number(tare) || 0;
    const net = Math.max(0, Number((g - t).toFixed(2)));
    setValue("netWeight", net);
  }, [gross, tare, setValue]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data: ScaleFormData) => {
    await onSubmitWeight(data);
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 border border-zinc-700 p-6 shadow-xl text-zinc-100">
        <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
          <h2 className="text-lg font-bold">Input Timbangan Bal / Majun</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-100 text-sm font-mono"
          >
            ESC / TUTUP
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
              Kategori Kain
            </label>
            <select
              {...register("productType")}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="PUTIH_A1">Majun Putih A1</option>
              <option value="PUTIH_C3">Majun Putih C3</option>
              <option value="WARNA_A1">Majun Warna A1</option>
              <option value="WARNA_B2">Majun Warna B2</option>
              <option value="WARNA_C3">Majun Warna C3</option>
              <option value="AFVAL">Limbah Afval / BS</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                Bruto (Kg)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("grossWeight", { valueAsNumber: true })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-lg font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
              {errors.grossWeight && (
                <span className="text-xs text-rose-500 mt-1 block">
                  {errors.grossWeight.message}
                </span>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
                Tara (Kg)
              </label>
              <input
                type="number"
                step="0.01"
                {...register("tareWeight", { valueAsNumber: true })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-lg font-mono text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
              {errors.tareWeight && (
                <span className="text-xs text-rose-500 mt-1 block">
                  {errors.tareWeight.message}
                </span>
              )}
            </div>
          </div>

          <div className="bg-zinc-800/80 p-3 rounded border border-zinc-700">
            <span className="text-xs font-semibold uppercase text-zinc-400 block">
              Netto Riil (Kg)
            </span>
            <div className="text-2xl font-bold font-mono text-emerald-400">
              {watch("netWeight").toFixed(2)} kg
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-zinc-400 mb-1">
              Catatan / No. Timbangan
            </label>
            <input
              type="text"
              {...register("notes")}
              placeholder="Contoh: Bal #14 Karung Biru"
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-sm font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-700 text-white rounded text-sm font-medium"
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Bobot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}