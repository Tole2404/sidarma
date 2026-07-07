"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Briefcase, MapPin, Clock, CheckCircle2, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SiteNavbar from "@/components/SiteNavbar";
import SiteFooter from "@/components/SiteFooter";

interface CareerPost { id: string; title: string; department: string; location: string; type: string; description: string; requirements: string; }

const PLACEHOLDER: CareerPost[] = [
  { id: "1", title: "Penjahit Kain Majun", department: "Produksi", location: "Bandung, Jawa Barat", type: "Full-time", description: "Kami mencari penjahit berpengalaman untuk proses jahit sambung dan jahit tumpuk kain majun.", requirements: "Pengalaman menjahit min. 1 tahun, bisa mesin industri, teliti." },
  { id: "2", title: "Staf Sortir & Quality Control", department: "Gudang & QC", location: "Bandung, Jawa Barat", type: "Full-time", description: "Menyortir kain majun, memisahkan berdasarkan jenis dan warna, memastikan standar kualitas.", requirements: "Teliti, target-driven, sehat jasmani, min. SMP." },
  { id: "3", title: "Sales Marketing B2B", department: "Pemasaran", location: "Jawa Barat", type: "Full-time", description: "Mencari klien dari kalangan pabrik, bengkel, hotel. Mengelola hubungan pelanggan dan target penjualan.", requirements: "Pengalaman sales B2B min. 1 tahun, punya kendaraan, komunikatif." },
];

export default function KarirPage() {
  const [posts, setPosts] = useState<CareerPost[]>([]);
  const [selected, setSelected] = useState<CareerPost | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", coverLetter: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
 
  useEffect(() => {
    fetch("/api/careers").then(r => r.json()).then(d => { if (Array.isArray(d)) setPosts(d); }).catch(() => {});
  }, []);
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!selected) return;
    setBusy(true);
    await fetch("/api/careers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "application", postId: selected.id, ...form }) }).catch(() => {});
    setBusy(false); setDone(true); setSelected(null); setForm({ fullName: "", email: "", phone: "", coverLetter: "" });
  };
 
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <SiteNavbar />
 
      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-655 dark:text-zinc-300">
            <Briefcase className="h-3 w-3" /> Karir
          </div>
          <h1 className="text-2xl xs:text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-955 dark:text-white">
            Bergabung Bersama Kami
          </h1>
          <p className="mt-3 text-xs sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
            CV. SIDARMA MAJUN terus berkembang. Kami mencari individu berdedikasi untuk bergabung dalam tim kami.
          </p>
        </div>
 
        {done && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> Lamaran berhasil dikirim! Tim kami akan menghubungi Anda segera.
          </div>
        )}
 
        {posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-16 px-6 text-center max-w-lg mx-auto shadow-sm">
            <Briefcase className="mx-auto mb-3 h-10 w-10 text-zinc-350 dark:text-zinc-700" />
            <p className="text-base font-bold text-zinc-955 dark:text-zinc-50 mb-1">Belum Ada Lowongan Tersedia</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">Saat ini rekrutmen sedang ditutup. Silakan cek kembali nanti atau hubungi kami melalui kontak resmi.</p>
          </div>
        ) : (
          <div className="grid gap-3.5 lg:grid-cols-2">
            {posts.map(p => (
              <div key={p.id} className="rounded-2xl border border-zinc-200/80 bg-white dark:bg-zinc-900 dark:border-zinc-800 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-sm sm:text-lg font-bold text-zinc-955 dark:text-zinc-50 leading-snug">{p.title}</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-455"><MapPin className="h-3 w-3" />{p.location}</span>
                        <span className="flex items-center gap-1 text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-455"><Clock className="h-3 w-3" />{p.type}</span>
                        <Badge variant="secondary" className="text-[10px] sm:text-xs dark:bg-zinc-800 dark:text-zinc-350">{p.department}</Badge>
                      </div>
                    </div>
                    <Badge className="bg-emerald-600 text-white text-[10px] sm:text-xs py-0.5 px-2 shrink-0">Buka</Badge>
                  </div>
                  <p className="mt-3 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">{p.description}</p>
                </div>
                <div className="mt-4 flex">
                  <Button onClick={() => setSelected(p)} className="gap-1.5 h-8 text-xs py-1.5 rounded-lg font-bold">
                    Lamar <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
 
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 sm:p-6 shadow-xl">
            <h3 className="text-base sm:text-lg font-bold text-zinc-955 dark:text-zinc-50">Lamar: {selected.title}</h3>
            <p className="mt-0.5 text-xs sm:text-sm text-zinc-400 dark:text-zinc-500">{selected.department} · {selected.location}</p>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1"><label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Nama Lengkap *</label><Input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Nama Anda" className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">No. HP *</label><Input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="08xxxxxxx" className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" /></div>
              </div>
              <div className="space-y-1"><label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Email *</label><Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@anda.com" className="dark:bg-zinc-950 dark:border-zinc-800 dark:text-white" /></div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Surat Lamaran Singkat</label>
                <textarea rows={3} value={form.coverLetter} onChange={e => setForm(f => ({ ...f, coverLetter: e.target.value }))} placeholder="Ceritakan pengalaman Anda..." className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs sm:text-sm focus:border-zinc-400 dark:focus:border-zinc-700 focus:outline-none resize-none dark:text-white" />
              </div>
              <div className="flex gap-2.5 pt-1">
                <Button type="button" variant="outline" className="flex-1 h-9 text-xs rounded-lg font-bold" onClick={() => setSelected(null)}>Batal</Button>
                <Button type="submit" disabled={busy} className="flex-1 gap-1.5 h-9 text-xs rounded-lg font-bold">{busy ? "Mengirim..." : "Kirim"}<Send className="h-3 w-3" /></Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
