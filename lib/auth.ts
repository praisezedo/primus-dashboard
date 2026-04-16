import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function verifyAuth() {
  const token = (await cookies()).get("primus_token")?.value;

  if (!token) {
    throw new Error("Unauthenticated");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      adminId: string;
      schoolId: string;
    };
  } catch (error) {
    throw new Error("Invalid or expired authentication token");
  }

  return decoded;
}
