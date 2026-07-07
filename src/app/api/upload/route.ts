import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    // Require authentication
    await requireAuth();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    // Validate file type (only allow images)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "File harus berupa gambar" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure the public/uploads directory exists
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {}

    // Generate a unique filename to prevent overwriting
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const originalName = file.name;
    const extension = originalName.split(".").pop();
    const fileName = `${uniqueSuffix}.${extension}`;
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Return the relative uploader path for frontend access
    const url = `/uploads/${fileName}`;
    return NextResponse.json({ success: true, url });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Gagal mengunggah file" }, { status: 500 });
  }
}
