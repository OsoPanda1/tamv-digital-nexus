import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(JSON.stringify({ error: "Stripe not configured" }), { status: 500 });
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // Verify webhook signature if secret is configured
    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
      }
    } else {
      // For testing without signature verification
      event = JSON.parse(body);
    }

    console.log("Processing webhook event:", event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const credits = parseInt(session.metadata?.credits || "0");
        const packageName = session.metadata?.package_name;

        if (!userId || !credits) {
          console.error("Missing metadata in checkout session");
          break;
        }

        console.log(`Adding ${credits} TAU credits to user ${userId}`);

        // Get current wallet balance
        const { data: profile, error: profileError } = await supabaseAdmin
          .from("profiles")
          .select("wallet_balance")
          .eq("user_id", userId)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          break;
        }

        const currentBalance = profile?.wallet_balance || 0;
        const newBalance = currentBalance + credits;

        // Update wallet balance
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({ wallet_balance: newBalance })
          .eq("user_id", userId);

        if (updateError) {
          console.error("Error updating wallet:", updateError);
          break;
        }

        // Record transaction
        const { error: txError } = await supabaseAdmin
          .from("transactions")
          .insert({
            user_id: userId,
            amount: credits,
            transaction_type: "credit_purchase",
            status: "completed",
            currency: "TAU",
            metadata: {
              stripe_session_id: session.id,
              stripe_payment_intent: session.payment_intent,
              package_name: packageName,
              amount_paid_usd: (session.amount_total || 0) / 100,
            },
          });

        if (txError) {
          console.error("Error recording transaction:", txError);
        }

        // Create notification
        await supabaseAdmin
          .from("notifications")
          .insert({
            user_id: userId,
            title: "¡Compra exitosa! 🎉",
            message: `Has recibido ${credits} créditos TAU. Tu nuevo balance es ${newBalance} TAU.`,
            type: "purchase",
            category: "financial",
            priority: "high",
            emotional_tone: "celebration",
          });

        console.log(`Successfully processed purchase for user ${userId}: +${credits} TAU`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("Payment failed:", paymentIntent.id);
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("Charge refunded:", charge.id);
        
        // Handle refund logic if needed
        const metadata = charge.metadata;
        if (metadata?.user_id && metadata?.credits) {
          const userId = metadata.user_id;
          const creditsToRemove = parseInt(metadata.credits);

          // Get current balance
          const { data: profile } = await supabaseAdmin
            .from("profiles")
            .select("wallet_balance")
            .eq("user_id", userId)
            .single();

          if (profile) {
            const newBalance = Math.max(0, (profile.wallet_balance || 0) - creditsToRemove);
            
            await supabaseAdmin
              .from("profiles")
              .update({ wallet_balance: newBalance })
              .eq("user_id", userId);

            // Record refund transaction
            await supabaseAdmin
              .from("transactions")
              .insert({
                user_id: userId,
                amount: -creditsToRemove,
                transaction_type: "refund",
                status: "completed",
                currency: "TAU",
                metadata: {
                  stripe_charge_id: charge.id,
                  reason: "Refund processed",
                },
              });

            console.log(`Refund processed for user ${userId}: -${creditsToRemove} TAU`);
          }
        }
        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Webhook processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
