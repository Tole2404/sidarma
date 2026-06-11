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
