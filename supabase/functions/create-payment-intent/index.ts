// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.7.0?target=deno";

const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeSecret) {
  console.error("Missing STRIPE_SECRET_KEY env variable");
}

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2023-10-16" }) : null;
const successUrl = Deno.env.get("SPEC_CHECKOUT_SUCCESS_URL");
const cancelUrl = Deno.env.get("SPEC_CHECKOUT_CANCEL_URL");

serve(async (req) => {
  if (!stripe || !supabaseUrl || !serviceRoleKey) {
    return new Response("Server misconfigured", { status: 500 });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const { amount, currency = "usd", quoteId, payerId } = await req.json();

  if (!amount || !quoteId || !payerId) {
    return new Response("Missing required fields", { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    success_url: successUrl ?? "https://spec.build/success",
    cancel_url: cancelUrl ?? "https://spec.build/cancel",
    payment_intent_data: {
      metadata: {
        quote_id: String(quoteId),
        payer_id: String(payerId),
      },
    },
    metadata: {
      quote_id: String(quoteId),
      payer_id: String(payerId),
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency,
          product_data: {
            name: `SPEC quote ${quoteId}`,
          },
          unit_amount: amount,
        },
      },
    ],
  });

  const upsertResponse = await fetch(`${supabaseUrl}/rest/v1/payment_transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      quote_id: quoteId,
      payer_id: payerId,
      amount,
      currency,
      status: "requires_payment_method",
      stripe_payment_intent: session.payment_intent ?? null,
    }),
  });

  if (!upsertResponse.ok) {
    const errorPayload = await upsertResponse.text();
    console.error("Failed to record payment intent", errorPayload);
  }

  return new Response(JSON.stringify({ checkoutUrl: session.url ?? null }), {
    headers: { "Content-Type": "application/json" },
  });
});
