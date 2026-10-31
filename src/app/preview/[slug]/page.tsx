import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import PreviewClient from "./PreviewClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function findArtifactFile(slug: string): { fileName: string; content: string; ext: string } | null {
  const searchDirs = [
    path.join(process.cwd(), "src", "generated-artifacts", "components"),
    path.join(process.cwd(), "src", "components"),
    path.join(process.cwd(), "src", "generated-artifacts", "docs"),
    path.join(process.cwd(), "src", "generated-artifacts", "reports"),
    path.join(process.cwd(), "src", "generated-artifacts", "sql"),
  ];

  const normalizedSlug = slug.toLowerCase().replace(/[^a-z0-9]/g, "");

  for (const dir of searchDirs) {
    if (!fs.existsSync(dir)) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const baseName = path.basename(entry.name, path.extname(entry.name));
      const normBase = baseName.toLowerCase().replace(/[^a-z0-9]/g, "");

      if (normBase === normalizedSlug || baseName.toLowerCase() === slug.toLowerCase()) {
        const fullPath = path.join(dir, entry.name);
        try {
          const content = fs.readFileSync(fullPath, "utf-8");
          return {
            fileName: entry.name,
            content,
            ext: path.extname(entry.name).toLowerCase(),
          };
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

export default async function PreviewSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const artifact = findArtifactFile(slug);

  if (!artifact) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md shadow-2xl">
          <div className="h-12 w-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            404
          </div>
          <h1 className="text-lg font-bold mb-2">Komponen Tidak Ditemukan</h1>
          <p className="text-xs text-slate-400 mb-6 font-mono leading-relaxed">
            Tidak ada berkas yang cocok dengan slug &ldquo;<span className="text-rose-400">{slug}</span>&rdquo; di direktori artefak.
          </p>
          <a
            href="/dashboard/agentic-ai"
            className="inline-flex items-center justify-center h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all"
          >
            Kembali ke Dashboard Agentic
          </a>
        </div>
      </div>
    );
  }

  return (
    <PreviewClient
      slug={slug}
      fileName={artifact.fileName}
      rawContent={artifact.content}
      fileExt={artifact.ext}
    />
  );
}
