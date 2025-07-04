// If you haven't already, install Stripe: npm install stripe
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, useCase, teamSize, role } = await req.json();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Boarding Pass" },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
      metadata: {
        fullName: fullName || "",
        email: email || "",
        useCase: useCase || "",
        teamSize: teamSize || "",
        role: role || "",
      },
      customer_email: email || undefined,
    });
    return NextResponse.json({ url: session.url });
  } catch (e: unknown) {
    const message = typeof e === "object" && e && "message" in e ? (e as { message: string }).message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
} 