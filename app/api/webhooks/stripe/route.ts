import { NextRequest, NextResponse } from "next/server";

/**
 * Stripe webhook endpoint — /api/webhooks/stripe
 *
 * Receives signed events from Stripe and processes billing state changes.
 * Currently scaffolded — activate by:
 *   1. Adding STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET to env vars
 *   2. Creating a webhook in Stripe Dashboard pointing to this endpoint
 *   3. Installing the Stripe SDK:  npm install stripe
 *   4. Replacing the stub below with real event handling
 *
 * Events to handle (post-beta):
 *   - checkout.session.completed  → unlock source connector for org
 *   - customer.subscription.deleted → revoke source connector access
 *   - invoice.payment_failed       → surface billing alert to exec
 */

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // If Stripe is not yet configured, return 200 to avoid Stripe retries
  if (!webhookSecret) {
    return NextResponse.json(
      { received: true, note: "Stripe not configured — set STRIPE_WEBHOOK_SECRET to activate" },
      { status: 200 }
    );
  }

  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json({ error: "Could not read request body" }, { status: 400 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  // ── Stripe SDK verification (activate when stripe package is installed) ──────
  // import Stripe from "stripe";
  // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // let event: Stripe.Event;
  // try {
  //   event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  // } catch (err) {
  //   return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  // }
  //
  // switch (event.type) {
  //   case "checkout.session.completed": {
  //     const session = event.data.object as Stripe.Checkout.Session;
  //     // TODO: unlock source connector for org using session.metadata
  //     break;
  //   }
  //   case "customer.subscription.deleted": {
  //     // TODO: revoke source connector access for org
  //     break;
  //   }
  //   case "invoice.payment_failed": {
  //     // TODO: surface billing alert in exec workspace
  //     break;
  //   }
  // }

  return NextResponse.json({ received: true });
}
