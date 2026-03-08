// ============================================================================
// TAMV Sensory Gate — Edge Function v1.0
// Ported from digital-civilization-core/src/api/v1/sensory_gate.py
// Sovereign input validation, rate limiting & threat classification
// ============================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ── Threat Patterns (ported from Python FORBIDDEN_PATTERNS) ──

const THREAT_PATTERNS = [
  { pattern: /\b(drop|delete|truncate|alter)\s+(table|database|schema)\b/i, severity: 'critical', category: 'sql_injection' },
  { pattern: /<script\b[^>]*>[\s\S]*?<\/script>/gi, severity: 'critical', category: 'xss' },
  { pattern: /\b(eval|exec|system|popen|subprocess)\s*\(/i, severity: 'critical', category: 'code_injection' },
  { pattern: /\.\.\//g, severity: 'warning', category: 'path_traversal' },
  { pattern: /\b(password|secret|token|key)\s*[:=]\s*['"]/i, severity: 'warning', category: 'credential_leak' },
];

// ── Rate Limiter (in-memory, per-user) ──

const rateLimits = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 60;
const WINDOW_MS = 60_000;

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = rateLimits.get(userId);

  if (!entry || now > entry.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

// ── Input Validation ──

interface ScanResult {
  clean: boolean;
  threats: Array<{ category: string; severity: string; match: string }>;
  inputSize: number;
  scanTimeMs: number;
}

function scanInput(input: string): ScanResult {
  const start = performance.now();
  const threats: ScanResult['threats'] = [];

  for (const { pattern, severity, category } of THREAT_PATTERNS) {
    const matches = input.match(pattern);
    if (matches) {
      threats.push({
        category,
        severity,
        match: matches[0].slice(0, 50),
      });
    }
  }

  return {
    clean: threats.length === 0,
    threats,
    inputSize: new TextEncoder().encode(input).length,
    scanTimeMs: Math.round(performance.now() - start),
  };
}

// ── MSR Logging ──

async function logToMSR(
  actorId: string | null,
  action: string,
  scanResult: ScanResult,
  blocked: boolean
) {
  const payload = JSON.stringify({ action, scanResult, blocked });
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(payload));
  const evidenceHash = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await supabase.from("msr_events").insert({
    actor_id: actorId,
    action: `SENSORY_GATE_${blocked ? "BLOCKED" : "PASSED"}`,
    domain: "SECURITY",
    evidence_hash: evidenceHash,
    severity: blocked ? "warn" : "info",
    payload: { threats: scanResult.threats, inputSize: scanResult.inputSize } as any,
  }).then(({ error }) => {
    if (error) console.error("[MSR LOG ERROR]", error.message);
  });
}

// ── Edge Handler ──

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

  try {
    // Extract user from JWT
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id ?? null;
    }

    // Rate limit check
    const rateLimitKey = userId || req.headers.get("x-forwarded-for") || "anonymous";
    const rateCheck = checkRateLimit(rateLimitKey);

    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded", retryAfterMs: WINDOW_MS }),
        {
          status: 429,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    // Parse body
    const body = await req.json();
    const input = typeof body.input === "string" ? body.input : JSON.stringify(body);

    // Size check (max 100KB)
    if (new TextEncoder().encode(input).length > 100_000) {
      await logToMSR(userId, "SIZE_EXCEEDED", { clean: false, threats: [{ category: "size", severity: "warning", match: "100KB+" }], inputSize: input.length, scanTimeMs: 0 }, true);
      return new Response(
        JSON.stringify({ error: "Input too large (max 100KB)" }),
        { status: 413, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Scan
    const scanResult = scanInput(input);

    // Log to MSR (async, don't block response)
    logToMSR(userId, "SCAN", scanResult, !scanResult.clean);

    if (!scanResult.clean) {
      const hasCritical = scanResult.threats.some((t) => t.severity === "critical");
      return new Response(
        JSON.stringify({
          allowed: false,
          threatLevel: hasCritical ? "critical" : "warning",
          threats: scanResult.threats.map((t) => ({ category: t.category, severity: t.severity })),
          message: "Input blocked by Sensory Gate",
        }),
        {
          status: hasCritical ? 403 : 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": String(rateCheck.remaining),
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        allowed: true,
        threatLevel: "clean",
        scanTimeMs: scanResult.scanTimeMs,
        inputSize: scanResult.inputSize,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(rateCheck.remaining),
        },
      }
    );
  } catch (e) {
    console.error("[SENSORY GATE ERROR]", e);
    return new Response(
      JSON.stringify({ error: "Internal sensory gate error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
