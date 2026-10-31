import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const WORKSPACE_ROOT = process.cwd();
const BASE_ARTIFACTS_DIR = path.join(WORKSPACE_ROOT, "src", "generated-artifacts");

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export async function GET(req: NextRequest) {
  try {
    ensureDirectoryExists(BASE_ARTIFACTS_DIR);
    ensureDirectoryExists(path.join(WORKSPACE_ROOT, "src", "components"));
    ensureDirectoryExists(path.join(WORKSPACE_ROOT, "docs"));
    ensureDirectoryExists(path.join(WORKSPACE_ROOT, "sql"));
    ensureDirectoryExists(path.join(WORKSPACE_ROOT, "reports"));

    const filesList: any[] = [];
    const seenRelativePaths = new Set<string>();

    function scanDir(currentPath: string, baseRelative: string, defaultCategory: string) {
      if (!fs.existsSync(currentPath)) return;
      try {
        const entries = fs.readdirSync(currentPath, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(currentPath, entry.name);
          const relPath = path.join(baseRelative, entry.name).replace(/\\/g, "/");

          if (entry.isDirectory()) {
            // Avoid deep node_modules or system folders
            if (["node_modules", ".next", ".git"].includes(entry.name)) continue;
            scanDir(fullPath, relPath, defaultCategory);
          } else if (entry.isFile()) {
            if (seenRelativePaths.has(relPath)) continue;
            seenRelativePaths.add(relPath);

            const stats = fs.statSync(fullPath);
            const ext = path.extname(entry.name).toLowerCase();
            let category = defaultCategory;
            if (ext === ".tsx" || ext === ".jsx") category = "component";
            else if (ext === ".ts" || ext === ".js") category = "code";
            else if (ext === ".sql") category = "sql";
            else if (ext === ".csv" || ext === ".json") category = "report";
            else if (ext === ".md") category = "document";

            let preview = "";
            try {
              preview = fs.readFileSync(fullPath, "utf-8");
            } catch {}

            filesList.push({
              id: entry.name + "-" + stats.mtimeMs,
              fileName: entry.name,
              relativePath: relPath,
              absolutePath: fullPath,
              category,
              sizeBytes: stats.size,
              updatedAt: stats.mtime.toISOString(),
              content: preview,
            });
          }
        }
      } catch (e) {
        console.error("Error scanning dir:", currentPath, e);
      }
    }

    // Scan appropriate project folders inside DARMIN
    scanDir(path.join(WORKSPACE_ROOT, "src", "components"), "src/components", "component");
    scanDir(path.join(WORKSPACE_ROOT, "docs"), "docs", "document");
    scanDir(path.join(WORKSPACE_ROOT, "sql"), "sql", "sql");
    scanDir(path.join(WORKSPACE_ROOT, "reports"), "reports", "report");
    scanDir(BASE_ARTIFACTS_DIR, "src/generated-artifacts", "component");

    // Sort newest first
    filesList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json({
      success: true,
      directory: "c:/DARMIN",
      totalFiles: filesList.length,
      files: filesList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal memuat berkas artefak." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, content, category = "components", targetFolder } = body;

    if (!fileName || !content) {
      return NextResponse.json(
        { success: false, error: "Nama file dan konten wajib diisi." },
        { status: 400 }
      );
    }

    // Sanitize filename to prevent directory traversal
    const safeName = path.basename(fileName);
    const ext = path.extname(safeName).toLowerCase();

    // Map to the appropriate folder inside c:\DARMIN
    let chosenFolder = targetFolder || "";
    let chosenCategory = category;

    if (!chosenFolder) {
      if (
        category === "components" ||
        category === "component" ||
        ext === ".tsx" ||
        ext === ".jsx"
      ) {
        chosenFolder = path.join("src", "components");
        chosenCategory = "components";
      } else if (
        category === "docs" ||
        category === "document" ||
        ext === ".md"
      ) {
        chosenFolder = "docs";
        chosenCategory = "docs";
      } else if (category === "sql" || ext === ".sql") {
        chosenFolder = "sql";
        chosenCategory = "sql";
      } else if (
        category === "reports" ||
        category === "report" ||
        ext === ".csv" ||
        ext === ".json"
      ) {
        chosenFolder = "reports";
        chosenCategory = "reports";
      } else {
        chosenFolder = path.join("src", "components");
      }
    }

    const folderPath = path.resolve(WORKSPACE_ROOT, chosenFolder);
    ensureDirectoryExists(folderPath);

    const targetFilePath = path.resolve(folderPath, safeName);

    // STRICT SAFETY CHECK: Must NEVER exit the DARMIN project folder
    if (!targetFilePath.startsWith(WORKSPACE_ROOT)) {
      return NextResponse.json(
        { success: false, error: "Akses folder di luar workspace DARMIN ditolak." },
        { status: 403 }
      );
    }

    // Extract clean code if LLM wrapped it inside markdown code blocks
    let cleanContent = content;
    if ([".tsx", ".jsx", ".ts", ".js", ".sql", ".json"].includes(ext)) {
      const codeBlockRegex = /```(?:tsx|typescript|jsx|javascript|sql|json)?\s*([\s\S]*?)```/i;
      const match = content.match(codeBlockRegex);
      if (match && match[1]) {
        cleanContent = match[1].trim();
      }
    }

    // Write file directly into the appropriate destination folder inside DARMIN
    fs.writeFileSync(targetFilePath, cleanContent, "utf-8");

    // Also mirror to src/generated-artifacts/[category] for backwards compatibility
    try {
      const mirrorSubdir = chosenCategory === "docs" ? "docs" : chosenCategory === "sql" ? "sql" : chosenCategory === "reports" ? "reports" : "components";
      const mirrorFolder = path.join(BASE_ARTIFACTS_DIR, mirrorSubdir);
      ensureDirectoryExists(mirrorFolder);
      fs.writeFileSync(path.join(mirrorFolder, safeName), cleanContent, "utf-8");
    } catch {}

    const relPath = path.relative(WORKSPACE_ROOT, targetFilePath).replace(/\\/g, "/");

    return NextResponse.json({
      success: true,
      message: `File berhasil disimpan langsung ke ${relPath}`,
      fileName: safeName,
      relativePath: relPath,
      absolutePath: targetFilePath,
      category: chosenCategory,
      sizeBytes: Buffer.byteLength(cleanContent, "utf-8"),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Gagal menyimpan berkas ke disk." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const relPath = searchParams.get("path");

    if (!relPath) {
      return NextResponse.json({ success: false, error: "Path file wajib diisi." }, { status: 400 });
    }

    const targetFilePath = path.resolve(WORKSPACE_ROOT, relPath);

    // Strictly ensure inside project workspace
    if (!targetFilePath.startsWith(WORKSPACE_ROOT)) {
      return NextResponse.json({ success: false, error: "Dilarang menghapus di luar folder DARMIN." }, { status: 403 });
    }

    if (fs.existsSync(targetFilePath)) {
      fs.unlinkSync(targetFilePath);
    }

    return NextResponse.json({ success: true, message: "File berhasil dihapus." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || "Gagal menghapus file." }, { status: 500 });
  }
}
