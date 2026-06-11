"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Eye, EyeOff, Calendar, Tag, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";

interface Article { id: string; title: string; slug: string; excerpt: string; category: string; isPublished: boolean; publishedAt: string | null; createdAt: string; }

const CATEGORIES = ["Blog", "Tips Industri", "Panduan Produk", "Lingkungan & ESG", "Berita"];

export default function DashboardArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", content: "", category: "Blog", isPublished: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetch("/api/articles?admin=1").then(r => r.json());
      if (Array.isArray(data)) setArticles(data);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try {
      const res = await fetch("/api/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); setError(d.error || "Gagal menyimpan"); } else { setShowForm(false); setForm({ title: "", slug: "", excerpt: "", content: "", category: "Blog", isPublished: false }); load(); }
    } catch { setError("Terjadi kesalahan"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus artikel ini?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    load();
  };

  const handleTogglePublish = async (id: string, current: boolean) => {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !current }),
    });
    load();
  };

  return (
    <div>
      <PageHeader title="Artikel & Blog" description="Kelola konten artikel untuk website publik dan SEO" />

      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={load} className="gap-2"><RefreshCw className="h-3.5 w-3.5" />Refresh</Button>
        <Button onClick={() => setShowForm(true)} className="gap-2"><Plus className="h-4 w-4" />Tulis Artikel Baru</Button>
      </div>

      {loading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-zinc-100 animate-pulse" />)}</div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-400">Belum ada artikel. Mulai tulis artikel pertama!</p>
          <Button onClick={() => setShowForm(true)} className="mt-4 gap-2"><Plus className="h-4 w-4" />Tulis Sekarang</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(a => (
            <div key={a.id} className="flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-zinc-950 truncate">{a.title}</p>
                  <Badge variant={a.isPublished ? "default" : "secondary"} className={`text-xs shrink-0 ${a.isPublished ? "bg-emerald-600 text-white" : ""}`}>
                    {a.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
                  <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{a.category}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(a.createdAt).toLocaleDateString("id-ID")}</span>
                  <span className="font-mono text-zinc-300">/artikel/{a.slug}</span>
                </div>
              </div>
              <div className="ml-4 flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(a.id, a.isPublished)}
                  title={a.isPublished ? "Arsipkan (jadi Draft)" : "Publikasikan"}
                  className={a.isPublished ? "text-amber-500 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}>
                  {a.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" asChild title="Lihat di website">
                  <a href={`/artikel/${a.slug}`} target="_blank" rel="noopener noreferrer"><Eye className="h-4 w-4" /></a>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Tulis Artikel Baru">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Judul *</label>
            <Input required value={form.title} onChange={e => { const t = e.target.value; setForm(f => ({ ...f, title: t, slug: autoSlug(t) })); }} placeholder="Judul artikel..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">Slug *</label>
              <Input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-artikel" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700">Kategori</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Ringkasan (Excerpt) *</label>
            <textarea required rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Ringkasan singkat artikel untuk SEO..." className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700">Isi Artikel (HTML) *</label>
            <textarea required rows={6} value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="<h2>Heading</h2><p>Konten artikel...</p>" className="w-full rounded-md border border-zinc-200 px-3 py-2 text-sm font-mono focus:border-zinc-400 focus:outline-none resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="rounded" />
            <span className="text-sm text-zinc-700">Publikasikan sekarang</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Batal</Button>
            <Button type="submit" disabled={saving} className="flex-1">{saving ? "Menyimpan..." : "Simpan Artikel"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
