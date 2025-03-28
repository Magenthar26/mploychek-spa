import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        {
          error: "Username and password are required.",
        },
        { status: 400 }
      );
    }

    const result = await pool.query('select id, password_hash from users where username=$1', [username])
    if(result.rowCount===0){
        return NextResponse.json({error:'Invalid credentials'}, {status:401});
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match){
        return NextResponse.json({error:'Invalid credentials'}, {status: 401});
    }
    const token = jwt.sign({userId: user.id, username}, process.env.JWT_SECRET as string, {
        expiresIn:'1h'
    });

    return NextResponse.json({token})
  } catch (error) {
    console.error("Registration error: ", error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}
