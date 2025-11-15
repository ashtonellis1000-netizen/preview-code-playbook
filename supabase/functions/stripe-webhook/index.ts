// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.7.0?target=deno";

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecret) {
  console.error("Missing STRIPE_SECRET_KEY env variable");
}

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2023-10-16" }) : null;

serve(async (req) => {
  if (!stripe || !serviceRoleKey || !supabaseUrl) {
    return new Response("Server misconfigured", { status: 500 });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;

  try {
    if (!webhookSecret) {
      throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    }
    event = stripe.webhooks.constructEvent(payload, signature ?? "", webhookSecret);
  } catch (error) {
    console.error("Invalid webhook signature", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const recordResponse = await fetch(`${supabaseUrl}/rest/v1/stripe_webhook_events`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({
      event_id: event.id,
      type: event.type,
      payload: event,
      processed_at: event.type === "payment_intent.succeeded" ? new Date().toISOString() : null,
    }),
  });

  if (!recordResponse.ok) {
    const text = await recordResponse.text();
    console.error("Failed to persist webhook", text);
  }

  // Basic reaction for payment success: flag associated payment record
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const intentId = paymentIntent.id;

    await fetch(`${supabaseUrl}/rest/v1/payment_transactions?stripe_payment_intent=eq.${intentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        status: "succeeded",
      }),
    });
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
