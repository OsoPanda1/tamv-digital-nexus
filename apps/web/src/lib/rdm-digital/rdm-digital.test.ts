import { describe, expect, it } from "vitest";
import { RdmDigitalEngine } from "./engine";
import { createEvidenceHash } from "./ledger";

describe("RdmDigitalEngine", () => {
  it("registers a citizen with an MSR wallet", () => {
    const engine = new RdmDigitalEngine();
    const { user, wallet } = engine.registerUser({ email: "anubis@tamv.mx" });

    expect(user.role).toBe("citizen");
    expect(wallet.userId).toBe(user.id);
    expect(wallet.balance).toBe(0);
  });

  it("rewards verified action and emits BookPI evidence", () => {
    const engine = new RdmDigitalEngine();
    const { user } = engine.registerUser({ email: "operador@tamv.mx", role: "operator" });
    const reward = engine.reward({ userId: user.id, amount: 42.125, reason: "map_validation" });

    expect(reward.wallet.balance).toBe(42.13);
    expect(reward.evidenceHash).toMatch(/^bookpi:/);
    expect(engine.snapshot().transactions).toHaveLength(1);
  });

  it("creates commerce, sandbox payment intent and contextual AI response", () => {
    const engine = new RdmDigitalEngine();
    const { user } = engine.registerUser({ email: "commerce@tamv.mx", role: "commerce" });
    const commerce = engine.createCommerce({ name: "Café Nodo Cero", category: "alimentos", ownerUserId: user.id });
    const payment = engine.createPaymentIntent({ amount: 199, provider: "sandbox" });
    const answer = engine.askAI("comercio gobernanza salud");

    expect(commerce.id).toContain("com_");
    expect(payment.status).toBe("succeeded");
    expect(answer.usedPlaces.length).toBeGreaterThan(0);
    expect(answer.governanceNote).toContain("modo seguro");
  });

  it("keeps evidence hashes deterministic for audit payloads", () => {
    expect(createEvidenceHash({ b: 2, a: 1 })).toBe(createEvidenceHash({ a: 1, b: 2 }));
  });
});
