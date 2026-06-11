"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Users, MapPin, Clock, CheckCircle2, XCircle, ChevronRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";

interface CareerPost { id: string; title: string; department: string; location: string; type: string; isActive: boolean; createdAt: string; _count?: { applications: number }; }
interface Application { id: string; fullName: string; email: string; phone: string; coverLetter: string | null; status: string; createdAt: string; }

const STATUS_COLORS: Record<string, string> = { Pending: "bg-amber-50 text-amber-700 border-amber-200", Reviewed: "bg-blue-50 text-blue-700 border-blue-200", Hired: "bg-emerald-50 text-emerald-700 border-emerald-200", Rejected: "bg-red-50 text-red-700 border-red-200" };

export default function DashboardCareersPage() {
  const [posts, setPosts] = useState<CareerPost[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedPost, setSelectedPost] = useState<CareerPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", department: "", location: "Bandung, Jawa Barat", jobType: "Full-time", description: "", requirements: "" });
  const [saving, setSaving] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/careers").then(r => r.json());
      if (Array.isArray(data)) setPosts(data);
    } catch {}
    setLoading(false);
  };

  const loadApplications = async (postId: string) => {
    try {
      const data = await fetch(`/api/careers/${postId}/applications`).then(r => r.json());
      if (Array.isArray(data)) setApplications(data);
    } catch {}
  };

  useEffect(() => { loadPosts(); }, []);
  useEffect(() => { if (selectedPost) loadApplications(selectedPost.id); else setApplications([]); }, [selectedPost]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await fetch("/api/careers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) }).catch(() => {});
    setSaving(false); setShowForm(false); setForm({ title: "", department: "", location: "Bandung, Jawa Barat", jobType: "Full-time", description: "", requirements: "" }); loadPosts();
  };

  return (
    <div>
      <PageHeader title="Karir & Pelamar" description="Kelola lowongan kerja dan lihat daftar pelamar masuk" />

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Posts */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700">Lowongan Aktif ({posts.length})</p>
            <Button size="sm" onClick={() => setShowForm(true)} className="gap-1.5"><Plus className="h-3.5 w-3.5" />Tambah</Button>
          </div>
          {loading ? <div className="h-40 rounded-xl bg-zinc-100 animate-pulse" /> : posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-200 py-12 text-center">
              <Briefcase className="mx-auto mb-2 h-8 w-8 text-zinc-300" />
              <p className="text-sm text-zinc-400">Belum ada lowongan</p>
            </div>
          ) : (
            posts.map(p => (
              <button key={p.id} onClick={() => setSelectedPost(selectedPost?.id === p.id ? null : p)}
                className={`w-full rounded-xl border p-4 text-left transition-all hover:shadow-sm ${selectedPost?.id === p.id ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white"}`}>
                <div className="flex items-start justify-between">
                  <p className={`text-sm font-semibold ${selectedPost?.id === p.id ? "text-white" : "text-zinc-950"}`}>{p.title}</p>
                  <Badge className={selectedPost?.id === p.id ? "bg-white text-zinc-950 text-xs" : "bg-emerald-600 text-white text-xs"}>{p._count?.applications ?? 0} pelamar</Badge>
                </div>
                <div className={`mt-2 flex flex-wrap gap-2 text-xs ${selectedPost?.id === p.id ? "text-zinc-400" : "text-zinc-500"}`}>
                  <span>{p.department}</span><span>·</span><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>
                </div>
                {selectedPost?.id === p.id && <ChevronRight className="mt-2 h-4 w-4 text-zinc-400" />}
              </button>
            ))
          )}
        </div>

        {/* Right: Applications */}
        <div className="lg:col-span-3">
          {!selectedPost ? (
            <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
              <div>
                <Users className="mx-auto mb-3 h-10 w-10 text-zinc-200" />
                <p className="text-sm text-zinc-400">Pilih lowongan untuk melihat daftar pelamar.</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm font-medium text-zinc-700">Pelamar: {selectedPost.title}</p>
              {applications.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 py-16 text-center">
                  <Users className="mx-auto mb-2 h-8 w-8 text-zinc-200" />
                  <p className="text-sm text-zinc-400">Belum ada pelamar untuk posisi ini.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map(a => (
                    <div key={a.id} className="rounded-xl border border-zinc-200 bg-white p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-semibold text-zinc-950">{a.fullName}</p>
                          <p className="text-xs text-zinc-500">{a.email} · {a.phone}</p>
                        </div>
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[a.status] ?? STATUS_COLORS.Pending}`}>{a.status}</span>
                      </div>
                      {a.coverLetter && <p className="mt-3 text-xs text-zinc-500 line-clamp-3 italic">"{a.coverLetter}"</p>}
                      <p className="mt-2 text-xs text-zinc-400">{new Date(a.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Tambah Lowongan Kerja">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2"><label className="text-xs font-medium text-zinc-700">Nama Posisi *</label><Input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="cth: Penjahit Kain Majun" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-zinc-700">Departemen *</label><Input required value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} placeholder="cth: Produksi" /></div>
            <div className="space-y-1.5"><label className="text-xs font-medium text-zinc-700">Lokasi</label><Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} /></div>
          </div>
          <div className="space-y-1.5"><label className="text-xs font-medium text-zinc-700">Deskripsi Pekerjaan *</label><textarea required rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Jelaskan tugas dan tanggung jawab posisi ini..." className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none resize-none" /></div>
          <div className="space-y-1.5"><label className="text-xs font-medium text-zinc-700">Persyaratan *</label><textarea required rows={3} value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} placeholder="- Pengalaman min. 1 tahun&#10;- Teliti dan rajin" className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Batal</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? "Menyimpan..." : "Simpan Lowongan"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
