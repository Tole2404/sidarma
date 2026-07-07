import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    // Check if careers page is active in settings
    const setting = await prisma.landingSetting.findFirst({
      where: { section: "karir", key: "active" },
    });
    const isPageActive = setting ? setting.value === "true" : true; // default to true
 
    if (!isPageActive) {
      return NextResponse.json([]);
    }
 
    const posts = await prisma.careerPost.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type } = body;

    if (type === "application") {
      // Public: Submit job application
      const { postId, fullName, email, phone, coverLetter } = body;
      if (!postId || !fullName || !email || !phone) {
        return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
      }
      const application = await prisma.careerApplication.create({
        data: { postId, fullName, email, phone, coverLetter: coverLetter || null },
      });
      return NextResponse.json(application, { status: 201 });
    }

    // Admin: Create career post
    await requireAuth();
    const { title, department, location, jobType, description, requirements } = body;
    if (!title || !department || !description || !requirements) {
      return NextResponse.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }
    const post = await prisma.careerPost.create({
      data: { title, department, location: location || "Bandung, Jawa Barat", type: jobType || "Full-time", description, requirements },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
