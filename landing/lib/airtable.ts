import { AIRTABLE_BASE_ID, AIRTABLE_TABLE_ID } from "@/lib/constants";

type SubscribeArgs = {
  email: string;
  lang: "fr" | "en";
  userAgent?: string;
  ip?: string;
};

export async function subscribeToNewsletter({
  email,
  lang,
  userAgent,
  ip,
}: SubscribeArgs): Promise<void> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    throw new Error("AIRTABLE_API_KEY manquante");
  }

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        records: [
          {
            fields: {
              Email: email,
              Source: "site-newsletter",
              Lang: lang,
              "Created at": new Date().toISOString(),
              ...(userAgent ? { "User agent": userAgent } : {}),
              ...(ip ? { IP: ip } : {}),
            },
          },
        ],
        typecast: true,
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Airtable ${res.status}: ${body}`);
  }
}
