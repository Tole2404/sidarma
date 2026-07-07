import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

type Props = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Props) {
  try {
    await requireAuth();
    const { id } = await params;
    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Props) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const { isPublished } = body;

    const article = await prisma.article.update({
      where: { id },
      data: {
        isPublished: !!isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });
    return NextResponse.json(article);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Props) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await req.json();
    const { title, slug, excerpt, content, category, thumbnail, isPublished } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "Judul, slug, dan isi konten diperlukan" }, { status: 400 });
    }

    // Check slug uniqueness (excluding current article)
    const existing = await prisma.article.findFirst({
      where: {
        slug,
        id: { not: id }
      }
    });
    if (existing) {
      return NextResponse.json({ error: "Slug sudah digunakan oleh artikel lain" }, { status: 400 });
    }

    const currentArticle = await prisma.article.findUnique({ where: { id } });
    if (!currentArticle) {
      return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    }

    let publishedAt = currentArticle.publishedAt;
    if (isPublished !== undefined) {
      if (isPublished && !currentArticle.isPublished) {
        publishedAt = new Date();
      } else if (!isPublished) {
        publishedAt = null;
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        category: category || "Blog",
        thumbnail: thumbnail || null,
        isPublished: isPublished !== undefined ? !!isPublished : currentArticle.isPublished,
        publishedAt,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}
