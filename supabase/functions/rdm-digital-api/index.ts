// RDM DIGITAL API — Sistema Operativo Territorial serverless for Supabase Edge.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function jsonError(error: string, status = 400) {
  return json({ error }, status);
}

function evidenceHash(payload: unknown): string {
  const serialized = JSON.stringify(payload);
  let hash = 2166136261;
  for (let i = 0; i < serialized.length; i += 1) {
    hash ^= serialized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `bookpi:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

function getSupabase(req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !serviceKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_ANON_KEY are required");
  }
  const authHeader = req.headers.get("Authorization");
  return createClient(supabaseUrl, serviceKey, {
    global: { headers: authHeader ? { Authorization: authHeader } : {} },
  });
}

async function createStripePaymentIntent(amount: number, currency: string) {
  const secret = Deno.env.get("STRIPE_SECRET");
  if (!secret) {
    const id = `sandbox_${crypto.randomUUID()}`;
    return { id, client_secret: `sandbox_secret_${id}`, status: "succeeded", provider: "sandbox" };
  }

  const response = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      amount: String(Math.round(amount * 100)),
      currency,
      automatic_payment_methods: JSON.stringify({ enabled: true }),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Stripe error ${response.status}: ${body}`);
  }
  return { ...(await response.json()), provider: "stripe" };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^.*\/rdm-digital-api/, "") || "/info";
    const db = getSupabase(req);
    const body = req.method === "GET" ? {} : await req.json().catch(() => ({}));

    if (path === "/auth/register" && req.method === "POST") {
      const email = String(body.email ?? "").trim().toLowerCase();
      const role = String(body.role ?? "citizen");
      if (!/^\S+@\S+\.\S+$/.test(email)) return jsonError("valid email is required");

      const { data: existing } = await db.from("rdm_users").select("*").eq("email", email).maybeSingle();
      const user = existing ?? (await db.from("rdm_users").insert({ email, role }).select("*").single()).data;
      if (!user) return jsonError("user could not be created", 500);

      const { data: existingWallet } = await db.from("rdm_wallets").select("*").eq("user_id", user.id).maybeSingle();
      const wallet = existingWallet ?? (await db.from("rdm_wallets").insert({ user_id: user.id }).select("*").single()).data;
      return json({ user, wallet }, existing ? 200 : 201);
    }

    if (path === "/economy/reward" && req.method === "POST") {
      const userId = String(body.userId ?? "");
      const amount = Number(body.amount ?? 0);
      if (!userId || !Number.isFinite(amount) || amount <= 0) return jsonError("userId and positive amount are required");

      const { data: wallet } = await db.from("rdm_wallets").select("*").eq("user_id", userId).single();
      if (!wallet) return jsonError("wallet not found", 404);
      const nextBalance = Math.round((Number(wallet.balance) + amount) * 100) / 100;
      const { data: updatedWallet } = await db.from("rdm_wallets").update({ balance: nextBalance, updated_at: new Date().toISOString() }).eq("user_id", userId).select("*").single();
      const hash = evidenceHash({ userId, amount, reason: body.reason ?? "reward", at: new Date().toISOString() });
      const { data: transaction } = await db.from("rdm_transactions").insert({ user_id: userId, amount, type: "reward", evidence_hash: hash, metadata: { reason: body.reason ?? "territorial_action" } }).select("*").single();
      return json({ wallet: updatedWallet, transaction, evidenceHash: hash }, 201);
    }

    if (path === "/commerce/create" && req.method === "POST") {
      const name = String(body.name ?? "").trim();
      const category = String(body.category ?? "").trim().toLowerCase();
      if (!name || !category) return jsonError("name and category are required");
      const { data, error } = await db.from("rdm_commerces").insert({ name, category, owner_user_id: body.ownerUserId ?? null }).select("*").single();
      if (error) return jsonError(error.message, 500);
      return json({ commerce: data }, 201);
    }

    if (path === "/places" && req.method === "GET") {
      const { data } = await db.from("rdm_places").select("*").order("name", { ascending: true }).limit(50);
      return json({ places: data ?? [] });
    }

    if (path === "/ai/ask" && req.method === "POST") {
      const message = String(body.message ?? "").trim();
      if (!message) return jsonError("message is required");
      const { data: places } = await db.from("rdm_places").select("*").limit(5);
      return json({
        response: `Consulta: ${message}\nLugares: ${(places ?? []).map((place) => place.name).join(", ") || "sin lugares registrados"}\nRecomendación: registrar evidencia BookPI antes de recompensar o liquidar pagos.`,
        places: places ?? [],
      });
    }

    if (path === "/payments/create" && req.method === "POST") {
      const amount = Number(body.amount ?? 0);
      const currency = String(body.currency ?? "mxn").toLowerCase();
      if (!Number.isFinite(amount) || amount <= 0) return jsonError("positive amount is required");
      const intent = await createStripePaymentIntent(amount, currency);
      await db.from("rdm_payment_intents").insert({ amount, currency, provider: intent.provider, status: intent.status, external_id: intent.id });
      return json({ clientSecret: intent.client_secret, provider: intent.provider, status: intent.status });
    }

    if (path === "/webhooks/stripe" && req.method === "POST") {
      // TODO_REVIEW_LEGAL: enable signature verification before live banking/Stripe production.
      return json({ received: true, mode: "signature-verification-pending" });
    }

    if (path === "/info" || path === "/") {
      return json({
        name: "RDM Digital Territorial OS API",
        version: "1.0.0",
        endpoints: ["/auth/register", "/economy/reward", "/commerce/create", "/places", "/ai/ask", "/payments/create", "/webhooks/stripe"],
      });
    }

    return jsonError("endpoint not found", 404);
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "internal error", 500);
  }
});
