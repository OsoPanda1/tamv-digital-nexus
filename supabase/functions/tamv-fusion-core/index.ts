// ============================================================================
// TAMV FUSION CORE — Orchestrator MD-X4 v2026
// Health check + content sync + QC + MSR registry
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BASE_URL =
  Deno.env.get("TAMV_BASE_URL") ||
  "https://id-preview--63163423-071c-45b1-95ff-6bdf8e698e0b.lovable.app";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

interface FusionReport {
  startedAt: string;
  finishedAt?: string;
  health: {
    routesChecked: string[];
    routesStatus: Record<string, number>;
    warnings: string[];
    dbStatus: Record<string, number>;
  };
  contentSync: { status: "ok" | "error"; itemsProcessed: number };
  updates: { docsUpdated: number; coursesUpdated: number; socialPostsCreated: number };
  msrEventId?: string;
  error?: string;
}

// ─── Health Check ────────────────────────────────────────────────────────────

const ROUTES = [
  "/", "/dashboard", "/isabella", "/anubis", "/ecosystem",
  "/dream-spaces", "/kaos", "/community", "/university",
  "/economy", "/governance", "/bookpi", "/monetization", "/auth",
];

async function checkRouteStatus(route: string): Promise<number> {
  try {
    const res = await fetch(BASE_URL + route, { method: "GET" });
    await res.text(); // consume body
    return res.status;
  } catch {
    return 0;
  }
}

const CRITICAL_TABLES = [
  "profiles", "posts", "courses", "msr_events", "tcep_wallets",
  "crisis_logs", "bookpi_events", "notifications", "user_roles",
];

async function healthCheck(): Promise<FusionReport["health"]> {
  const routesStatus: Record<string, number> = {};
  const warnings: string[] = [];
  const dbStatus: Record<string, number> = {};

  // Check routes in parallel (batches of 4)
  for (let i = 0; i < ROUTES.length; i += 4) {
    const batch = ROUTES.slice(i, i + 4);
    const results = await Promise.all(batch.map((r) => checkRouteStatus(r)));
    batch.forEach((r, idx) => {
      routesStatus[r] = results[idx];
      if (results[idx] === 0 || results[idx] >= 400) {
        warnings.push(`Route down: ${r} (${results[idx]})`);
      }
    });
  }

  // Check DB tables
  for (const table of CRITICAL_TABLES) {
    const { count, error } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true });
    dbStatus[table] = error ? -1 : (count ?? 0);
    if (error) warnings.push(`DB table error: ${table} — ${error.message}`);
  }

  return { routesChecked: ROUTES, routesStatus, warnings, dbStatus };
}

// ─── Content Sync (calls existing edge function) ─────────────────────────────

async function runContentSync(): Promise<FusionReport["contentSync"]> {
  try {
    const syncUrl = `${SUPABASE_URL}/functions/v1/tamv-content-sync`;
    const res = await fetch(syncUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) {
      await res.text();
      return { status: "error", itemsProcessed: 0 };
    }
    const data = await res.json();
    const items =
      data.sources_synced ??
      (data.ecosystem_data?.repositories?.length ?? 0) +
        (data.ecosystem_data?.blog?.posts_found ?? 0);
    return { status: "ok", itemsProcessed: items };
  } catch (e) {
    console.error("Content sync error:", e);
    return { status: "error", itemsProcessed: 0 };
  }
}

// ─── MSR Registry ────────────────────────────────────────────────────────────

async function registerMsrEvent(report: FusionReport): Promise<string | undefined> {
  const evidenceHash = await crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(JSON.stringify(report)))
    .then((buf) =>
      Array.from(new Uint8Array(buf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
    );

  const { data, error } = await supabase
    .from("msr_events")
    .insert({
      action: "TAMV_FUSION_CYCLE",
      domain: "GENERAL",
      payload: report as any,
      evidence_hash: evidenceHash,
      severity: report.health.warnings.length > 3 ? "warn" : "info",
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("MSR insert error:", error);
    return undefined;
  }
  return data.id;
}

// ─── Core Runner ─────────────────────────────────────────────────────────────

async function runFusionCore(): Promise<FusionReport> {
  const report: FusionReport = {
    startedAt: new Date().toISOString(),
    health: { routesChecked: [], routesStatus: {}, warnings: [], dbStatus: {} },
    contentSync: { status: "error", itemsProcessed: 0 },
    updates: { docsUpdated: 0, coursesUpdated: 0, socialPostsCreated: 0 },
  };

  try {
    // Phase 1: Health
    report.health = await healthCheck();

    // Phase 2: Content Sync
    report.contentSync = await runContentSync();

    // Phase 3: Register
    report.finishedAt = new Date().toISOString();
    report.msrEventId = await registerMsrEvent(report);
  } catch (e) {
    report.error = (e as Error)?.message || "Unknown FUSION CORE error";
    report.finishedAt = new Date().toISOString();
    await registerMsrEvent(report).catch(() => {});
  }

  return report;
}

// ─── Edge Handler ────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  console.log("[TAMV FUSION CORE] Starting cycle...");
  const report = await runFusionCore();
  console.log(
    `[TAMV FUSION CORE] Done — ${report.health.warnings.length} warnings, sync: ${report.contentSync.status}`
  );

  return new Response(JSON.stringify(report), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
