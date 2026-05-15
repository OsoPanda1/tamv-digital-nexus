import { assertPositiveAmount, createEvidenceHash, createTransaction, normalizeMoney } from "./ledger";
import type {
  RdmAiAnswer,
  RdmCommerce,
  RdmCommerceInput,
  RdmPaymentInput,
  RdmPaymentIntent,
  RdmPlace,
  RdmRegisterInput,
  RdmRewardInput,
  RdmState,
  RdmUser,
  RdmWallet,
} from "./types";

const DEFAULT_PLACES: RdmPlace[] = [
  { id: "place_nodo_cero", name: "Nodo Cero TAMV", type: "governance", lat: 19.4326, lng: -99.1332, tags: ["operación", "gobernanza"] },
  { id: "place_plaza_cuantica", name: "Plaza Cuántica", type: "commerce", lat: 20.6597, lng: -103.3496, tags: ["comercio", "msr"] },
  { id: "place_utamv", name: "UTAMV Campus Digital", type: "education", lat: 25.6866, lng: -100.3161, tags: ["educación", "certificación"] },
  { id: "place_health_node", name: "Nodo Salud BookPI", type: "health", lat: 21.1619, lng: -86.8515, tags: ["salud", "evidencia"] },
];

export const initialRdmState: RdmState = {
  users: [],
  wallets: [],
  transactions: [],
  places: DEFAULT_PLACES,
  commerces: [],
  paymentIntents: [],
};

function makeId(prefix: string, seed: string): string {
  return `${prefix}_${createEvidenceHash(seed).replace("bookpi:", "")}`;
}

function cloneState(state: RdmState): RdmState {
  return {
    users: [...state.users],
    wallets: [...state.wallets],
    transactions: [...state.transactions],
    places: [...state.places],
    commerces: [...state.commerces],
    paymentIntents: [...state.paymentIntents],
  };
}

export class RdmDigitalEngine {
  private state: RdmState;

  constructor(seedState: RdmState = initialRdmState) {
    this.state = cloneState(seedState);
  }

  snapshot(): RdmState {
    return cloneState(this.state);
  }

  registerUser(input: RdmRegisterInput): { user: RdmUser; wallet: RdmWallet } {
    const email = input.email.trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error("valid email is required");
    }

    const existing = this.state.users.find((user) => user.email === email);
    if (existing) {
      const wallet = this.getWallet(existing.id);
      return { user: existing, wallet };
    }

    const now = new Date().toISOString();
    const user: RdmUser = {
      id: makeId("usr", email),
      email,
      role: input.role ?? "citizen",
      createdAt: now,
    };
    const wallet: RdmWallet = {
      id: makeId("wal", user.id),
      userId: user.id,
      balance: 0,
      currency: "MSR",
      updatedAt: now,
    };

    this.state.users.push(user);
    this.state.wallets.push(wallet);
    return { user, wallet };
  }

  reward(input: RdmRewardInput): { wallet: RdmWallet; transactionId: string; evidenceHash: string } {
    const amount = assertPositiveAmount(input.amount);
    const wallet = this.getWallet(input.userId);
    wallet.balance = normalizeMoney(wallet.balance + amount);
    wallet.updatedAt = new Date().toISOString();

    const tx = createTransaction({
      userId: input.userId,
      amount,
      type: "reward",
      metadata: { reason: input.reason ?? "territorial_action" },
    });
    this.state.transactions.push(tx);

    return { wallet, transactionId: tx.id, evidenceHash: tx.evidenceHash };
  }

  createCommerce(input: RdmCommerceInput): RdmCommerce {
    const name = input.name.trim();
    const category = input.category.trim().toLowerCase();
    if (!name || !category) {
      throw new Error("commerce name and category are required");
    }

    const commerce: RdmCommerce = {
      id: makeId("com", `${name}:${category}:${input.ownerUserId ?? "tamv"}`),
      name,
      category,
      ownerUserId: input.ownerUserId,
      createdAt: new Date().toISOString(),
    };
    this.state.commerces.push(commerce);
    return commerce;
  }

  createPaymentIntent(input: RdmPaymentInput): RdmPaymentIntent {
    const amount = assertPositiveAmount(input.amount);
    const provider = input.provider ?? "sandbox";
    const createdAt = new Date().toISOString();
    const id = makeId("pay", `${provider}:${amount}:${createdAt}`);
    const intent: RdmPaymentIntent = {
      id,
      amount,
      currency: input.currency ?? "mxn",
      status: provider === "sandbox" ? "succeeded" : "requires_action",
      provider,
      clientSecret: provider === "sandbox" ? `sandbox_secret_${id}` : undefined,
      createdAt,
    };
    this.state.paymentIntents.push(intent);
    return intent;
  }

  addPlace(place: Omit<RdmPlace, "id">): RdmPlace {
    if (!place.name.trim() || !Number.isFinite(place.lat) || !Number.isFinite(place.lng)) {
      throw new Error("place name, lat and lng are required");
    }
    const created: RdmPlace = {
      ...place,
      id: makeId("plc", `${place.name}:${place.lat}:${place.lng}`),
    };
    this.state.places.push(created);
    return created;
  }

  askAI(message: string): RdmAiAnswer {
    const normalized = message.trim();
    if (!normalized) {
      throw new Error("message is required");
    }

    const terms = normalized.toLowerCase().split(/\s+/);
    const places = this.state.places
      .map((place) => ({
        place,
        score: terms.reduce((score, term) => {
          const haystack = `${place.name} ${place.type} ${place.tags.join(" ")}`.toLowerCase();
          return score + (haystack.includes(term) ? 1 : 0);
        }, 0),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map((entry) => entry.place);

    return {
      response: `Consulta territorial: "${normalized}". Rutas sugeridas: ${places.map((place) => place.name).join(", ")}. Acción recomendada: registrar evidencia BookPI y activar recompensa MSR si existe impacto verificable.`,
      usedPlaces: places,
      governanceNote: "Respuesta generada en modo seguro: no ejecuta pagos reales ni cambios legales sin revisión humana.",
    };
  }

  getWallet(userId: string): RdmWallet {
    const wallet = this.state.wallets.find((item) => item.userId === userId);
    if (!wallet) {
      throw new Error(`wallet not found for user ${userId}`);
    }
    return wallet;
  }
}
