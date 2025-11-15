// deno-lint-ignore-file no-explicit-any
// Edge Function: create-notification
// Receives payloads from database triggers and persists notifications while fan-out to profiles.
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

interface NotificationPayload {
  user_id: string;
  type: string;
  actor_id?: string | null;
  build_id?: string | null;
  quote_id?: string | null;
  message_id?: string | null;
  payload?: Record<string, any>;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const url = Deno.env.get("SUPABASE_URL");

  if (!secret || !url) {
    console.error("Missing Supabase credentials");
    return new Response("Server misconfigured", { status: 500 });
  }

  const payload = (await req.json()) as NotificationPayload;

  const response = await fetch(`${url}/rest/v1/notifications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: secret,
      Authorization: `Bearer ${secret}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      user_id: payload.user_id,
      type: payload.type,
      actor_id: payload.actor_id ?? null,
      build_id: payload.build_id ?? null,
      quote_id: payload.quote_id ?? null,
      message_id: payload.message_id ?? null,
      payload: payload.payload ?? {},
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Failed to insert notification", response.status, text);
    return new Response(text, { status: response.status });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});
