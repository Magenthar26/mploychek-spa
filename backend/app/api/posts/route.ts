import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import { verifyUser } from "@/app/utils/general";


export async function GET() {
  try {
    const result = await pool.query(
      "select id, title, content, user_id from posts"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch Posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, content } = await request.json();
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "insert into posts (title, content, user_id) values ($1, $2, $3) returning id, title, content, user_id",
      [title, content, user.userId]
    );
    const newPost = result.rows[0];
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Failed to create Post" },
      { status: 500 }
    );
  }
}
