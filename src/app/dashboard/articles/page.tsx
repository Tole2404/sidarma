"use client";

import { useEffect, useState } from "react";
import { BookOpen, Plus, Trash2, Eye, EyeOff, Calendar, Tag, RefreshCw, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import Modal from "@/components/Modal";
import RichTextEditor from "@/components/RichTextEditor";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  thumbnail: string | null;
  isPublished: boolean;
  publishedAt: string | null;
  createdAt: string;
}

const CATEGORIES = ["Blog", "Tips Industri", "Panduan Produk", "Lingkungan & ESG", "Berita"];

export default function DashboardArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Blog",
    thumbnail: "",
    isPublished: false
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/articles?admin=1");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memuat artikel.");
      } else if (Array.isArray(data)) {
        setArticles(data);
      } else {
        setError("Format data dari server tidak valid.");
      }
    } catch (err) {
      setError("Gagal memuat artikel. Silakan coba lagi.");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const autoSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingArticleId ? `/api/articles/${editingArticleId}` : "/api/articles";
      const method = editingArticleId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (!res.ok) {
        const d = await res.json();
        setError(d.error || "Gagal menyimpan");
      } else {
        handleCloseForm();
        load();
      }
    } catch {
      setError("Terjadi kesalahan");
    }
    setSaving(false);
  };

  const handleEdit = (a: Article) => {
    setEditingArticleId(a.id);
    setForm({
      title: a.title,
      slug: a.slug,
      excerpt: a.excerpt,
      content: a.content || "",
      category: a.category,
      thumbnail: a.thumbnail || "",
      isPublished: a.isPublished
    });
    setShowForm(true);
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

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingArticleId(null);
    setForm({ title: "", slug: "", excerpt: "", content: "", category: "Blog", thumbnail: "", isPublished: false });
    setError("");
  };

  return (
    <div>
      <PageHeader title="Artikel & Blog" description="Kelola konten artikel untuk website publik dan SEO" />

      {error && (
        <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-650 flex justify-between items-center">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={load} className="text-red-750 hover:bg-red-100 font-semibold h-8 py-1">Coba Lagi</Button>
        </div>
      )}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <Button variant="outline" size="sm" onClick={load} className="gap-2 w-full sm:w-auto justify-center"><RefreshCw className="h-3.5 w-3.5" />Refresh</Button>
        <Button onClick={() => {
          setEditingArticleId(null);
          setForm({ title: "", slug: "", excerpt: "", content: "", category: "Blog", thumbnail: "", isPublished: false });
          setShowForm(true);
        }} className="gap-2 w-full sm:w-auto justify-center"><Plus className="h-4 w-4" />Tulis Artikel Baru</Button>
      </div>

      {loading ? (
        <div className="grid gap-4">{[1,2,3].map(i => <div key={i} className="h-20 rounded-xl bg-zinc-100 animate-pulse" />)}</div>
      ) : articles.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 py-20 text-center">
          <BookOpen className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
          <p className="text-sm text-zinc-400">Belum ada artikel. Mulai tulis artikel pertama!</p>
          <Button onClick={() => {
            setEditingArticleId(null);
            setForm({ title: "", slug: "", excerpt: "", content: "", category: "Blog", thumbnail: "", isPublished: false });
            setShowForm(true);
          }} className="mt-4 gap-2"><Plus className="h-4 w-4" />Tulis Sekarang</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map(a => (
            <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200/80 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="min-w-0 flex-1 flex gap-3 sm:gap-4 items-center">
                {a.thumbnail && (
                  <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50 flex items-center justify-center dark:border-zinc-800 dark:bg-zinc-900">
                    <img src={a.thumbnail} alt={a.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50 truncate max-w-[200px] xs:max-w-[280px] sm:max-w-md">{a.title}</p>
                    <Badge variant={a.isPublished ? "default" : "secondary"} className={`text-xs shrink-0 ${a.isPublished ? "bg-emerald-600 text-white" : ""}`}>
                      {a.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{a.category}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(a.createdAt).toLocaleDateString("id-ID")}</span>
                    <span className="font-mono text-zinc-300 dark:text-zinc-500 truncate max-w-[150px] xs:max-w-[200px] sm:max-w-none">/artikel/{a.slug}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0 border-t pt-3 sm:border-t-0 sm:pt-0 border-zinc-100 dark:border-zinc-800 w-full sm:w-auto">
                <Button variant="ghost" size="icon" onClick={() => handleTogglePublish(a.id, a.isPublished)}
                  title={a.isPublished ? "Arsipkan (jadi Draft)" : "Publikasikan"}
                  className={a.isPublished ? "text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20" : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"}>
                  {a.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(a)} title="Edit Artikel" className="text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" asChild title="Lihat di website">
                  <a href={`/artikel/${a.slug}`} target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"><Eye className="h-4 w-4" /></a>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(a.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={handleCloseForm} title={editingArticleId ? "Edit Artikel" : "Tulis Artikel Baru"} size="4xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">{error}</div>}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Judul *</label>
            <Input required value={form.title} onChange={e => { const t = e.target.value; setForm(f => ({ ...f, title: t, slug: autoSlug(t) })); }} placeholder="Judul artikel..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Slug *</label>
              <Input required value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-artikel" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Kategori</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 px-3 py-2 text-base md:text-sm focus:border-zinc-400 focus:outline-none">
                {CATEGORIES.map(c => <option key={c} className="bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50">{c}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Gambar Cover (Thumbnail)</label>
            <div className="flex gap-3 items-center">
              {form.thumbnail && (
                <div className="h-10 w-16 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0 dark:border-zinc-800 dark:bg-zinc-900">
                  <img src={form.thumbnail} alt="Thumbnail Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <Input
                value={form.thumbnail}
                onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                placeholder="Masukkan URL gambar atau unggah file..."
                className="flex-1 text-sm"
              />
              <div className="relative shrink-0">
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("file", file);
                    try {
                      const res = await fetch("/api/upload", { method: "POST", body: formData });
                      const json = await res.json();
                      if (json.success && json.url) {
                        setForm(f => ({ ...f, thumbnail: json.url }));
                      } else {
                        alert(json.error || "Gagal mengunggah gambar");
                      }
                    } catch {
                      alert("Gagal mengunggah gambar");
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <Button type="button" variant="outline" size="sm" className="h-10 text-xs">
                  Upload File
                </Button>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Ringkasan (Excerpt) *</label>
            <textarea required rows={2} value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Ringkasan singkat artikel untuk SEO..." className="w-full rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 px-3 py-2 text-base md:text-sm focus:border-zinc-400 focus:outline-none resize-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Isi Artikel *</label>
            <RichTextEditor value={form.content} onChange={val => setForm(f => ({ ...f, content: val }))} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublished} onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))} className="rounded" />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Publikasikan sekarang</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button type="button" variant="outline" className="w-full sm:flex-1" onClick={handleCloseForm}>Batal</Button>
            <Button type="submit" disabled={saving} className="w-full sm:flex-1">{saving ? "Menyimpan..." : "Simpan Artikel"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
