import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import { verifyUser } from "@/app/utils/general";
// testing testing 2
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const postId = Number(id);

  try {
    const { content } = await request.json();
    const response = await pool.query("select * from posts where id=$1", [
      postId,
    ]);
    if (response.rowCount! < 1) {
      return NextResponse.json({ message: "Invalid post Id" }, { status: 404 });
    }
    await pool.query("update posts set  content=$1 where id=$2", [
      content,
      postId,
    ]);
    return NextResponse.json({ message: "Post Updated" });
  } catch (error) {
    console.error("Error updated post:", error);
    return NextResponse.json(
      { error: "Failed to update Post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await verifyUser(request);

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const postId = Number(id);
  try {
    await pool.query("Delete from posts where id=$1", [postId]);
    return NextResponse.json({ message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "Failed to delete Post" },
      { status: 500 }
    );
  }
}
