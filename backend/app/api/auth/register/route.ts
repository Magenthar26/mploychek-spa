import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/utils/db";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const {username, password} = await request.json();

    if(!username || !password){
        return NextResponse.json({error:'Username and password are required.'}, {status: 400});
    }

    const checkUser = await pool.query('Select id from users where username=$1', [username]);
    if(checkUser && checkUser.rowCount!>0){
        return NextResponse.json({error: 'Username already taken.'}, {status: 409});
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query('insert into users (username, password_hash) values ($1, $2)', [username, passwordHash]);

    return NextResponse.json({message: 'User registered successfully.'}, {status: 201})

  } catch (error) {
    console.error("Registration error: ", error);
    return NextResponse.json(
      { error: "Internal Server error" },
      { status: 500 }
    );
  }
}
