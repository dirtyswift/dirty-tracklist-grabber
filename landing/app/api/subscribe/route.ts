import { NextResponse } from "next/server";
import { subscribeToNewsletter } from "@/lib/airtable";
import { CHROME_STORE_URL } from "@/lib/constants";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Body = {
  email?: unknown;
  lang?: unknown;
};

export async function POST(req: Request) {
  let payload: Body;
  try {
    payload = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const rawEmail = typeof payload.email === "string" ? payload.email : "";
  const email = rawEmail.trim().toLowerCase();
  const lang = payload.lang === "en" ? "en" : "fr";

  if (!EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }

  const userAgent = req.headers.get("user-agent") ?? undefined;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    undefined;

  let stored = true;
  try {
    await subscribeToNewsletter({ email, lang, userAgent, ip });
  } catch (err) {
    stored = false;
    console.error("Airtable subscribe error:", err);
  }

  return NextResponse.json(
    { url: CHROME_STORE_URL, stored },
    { status: 200 },
  );
}
