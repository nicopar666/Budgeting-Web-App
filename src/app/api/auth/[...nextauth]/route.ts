import NextAuth from "next-auth";
import type { NextRequest } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rateLimit";

const authHandler = async (req: NextRequest) => {
  const ip = getClientIp(req);
  const { success, remaining, resetTime } = rateLimit(ip);

  if (!success) {
    return new Response(JSON.stringify({ error: "Too many attempts. Please try again later." }), {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((resetTime - Date.now()) / 1000)),
        'X-RateLimit-Remaining': String(remaining),
      },
    });
  }

  const { authOptions } = await import("@/lib/auth");
  // @ts-expect-error - NextAuth with App Router
  return NextAuth(req, authOptions);
};

export { authHandler as GET, authHandler as POST };
