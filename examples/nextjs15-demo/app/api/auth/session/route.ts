import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken, SESSION_COOKIE, SESSION_STATE_COOKIE } from "../../../../lib/auth-server";

// Client bridge posts the real Keycloak access token here; we validate it against
// the realm JWKS before trusting it, then store it in an httpOnly cookie for
// Server Components. DELETE clears the session on logout.

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { access_token?: string } | null;
  const access_token = body?.access_token;
  if (!access_token) {
    return NextResponse.json({ error: "missing access_token" }, { status: 400 });
  }

  const claims = await verifyAccessToken(access_token);
  if (!claims) {
    return NextResponse.json({ error: "invalid token" }, { status: 401 });
  }

  const jar = await cookies();
  const secure = process.env.NODE_ENV === "production";
  const maxAge = Math.max(0, (claims.exp ?? 0) - Math.floor(Date.now() / 1000));

  jar.set(SESSION_COOKIE, access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });
  jar.set(SESSION_STATE_COOKIE, String(claims.sub ?? "anon"), {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge,
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.set(SESSION_STATE_COOKIE, "anon", { httpOnly: false, sameSite: "lax", path: "/", maxAge: 0 });
  return NextResponse.json({ ok: true });
}
