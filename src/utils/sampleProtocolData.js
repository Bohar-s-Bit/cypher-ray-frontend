/**
 * Example data for testing ProtocolHandshakeTimeline component
 */

export const sampleProtocolTimelineData = [
  {
    protocolId: "protocol-0",
    protocolName: "TLS 1.3",
    version: "1.3",
    description: "Detected TLS 1.3 protocol implementation with modern cipher suites",
    stages: [
      {
        stageName: "Handshake/Key Exchange",
        order: 1,
        icon: "🤝",
        color: "blue",
        algorithms: [
          {
            name: "ECDHE-RSA",
            type: "Elliptic Curve Diffie-Hellman Ephemeral",
            confidence: 0.96,
            evidence: [
              "ECDHE key exchange routine detected",
              "Curve25519 implementation found",
              "Ephemeral key generation identified"
            ],
            functions: [
              {
                name: "ecdhe_generate_keypair",
                operations: ["key-generation", "curve-operations"],
                confidence: 0.94
              },
              {
                name: "ecdhe_compute_shared_secret",
                operations: ["key-exchange", "shared-secret"],
                confidence: 0.92
              }
            ]
          },
          {
            name: "RSA-2048",
            type: "Asymmetric Key Exchange",
            confidence: 0.94,
            evidence: [
              "RSA key exchange detected",
              "2048-bit modulus identified",
              "PKCS#1 padding scheme"
            ],
            functions: [
              {
                name: "rsa_verify_signature",
                operations: ["signature-verification", "certificate-check"],
                confidence: 0.95
              }
            ]
          }
        ]
      },
      {
        stageName: "Authentication/Integrity",
        order: 2,
        icon: "🔐",
        color: "green",
        algorithms: [
          {
            name: "SHA-256",
            type: "Cryptographic Hash Function",
            confidence: 0.98,
            evidence: [
              "SHA-256 constants detected",
              "Hash computation routine",
              "Message digest generation"
            ],
            functions: [
              {
                name: "sha256_hash",
                operations: ["hash", "compression"],
                confidence: 0.97
              },
              {
                name: "sha256_hmac",
                operations: ["hmac", "authentication"],
                confidence: 0.96
              }
            ]
          },
          {
            name: "HMAC-SHA256",
            type: "Message Authentication Code",
            confidence: 0.95,
            evidence: [
              "HMAC implementation found",
              "Key-dependent hashing",
              "Authentication tag generation"
            ],
            functions: [
              {
                name: "hmac_generate",
                operations: ["mac-generation", "authentication"],
                confidence: 0.94
              }
            ]
          }
        ]
      },
      {
        stageName: "Transport/Encryption",
        order: 3,
        icon: "🔒",
        color: "purple",
        algorithms: [
          {
            name: "AES-256-GCM",
            type: "Authenticated Encryption",
            confidence: 0.97,
            evidence: [
              "AES S-box detected",
              "GCM mode implementation",
              "256-bit key expansion",
              "Galois field multiplication"
            ],
            functions: [
              {
                name: "aes_gcm_encrypt",
                operations: ["encryption", "authentication", "nonce-generation"],
                confidence: 0.96
              },
              {
                name: "aes_gcm_decrypt",
                operations: ["decryption", "tag-verification"],
                confidence: 0.95
              },
              {
                name: "aes_key_expansion",
                operations: ["key-derivation", "round-keys"],
                confidence: 0.94
              }
            ]
          },
          {
            name: "ChaCha20-Poly1305",
            type: "Stream Cipher with Authentication",
            confidence: 0.93,
            evidence: [
              "ChaCha20 quarter-round detected",
              "Poly1305 MAC implementation",
              "AEAD construction"
            ],
            functions: [
              {
                name: "chacha20_encrypt",
                operations: ["stream-cipher", "encryption"],
                confidence: 0.92
              },
              {
                name: "poly1305_auth",
                operations: ["mac", "authentication"],
                confidence: 0.91
              }
            ]
          }
        ]
      }
    ]
  },
  {
    protocolId: "protocol-1",
    protocolName: "Custom Cryptographic Implementation",
    version: "Detected",
    description: "Proprietary cryptographic implementation without standard protocol identification",
    stages: [
      {
        stageName: "Authentication/Integrity",
        order: 2,
        icon: "🔐",
        color: "green",
        algorithms: [
          {
            name: "BLAKE2b",
            type: "Cryptographic Hash Function",
            confidence: 0.89,
            evidence: [
              "BLAKE2 initialization vector",
              "Compression function detected",
              "High-speed hashing"
            ],
            functions: [
              {
                name: "blake2b_hash",
                operations: ["hash", "digest"],
                confidence: 0.88
              }
            ]
          }
        ]
      },
      {
        stageName: "Transport/Encryption",
        order: 3,
        icon: "🔒",
        color: "purple",
        algorithms: [
          {
            name: "Salsa20",
            type: "Stream Cipher",
            confidence: 0.91,
            evidence: [
              "Salsa20 constants detected",
              "ARX structure identified",
              "Stream generation routine"
            ],
            functions: [
              {
                name: "salsa20_encrypt",
                operations: ["stream-cipher", "encryption"],
                confidence: 0.90
              }
            ]
          }
        ]
      }
    ]
  }
];

export const emptyProtocolData = [];

export const minimalProtocolData = [
  {
    protocolId: "minimal-protocol",
    protocolName: "Basic Encryption",
    version: "N/A",
    description: "Minimal cryptographic implementation with single algorithm",
    stages: [
      {
        stageName: "Transport/Encryption",
        order: 3,
        icon: "🔒",
        color: "purple",
        algorithms: [
          {
            name: "AES-128",
            type: "Block Cipher",
            confidence: 0.85,
            evidence: ["AES S-box detected"],
            functions: []
          }
        ]
      }
    ]
  }
];
