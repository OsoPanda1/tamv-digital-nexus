// ============================================================================
// TAMV Unified API v3.0.0-Sovereign - Shared Types
// Pipeline A/B/CCP Architecture
// ============================================================================

export interface TAMVRequest {
  trace_id: string;
  span_id: string;
  parent_span_id?: string;
  user_id?: string;
  session_id?: string;
  timestamp: string;
  pipeline: 'A' | 'B' | 'CCP';
  module: string;
  action: string;
}

export interface TAMVResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: TAMVError;
  meta: ResponseMeta;
}

export interface TAMVError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMeta {
  trace_id: string;
  timestamp: string;
  version: string;
  request_duration_ms: number;
}

// ============================================================================
// Pipeline A - Critical Operations
// ============================================================================

export interface AuthToken {
  access_token: string;
  refresh_token: string;
  token_type: 'Bearer' | 'Bearer-PQC';
  expires_in: number;
  quantum_signature?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
  mfa_code?: string;
}

export interface QuantumKeyPair {
  key_id: string;
  public_key_rsa?: string;
  public_key_dilithium?: string;
  public_key_kyber?: string;
  created_at: string;
  expires_at?: string;
}

export interface SecurityEvent {
  event_id: string;
  user_id?: string;
  event_type: string;
  severity: 'info' | 'low' | 'medium' | 'high' | 'critical';
  description: string;
  metadata?: Record<string, unknown>;
  quantum_signature?: string;
  timestamp: string;
}

export interface Transaction {
  tx_id: string;
  from_user_id: string;
  to_user_id: string;
  amount: number;
  currency: 'USD' | 'TAU' | 'TCEP';
  tx_type: 'transfer' | 'payment' | 'refund' | 'commission';
  status: 'pending' | 'confirmed' | 'failed';
  description?: string;
  evidence_hash: string;
  quantum_signature?: string;
  created_at: string;
  confirmed_at?: string;
}

// ============================================================================
// Pipeline B - Adaptive Intelligence
// ============================================================================

export interface EmotionVector {
  joy: number;
  sadness: number;
  anger: number;
  fear: number;
  surprise: number;
  neutral: number;
}

export interface EOCTRecord {
  eoct_id: string;
  user_id: string;
  emotion_vector: EmotionVector;
  dominant_emotion: string;
  confidence: number;
  context_hash: string;
  trigger_event: string;
  timestamp: string;
}

export interface AIGenerationRequest {
  prompt: string;
  model?: 'gpt-4' | 'gpt-4-turbo' | 'claude-3' | 'local-fallback';
  temperature?: number;
  max_tokens?: number;
  emotional_context?: EmotionVector;
  stream?: boolean;
}

export interface AIGenerationResponse {
  content: string;
  model_used: string;
  tokens_input: number;
  tokens_output: number;
  emotion_detected?: EmotionVector;
  quantum_signature?: string;
}

export interface VoiceRequest {
  text?: string;
  audio?: string; // base64
  voice_id?: string;
  language?: string;
  emotion?: string;
}

// ============================================================================
// CCP - Control & Coordination
// ============================================================================

export interface ServiceHealth {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  version: string;
  uptime_seconds: number;
  last_check: string;
  metrics?: {
    latency_p95_ms: number;
    error_rate: number;
    requests_per_minute: number;
  };
}

export interface Policy {
  policy_id: string;
  name: string;
  description: string;
  rules: PolicyRule[];
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PolicyRule {
  resource: string;
  action: string;
  conditions: Record<string, unknown>;
  effect: 'allow' | 'deny';
}

export interface GovernanceProposal {
  proposal_id: string;
  title: string;
  description: string;
  author_id: string;
  category: string;
  status: 'draft' | 'voting' | 'passed' | 'rejected' | 'executed';
  votes_for: number;
  votes_against: number;
  votes_abstain: number;
  expires_at: string;
  created_at: string;
}

// ============================================================================
// Quantum Security Layer (QSL)
// ============================================================================

export interface QuantumSignature {
  algorithm: 'Dilithium3' | 'Dilithium5' | 'Falcon-512';
  public_key: string;
  signature: string;
  timestamp: string;
}

export interface EncryptedPayload {
  ciphertext: string;
  encapsulation: string;
  algorithm: 'Kyber1024' | 'Kyber768';
  nonce: string;
}

// ============================================================================
// Audit & Observability
// ============================================================================

export interface AuditLog {
  log_id: string;
  trace_id: string;
  span_id: string;
  user_id?: string;
  session_id?: string;
  module: string;
  pipeline: 'A' | 'B' | 'CCP';
  action: string;
  resource: string;
  status: 'success' | 'failure';
  risk_level: 'none' | 'low' | 'medium' | 'high' | 'critical';
  duration_ms: number;
  quantum_signature?: string;
  eoct_hash?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface MetricPoint {
  name: string;
  value: number;
  labels: Record<string, string>;
  timestamp: string;
}
