// ============================================================================
// TAMV Unified API v3.0.0-Sovereign - QuantumSecurityLayer™ (QSL)
// Post-Quantum Cryptography Implementation
// ============================================================================

import type { QuantumKeyPair, QuantumSignature, EncryptedPayload } from './types.ts';

// ============================================================================
// QSL Configuration
// ============================================================================

export interface QSLConfig {
  enabled: boolean;
  kemAlgorithm: 'Kyber1024' | 'Kyber768' | 'Kyber512';
  signatureAlgorithm: 'Dilithium3' | 'Dilithium5' | 'Falcon-512';
  hybridMode: boolean; // Combine classical + PQC
  keyRotationDays: number;
}

export const DEFAULT_QSL_CONFIG: QSLConfig = {
  enabled: true,
  kemAlgorithm: 'Kyber1024',
  signatureAlgorithm: 'Dilithium3',
  hybridMode: true,
  keyRotationDays: 90,
};

// ============================================================================
// Quantum-Safe Hash Functions (SHA3-256)
// ============================================================================

export async function sha3_256(data: string | Uint8Array): Promise<string> {
  const encoder = new TextEncoder();
  const buffer = typeof data === 'string' ? encoder.encode(data) : data;
  
  // Use Web Crypto SHA-256 as base (in production: use SHA3-256 library)
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer as unknown as ArrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateEntropy(size: number = 32): Promise<Uint8Array> {
  return crypto.getRandomValues(new Uint8Array(size));
}

export async function validateEntropy(randomBytes: Uint8Array): Promise<{
  valid: boolean;
  entropyBits: number;
  shannonEntropy: number;
}> {
  // Calculate Shannon entropy
  const frequencies = new Map<number, number>();
  for (const byte of randomBytes) {
    frequencies.set(byte, (frequencies.get(byte) || 0) + 1);
  }
  
  let shannonEntropy = 0;
  const len = randomBytes.length;
  for (const count of frequencies.values()) {
    const p = count / len;
    shannonEntropy -= p * Math.log2(p);
  }
  
  const entropyBits = shannonEntropy * len;
  const valid = shannonEntropy >= 7.5; // Minimum 7.5 bits per byte
  
  return { valid, entropyBits, shannonEntropy };
}

// ============================================================================
// Key Generation (Simulated PQC - Production: Use OQS Library)
// ============================================================================

export async function generateQuantumKeyPair(
  config: QSLConfig = DEFAULT_QSL_CONFIG
): Promise<QuantumKeyPair> {
  // Generate deterministic but unique key IDs
  const keyId = `qsl-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  
  // Simulate PQC key generation
  // In production: Use OQS (Open Quantum Safe) library
  const publicKeyDilithium = await sha3_256(keyId + 'dilithium-pub');
  const publicKeyKyber = await sha3_256(keyId + 'kyber-pub');
  
  // Store keys securely (in production: use HSM/Vault)
  const keyPair: QuantumKeyPair = {
    key_id: keyId,
    public_key_dilithium: publicKeyDilithium,
    public_key_kyber: publicKeyKyber,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + config.keyRotationDays * 24 * 60 * 60 * 1000).toISOString(),
  };
  
  return keyPair;
}

// ============================================================================
// Digital Signatures (Dilithium - Simulated)
// ============================================================================

export async function signWithDilithium(
  message: string,
  privateKey: string,
  algorithm: 'Dilithium3' | 'Dilithium5' = 'Dilithium3'
): Promise<QuantumSignature> {
  const timestamp = new Date().toISOString();
  const dataToSign = `${message}:${timestamp}:${privateKey}`;
  
  // Simulate Dilithium signature
  // In production: Use actual OQS Dilithium implementation
  const signature = await sha3_256(dataToSign);
  const publicKey = await sha3_256(privateKey + '-pub');
  
  return {
    algorithm,
    public_key: publicKey,
    signature,
    timestamp,
  };
}

export async function verifyDilithiumSignature(
  message: string,
  signature: QuantumSignature,
  publicKey: string
): Promise<boolean> {
  // Verify timestamp is recent (5 minute window)
  const sigTime = new Date(signature.timestamp).getTime();
  const now = Date.now();
  if (Math.abs(now - sigTime) > 5 * 60 * 1000) {
    return false;
  }
  
  // Simulate verification
  // In production: Use actual OQS verification
  const dataToSign = `${message}:${signature.timestamp}:${publicKey}`;
  const expectedSignature = await sha3_256(dataToSign);
  
  return signature.signature === expectedSignature && 
         signature.public_key === publicKey;
}

// ============================================================================
// Hybrid Signatures (RSA + Dilithium)
// ============================================================================

export interface HybridSignature {
  classical: string; // RSA/ECDSA signature
  quantum: QuantumSignature; // Dilithium signature
  combined_hash: string;
}

export async function createHybridSignature(
  message: string,
  classicalPrivateKey: string,
  quantumPrivateKey: string
): Promise<HybridSignature> {
  // Classical signature (simulated)
  const classicalSig = await sha3_256(message + classicalPrivateKey);
  
  // Quantum signature
  const quantumSig = await signWithDilithium(message, quantumPrivateKey);
  
  // Combined hash for verification
  const combinedHash = await sha3_256(classicalSig + quantumSig.signature);
  
  return {
    classical: classicalSig,
    quantum: quantumSig,
    combined_hash: combinedHash,
  };
}

export async function verifyHybridSignature(
  message: string,
  signature: HybridSignature,
  classicalPublicKey: string,
  quantumPublicKey: string
): Promise<boolean> {
  // Verify classical signature (simulated)
  const expectedClassical = await sha3_256(message + classicalPublicKey);
  const classicalValid = signature.classical === expectedClassical;
  
  // Verify quantum signature
  const quantumValid = await verifyDilithiumSignature(
    message,
    signature.quantum,
    quantumPublicKey
  );
  
  // Verify combined hash
  const expectedCombined = await sha3_256(signature.classical + signature.quantum.signature);
  const combinedValid = signature.combined_hash === expectedCombined;
  
  return classicalValid && quantumValid && combinedValid;
}

// ============================================================================
// Key Encapsulation (Kyber - Simulated)
// ============================================================================

export interface KyberKeyEncapsulation {
  ciphertext: string;
  sharedSecret: string;
}

export async function encapsulateKey(
  publicKey: string,
  algorithm: 'Kyber1024' | 'Kyber768' = 'Kyber1024'
): Promise<KyberKeyEncapsulation> {
  // Simulate Kyber KEM encapsulation
  // In production: Use actual OQS Kyber implementation
  const entropy = await generateEntropy(32);
  const sharedSecret = await sha3_256(entropy);
  const ciphertext = await sha3_256(sharedSecret + publicKey);
  
  return {
    ciphertext,
    sharedSecret,
  };
}

export async function decapsulateKey(
  ciphertext: string,
  privateKey: string,
  algorithm: 'Kyber1024' | 'Kyber768' = 'Kyber1024'
): Promise<string> {
  // Simulate Kyber KEM decapsulation
  const sharedSecret = await sha3_256(ciphertext + privateKey);
  return sharedSecret;
}

// ============================================================================
// Symmetric Encryption (AES-256-GCM with PQC key)
// ============================================================================

export interface EncryptedData {
  ciphertext: string;
  iv: string;
  tag: string;
  encapsulatedKey: string;
}

export async function encryptWithPQC(
  plaintext: string,
  recipientPublicKey: string
): Promise<EncryptedData> {
  // Generate random AES key
  const aesKey = await generateEntropy(32);
  const iv = await generateEntropy(12); // 96-bit IV for GCM
  
  // Encapsulate AES key using Kyber
  const encapsulation = await encapsulateKey(recipientPublicKey);
  
  // Encrypt plaintext with AES (simulated - use Web Crypto in production)
  const encoder = new TextEncoder();
  const plaintextBytes = encoder.encode(plaintext);
  
  // XOR with key stream (simplified - use AES-GCM in production)
  const ciphertextBytes = new Uint8Array(plaintextBytes.length);
  for (let i = 0; i < plaintextBytes.length; i++) {
    ciphertextBytes[i] = plaintextBytes[i] ^ aesKey[i % aesKey.length];
  }
  
  const ciphertext = btoa(String.fromCharCode(...ciphertextBytes));
  const tag = (await sha3_256(ciphertext + encapsulation.sharedSecret)).slice(0, 32);
  
  return {
    ciphertext,
    iv: btoa(String.fromCharCode(...iv)),
    tag,
    encapsulatedKey: encapsulation.ciphertext,
  };
}

export async function decryptWithPQC(
  encryptedData: EncryptedData,
  recipientPrivateKey: string
): Promise<string> {
  // Decapsulate AES key
  const sharedSecret = await decapsulateKey(
    encryptedData.encapsulatedKey,
    recipientPrivateKey
  );
  
  // Verify tag
  const expectedTag = (await sha3_256(encryptedData.ciphertext + sharedSecret)).slice(0, 32);
  if (encryptedData.tag !== expectedTag) {
    throw new Error('Decryption failed: authentication tag mismatch');
  }
  
  // Decrypt ciphertext (simplified - use AES-GCM in production)
  const ciphertextBytes = Uint8Array.from(atob(encryptedData.ciphertext), c => c.charCodeAt(0));
  const aesKey = await generateEntropy(32); // In production: derive from sharedSecret
  
  const plaintextBytes = new Uint8Array(ciphertextBytes.length);
  for (let i = 0; i < ciphertextBytes.length; i++) {
    plaintextBytes[i] = ciphertextBytes[i] ^ aesKey[i % aesKey.length];
  }
  
  const decoder = new TextDecoder();
  return decoder.decode(plaintextBytes);
}

// ============================================================================
// Key Rotation
// ============================================================================

export interface KeyRotationSchedule {
  keyId: string;
  rotateAt: string;
  gracePeriodHours: number;
}

export async function scheduleKeyRotation(
  currentKeyId: string,
  rotationDays: number = 90
): Promise<KeyRotationSchedule> {
  const rotateAt = new Date(Date.now() + rotationDays * 24 * 60 * 60 * 1000);
  
  return {
    keyId: currentKeyId,
    rotateAt: rotateAt.toISOString(),
    gracePeriodHours: 24,
  };
}

export function isKeyExpired(keyPair: QuantumKeyPair): boolean {
  if (!keyPair.expires_at) return false;
  return new Date(keyPair.expires_at).getTime() < Date.now();
}

// ============================================================================
// QSL Manager
// ============================================================================

export class QuantumSecurityLayer {
  private config: QSLConfig;
  private activeKeys: Map<string, QuantumKeyPair> = new Map();

  constructor(config: Partial<QSLConfig> = {}) {
    this.config = { ...DEFAULT_QSL_CONFIG, ...config };
  }

  async initialize(): Promise<void> {
    if (!this.config.enabled) {
      console.warn('QSL is disabled - running in classical mode only');
      return;
    }
    
    console.log(`QSL initialized with ${this.config.signatureAlgorithm}`);
  }

  async generateKeyPair(): Promise<QuantumKeyPair> {
    const keyPair = await generateQuantumKeyPair(this.config);
    this.activeKeys.set(keyPair.key_id, keyPair);
    return keyPair;
  }

  async sign(message: string, keyId: string): Promise<QuantumSignature> {
    const keyPair = this.activeKeys.get(keyId);
    if (!keyPair) {
      throw new Error(`Key ${keyId} not found`);
    }
    
    if (isKeyExpired(keyPair)) {
      throw new Error(`Key ${keyId} has expired`);
    }
    
    // In production: retrieve private key from secure storage
    const privateKey = await sha3_256(keyPair.key_id + 'private');
    return signWithDilithium(message, privateKey, this.config.signatureAlgorithm as 'Dilithium3' | 'Dilithium5');
  }

  async verify(message: string, signature: QuantumSignature): Promise<boolean> {
    return verifyDilithiumSignature(message, signature, signature.public_key);
  }

  getConfig(): QSLConfig {
    return { ...this.config };
  }
}

// Factory function
export function createQSL(config?: Partial<QSLConfig>): QuantumSecurityLayer {
  return new QuantumSecurityLayer(config);
}
