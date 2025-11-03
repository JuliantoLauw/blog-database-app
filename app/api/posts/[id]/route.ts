import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _: Request, { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { 
      id: Number(id) 
    },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(
  _: Request, { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.post.delete({
      where: { id: Number(id) },
    });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
    } catch (error: unknown) {
    console.error("Delete error:", error);

    const prismaError = error as { code?: string };

    if (prismaError.code === "P2025") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
    }
}

export async function PUT(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content } = await _.json();

    if (!title || !content) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: { title, content },
    });

    return NextResponse.json(updatedPost);
    } catch (error: unknown) {
    console.error("Update error:", error);

    const prismaError = error as { code?: string };

    if (prismaError.code === "P2025") {
        return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
    }
}
