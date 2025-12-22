import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Payment system not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      console.error("Auth error:", authError);
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { priceId, credits, packageName, userId } = await req.json();

    if (!priceId || !credits || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify user ID matches authenticated user
    if (userId !== user.id) {
      return new Response(
        JSON.stringify({ error: "User ID mismatch" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get or create Stripe customer
    let customerId: string | undefined;

    // Check if user has a Stripe customer ID
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (profile?.stripe_customer_id) {
      customerId = profile.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to profile (ignore if column doesn't exist yet)
      try {
        await supabaseClient
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("user_id", user.id);
      } catch (e) {
        console.log("Could not save stripe_customer_id:", e);
      }
    }

    // Get origin for success/cancel URLs
    const origin = req.headers.get("origin") || "https://tamv.lovable.app";

    // Create price dynamically based on package
    const priceAmounts: Record<string, number> = {
      price_starter: 499,
      price_popular: 1999,
      price_pro: 4999,
      price_elite: 14999,
    };

    const amount = priceAmounts[priceId] || 999;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `TAMV ${packageName}`,
              description: `${credits} créditos TAU para el ecosistema TAMV`,
              images: ["https://tamv.lovable.app/logo.png"],
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/monetization?success=true&credits=${credits}`,
      cancel_url: `${origin}/monetization?canceled=true`,
      metadata: {
        user_id: user.id,
        credits: credits.toString(),
        package_name: packageName,
      },
    });

    console.log("Checkout session created:", session.id);

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Failed to create checkout session" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
