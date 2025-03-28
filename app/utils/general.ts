import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

export async function verifyUser(
    request: NextRequest
  ): Promise<{ userId: string; username: string } | null> {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.slice(7);
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET as string);
      return payload as { userId: string; username: string };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  