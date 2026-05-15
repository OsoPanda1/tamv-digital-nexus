import type { RdmTransaction, TransactionType } from "./types";

export function normalizeMoney(amount: number): number {
  if (!Number.isFinite(amount)) {
    throw new Error("amount must be a finite number");
  }
  return Math.round(amount * 100) / 100;
}

export function assertPositiveAmount(amount: number): number {
  const normalized = normalizeMoney(amount);
  if (normalized <= 0) {
    throw new Error("amount must be greater than zero");
  }
  return normalized;
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(",")}}`;
}

export function createEvidenceHash(payload: unknown): string {
  const serialized = stableStringify(payload);
  let hash = 2166136261;
  for (let i = 0; i < serialized.length; i += 1) {
    hash ^= serialized.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `bookpi:${(hash >>> 0).toString(16).padStart(8, "0")}`;
}

export function createTransaction(params: {
  userId: string;
  amount: number;
  type: TransactionType;
  metadata?: Record<string, unknown>;
  now?: string;
}): RdmTransaction {
  const createdAt = params.now ?? new Date().toISOString();
  const amount = normalizeMoney(params.amount);
  const evidenceHash = createEvidenceHash({
    userId: params.userId,
    amount,
    type: params.type,
    metadata: params.metadata ?? {},
    createdAt,
  });

  return {
    id: `tx_${evidenceHash.replace("bookpi:", "")}_${createdAt.replace(/\D/g, "").slice(0, 14)}`,
    userId: params.userId,
    amount,
    type: params.type,
    evidenceHash,
    metadata: params.metadata,
    createdAt,
  };
}
