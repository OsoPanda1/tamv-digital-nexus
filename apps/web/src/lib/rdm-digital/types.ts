export type RdmRole = "citizen" | "commerce" | "operator" | "admin";
export type TransactionType = "reward" | "payment" | "transfer" | "commerce_sale" | "adjustment";
export type PaymentProvider = "stripe" | "spei" | "sandbox";
export type PaymentStatus = "requires_action" | "processing" | "succeeded" | "failed";

export interface RdmUser {
  id: string;
  email: string;
  role: RdmRole;
  createdAt: string;
}

export interface RdmWallet {
  id: string;
  userId: string;
  balance: number;
  currency: "MSR" | "MXN";
  updatedAt: string;
}

export interface RdmTransaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  evidenceHash: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface RdmPlace {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  tags: string[];
}

export interface RdmCommerce {
  id: string;
  name: string;
  category: string;
  ownerUserId?: string;
  createdAt: string;
}

export interface RdmPaymentIntent {
  id: string;
  amount: number;
  currency: "mxn" | "usd";
  status: PaymentStatus;
  provider: PaymentProvider;
  clientSecret?: string;
  createdAt: string;
}

export interface RdmState {
  users: RdmUser[];
  wallets: RdmWallet[];
  transactions: RdmTransaction[];
  places: RdmPlace[];
  commerces: RdmCommerce[];
  paymentIntents: RdmPaymentIntent[];
}

export interface RdmRegisterInput {
  email: string;
  role?: RdmRole;
}

export interface RdmRewardInput {
  userId: string;
  amount: number;
  reason?: string;
}

export interface RdmCommerceInput {
  name: string;
  category: string;
  ownerUserId?: string;
}

export interface RdmPaymentInput {
  amount: number;
  currency?: "mxn" | "usd";
  provider?: PaymentProvider;
}

export interface RdmAiAnswer {
  response: string;
  usedPlaces: RdmPlace[];
  governanceNote: string;
}
