"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  Eye,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PreviewClientProps {
  slug: string;
  fileName: string;
  rawContent: string;
  fileExt: string;
}

export default function PreviewClient({
  slug,
  fileName,
  rawContent,
  fileExt,
}: PreviewClientProps) {
  const [activeTab, setActiveTab] = useState<"render" | "code">("render");
  const [deviceViewport, setDeviceViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [copied, setCopied] = useState(false);

  // Clean raw code: remove leading "html\n", code fences, etc.
  const cleanedHtml = useMemo(() => {
    let clean = rawContent.trim();
    // Strip leading code fence
    clean = clean.replace(/^```[a-z]*\s*/i, "");
    clean = clean.replace(/\s*```$/, "");
    // Strip leading "html" single line keyword
    if (clean.startsWith("html\n") || clean.startsWith("html\r\n")) {
      clean = clean.replace(/^html\r?\n/, "");
    }
    return clean.trim();
  }, [rawContent]);

  // Construct self-contained iframe document with Tailwind CSS CDN
  const iframeSrcDoc = useMemo(() => {
    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName} Preview</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: '#0284c7',
          }
        }
      }
    }
  </script>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 16px;
      background-color: #f8fafc;
      color: #0f172a;
    }
  </style>
</head>
<body>
  ${cleanedHtml}
</body>
</html>`;
  }, [cleanedHtml, fileName]);

  const viewportWidthClass = {
    desktop: "w-full max-w-full",
    tablet: "w-[768px] mx-auto shadow-2xl rounded-2xl border border-slate-700",
    mobile: "w-[390px] mx-auto shadow-2xl rounded-3xl border-4 border-slate-800",
  }[deviceViewport];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/agentic-ai"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="font-bold">Kembali ke Dashboard</span>
          </Link>
          <div className="h-5 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-slate-100">{fileName}</span>
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] font-mono">
              Live Route Aktif
            </Badge>
          </div>
        </div>

        {/* Viewport Toggles (Render mode only) */}
        {activeTab === "render" && (
          <div className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDeviceViewport("desktop")}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                deviceViewport === "desktop"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDeviceViewport("tablet")}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                deviceViewport === "tablet"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDeviceViewport("mobile")}
              className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-all ${
                deviceViewport === "mobile"
                  ? "bg-blue-600 text-white font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
          </div>
        )}

        {/* Right Tab Toggle (Render vs Code) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("render")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "render"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Tampilan Live</span>
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                activeTab === "code"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Kode Sumber</span>
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(rawContent);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
            className="h-8 text-xs bg-slate-900 border-slate-800 text-slate-300 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
            {copied ? "Tersalin" : "Salin"}
          </Button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-950">
        {activeTab === "render" ? (
          <div className={`transition-all duration-300 flex-1 w-full flex flex-col ${viewportWidthClass}`}>
            <div className="bg-slate-900 border border-slate-800 rounded-t-xl px-4 py-2 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="font-mono text-[11px] ml-2 text-slate-400">http://localhost:3000/preview/{slug}</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Siap Digunakan & Diinteraksikan
              </span>
            </div>

            <iframe
              title={fileName}
              srcDoc={iframeSrcDoc}
              className="w-full flex-1 min-h-[620px] bg-white rounded-b-xl border border-t-0 border-slate-800 shadow-2xl"
              sandbox="allow-scripts allow-forms allow-same-origin"
            />
          </div>
        ) : (
          <div className="w-full max-w-5xl flex-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <span className="font-mono text-slate-400">{fileName}</span>
              <span className="text-slate-500 text-[11px]">Format: {fileExt || "code"}</span>
            </div>
            <pre className="p-4 overflow-x-auto flex-1 font-mono text-xs text-slate-200 leading-relaxed max-h-[75vh] overflow-y-auto">
              {rawContent}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
