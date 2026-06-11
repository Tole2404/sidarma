import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch testimonials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAuth();
    const body = await req.json();
    const { name, company, role, content, rating, avatar, isFeatured } = body;

    if (!name || !company || !content) {
      return NextResponse.json({ error: "name, company, content diperlukan" }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        company,
        role: role || null,
        content,
        rating: Number(rating) || 5,
        avatar: avatar || null,
        isFeatured: !!isFeatured,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create testimonial" }, { status: 500 });
  }
}
