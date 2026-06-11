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
  const [posts, setPosts] = useState<CareerPost[]>(PLACEHOLDER);
  const [selected, setSelected] = useState<CareerPost | null>(null);
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", coverLetter: "" });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch("/api/careers").then(r => r.json()).then(d => { if (Array.isArray(d) && d.length > 0) setPosts(d); }).catch(() => {});
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

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600"><Briefcase className="h-3 w-3" /> Karir</div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">Bergabung Bersama Kami</h1>
          <p className="mt-4 text-base text-zinc-500 max-w-lg mx-auto">CV. SIDARMA MAJUN terus berkembang. Kami mencari individu berdedikasi untuk bergabung dalam tim kami.</p>
        </div>

        {done && (
          <div className="mb-8 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5 shrink-0" /> Lamaran berhasil dikirim! Tim kami akan menghubungi Anda segera.
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {posts.map(p => (
            <div key={p.id} className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-zinc-950">{p.title}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="flex items-center gap-1 text-xs text-zinc-500"><MapPin className="h-3 w-3" />{p.location}</span>
                    <span className="flex items-center gap-1 text-xs text-zinc-500"><Clock className="h-3 w-3" />{p.type}</span>
                    <Badge variant="secondary" className="text-xs">{p.department}</Badge>
                  </div>
                </div>
                <Badge className="bg-emerald-600 text-white text-xs">Buka</Badge>
              </div>
              <p className="mt-3 text-sm text-zinc-500 line-clamp-2">{p.description}</p>
              <Button onClick={() => setSelected(p)} size="sm" className="mt-4 gap-2">Lamar <ArrowRight className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      </main>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-950">Lamar: {selected.title}</h3>
            <p className="mt-1 text-sm text-zinc-500">{selected.department} · {selected.location}</p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-medium text-zinc-700">Nama Lengkap *</label><Input required value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Nama Anda" /></div>
                <div className="space-y-1.5"><label className="text-xs font-medium text-zinc-700">No. HP *</label><Input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="08xxxxxxx" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-medium text-zinc-700">Email *</label><Input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@anda.com" /></div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-700">Surat Lamaran Singkat</label>
                <textarea rows={3} value={form.coverLetter} onChange={e => setForm(f => ({ ...f, coverLetter: e.target.value }))} placeholder="Ceritakan pengalaman Anda..." className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelected(null)}>Batal</Button>
                <Button type="submit" disabled={busy} className="flex-1 gap-2"><Send className="h-3.5 w-3.5" />{busy ? "Mengirim..." : "Kirim"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}
