import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "1";

    const articles = await prisma.article.findMany({
      where: adminMode ? undefined : { isPublished: true },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        category: true,
        thumbnail: true,
        isPublished: true,
        publishedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const { title, slug, excerpt, content, category, thumbnail, isPublished } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: "title, slug, content diperlukan" }, { status: 400 });
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt: excerpt || "",
        content,
        category: category || "Blog",
        thumbnail: thumbnail || null,
        isPublished: !!isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
