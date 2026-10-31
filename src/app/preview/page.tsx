import fs from "fs";
import path from "path";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Code2, Sparkles, Layout } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PreviewIndexPage() {
  const dirs = [
    path.join(process.cwd(), "src", "generated-artifacts", "components"),
    path.join(process.cwd(), "src", "components"),
  ];

  const components: { fileName: string; slug: string; sizeKb: string }[] = [];
  const seen = new Set<string>();

  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (!e.isFile()) continue;
      const ext = path.extname(e.name).toLowerCase();
      if (![".tsx", ".jsx", ".html", ".ts"].includes(ext)) continue;
      if (seen.has(e.name)) continue;
      seen.add(e.name);

      const stats = fs.statSync(path.join(dir, e.name));
      const slug = e.name.replace(/\.[^/.]+$/, "");
      components.push({
        fileName: e.name,
        slug,
        sizeKb: (stats.size / 1024).toFixed(1),
      });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/dashboard/agentic-ai"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke Dashboard
              </Link>
              <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">
                Live Dynamic Router
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Layout className="h-6 w-6 text-cyan-400" />
              Galeri Route Live Komponen Agen AI
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Setiap komponen yang diciptakan oleh agen AI memiliki route aktif sendiri di bawah URL <code className="text-cyan-300">/preview/[nama-komponen]</code>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {components.map((c) => (
            <div
              key={c.fileName}
              className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl hover:border-cyan-500/50 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-300">
                    {c.sizeKb} KB
                  </Badge>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">● Aktif</span>
                </div>
                <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {c.fileName}
                </h3>
                <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">
                  /preview/{c.slug}
                </p>
              </div>

              <Link
                href={`/preview/${c.slug}`}
                className="mt-4 inline-flex items-center justify-center gap-1.5 h-9 rounded-lg bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white text-xs font-bold transition-all border border-cyan-500/30"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Buka Halaman Live
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
