---
layout: default
title: Security Best Practices
parent: Docs
nav_order: 6
permalink: /docs/security/
---

# Security Best Practices
{: .fs-9 }

Essential security guidelines for implementing RSA encryption with JSEncrypt
{: .fs-6 .fw-300 }

---

## Overview

Security is paramount when implementing RSA encryption. This guide provides comprehensive security best practices to ensure your JSEncrypt implementation remains secure against common threats and vulnerabilities.

## Key Security Fundamentals

### Key Generation Security

**✅ Do:**
- Use OpenSSL for production key generation
- Generate keys with minimum 2048-bit size (4096-bit preferred)
- Use cryptographically secure random number generators
- Generate keys in secure environments

```bash
# Secure key generation with OpenSSL
openssl genrsa -out private.pem 4096

# Generate password-protected keys for additional security
openssl genrsa -aes256 -out private_protected.pem 4096
```

**❌ Don't:**
- Use JavaScript key generation for production (except specific use cases)
- Generate keys smaller than 2048 bits
- Reuse the same key pair across multiple applications
- Generate keys on untrusted machines

### Key Storage Security

**✅ Secure Storage Practices:**

```javascript
// Server-side (Node.js)
const fs = require('fs');
const path = require('path');

// Store keys outside web root
const KEYS_DIR = process.env.KEYS_DIR || '/secure/keys';
const privateKey = fs.readFileSync(
    path.join(KEYS_DIR, 'private.pem'),
    { encoding: 'utf8', mode: 0o600 } // Restrict file permissions
);

// Use environment variables
const keyPath = process.env.PRIVATE_KEY_PATH;
if (!keyPath) {
    throw new Error('PRIVATE_KEY_PATH environment variable not set');
}
```

**❌ Insecure Storage:**
```javascript
// Never do this:
const privateKey = "-----BEGIN RSA PRIVATE KEY-----..."; // Hardcoded in source
localStorage.setItem('privateKey', privateKey); // Client-side storage
const key = await fetch('/api/private-key'); // Exposing via API
```

## Data Protection

### Input Validation and Sanitization

```javascript
function secureEncrypt(data, crypt) {
    // Validate input
    if (typeof data !== 'string') {
        throw new Error('Data must be a string');
    }
    
    // Check data length (RSA has size limits)
    const keySize = crypt.getKey().n.bitLength();
    const maxLength = Math.floor(keySize / 8) - 11; // PKCS#1 padding overhead
    
    if (data.length > maxLength) {
        throw new Error(`Data too long. Maximum length: ${maxLength} bytes`);
    }
    
    // Validate key is loaded
    if (!crypt.getKey()) {
        throw new Error('No encryption key loaded');
    }
    
    return crypt.encrypt(data);
}
```

### Secure Data Handling

```javascript
class SecureDataHandler {
    constructor(privateKey) {
        this.crypt = new JSEncrypt();
        this.crypt.setPrivateKey(privateKey);
    }
    
    // Secure encryption with validation
    encrypt(plaintext) {
        if (!plaintext || typeof plaintext !== 'string') {
            throw new Error('Invalid plaintext data');
        }
        
        const encrypted = this.crypt.encrypt(plaintext);
        if (!encrypted) {
            throw new Error('Encryption failed');
        }
        
        return encrypted;
    }
    
    // Secure decryption with validation
    decrypt(ciphertext) {
        if (!ciphertext || typeof ciphertext !== 'string') {
            throw new Error('Invalid ciphertext data');
        }
        
        const decrypted = this.crypt.decrypt(ciphertext);
        if (decrypted === false) {
            throw new Error('Decryption failed - invalid ciphertext or key');
        }
        
        return decrypted;
    }
    
    // Clear sensitive data from memory
    destroy() {
        this.crypt = null;
    }
}
```

## Authentication and Signatures

### Digital Signatures

```javascript
import { JSEncrypt } from 'jsencrypt';
import { sha256 } from 'crypto-hash'; // Or your preferred hash library

class SecureSignature {
    constructor(privateKey, publicKey) {
        this.signer = new JSEncrypt();
        this.verifier = new JSEncrypt();
        
        this.signer.setPrivateKey(privateKey);
        this.verifier.setPublicKey(publicKey);
    }
    
    // Sign data with SHA-256 hashing
    async signData(data) {
        // Hash the data first
        const hash = await sha256(data);
        
        // Sign the hash
        const signature = this.signer.sign(hash, 'sha256');
        if (!signature) {
            throw new Error('Signature generation failed');
        }
        
        return {
            data: data,
            signature: signature,
            algorithm: 'SHA256withRSA',
            timestamp: new Date().toISOString()
        };
    }
    
    // Verify signature
    async verifySignature(signedData) {
        const { data, signature, algorithm } = signedData;
        
        if (algorithm !== 'SHA256withRSA') {
            throw new Error('Unsupported signature algorithm');
        }
        
        // Hash the data
        const hash = await sha256(data);
        
        // Verify signature
        return this.verifier.verify(hash, signature, 'sha256');
    }
}
```

### SHA-256 Convenience Methods

```javascript
// Using JSEncrypt's built-in SHA-256 methods (secure)
const crypt = new JSEncrypt();
crypt.setPrivateKey(privateKey);

// Sign with SHA-256
const message = "Important document content";
const signature = crypt.signSha256(message);

// Verify signature
const isValid = crypt.verifySha256(message, signature);
if (!isValid) {
    throw new Error('Signature verification failed');
}
```

## Network Security

### Secure Communication

```javascript
// Example: Secure API communication
class SecureAPI {
    constructor(publicKey, privateKey) {
        this.encryptor = new JSEncrypt();
        this.decryptor = new JSEncrypt();
        
        this.encryptor.setPublicKey(publicKey);
        this.decryptor.setPrivateKey(privateKey);
    }
    
    async sendSecureRequest(endpoint, data) {
        // Encrypt sensitive data
        const encryptedData = this.encryptor.encrypt(JSON.stringify(data));
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Encryption': 'RSA-OAEP'
            },
            body: JSON.stringify({ encrypted: encryptedData })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Decrypt response if encrypted
        if (result.encrypted) {
            const decrypted = this.decryptor.decrypt(result.encrypted);
            return JSON.parse(decrypted);
        }
        
        return result;
    }
}
```

### HTTPS and Transport Security

```javascript
// Always use HTTPS in production
const secureEndpoint = 'https://api.example.com/secure';
// Never: const insecureEndpoint = 'http://api.example.com/secure';

// Validate SSL certificates
const response = await fetch(secureEndpoint, {
    headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    }
});
```

## Error Handling and Logging

### Secure Error Handling

```javascript
class SecureEncryption {
    constructor(config) {
        this.crypt = new JSEncrypt(config);
        this.logger = config.logger || console;
    }
    
    encrypt(data) {
        try {
            const result = this.crypt.encrypt(data);
            if (!result) {
                // Log error without exposing sensitive data
                this.logger.error('Encryption failed', {
                    timestamp: new Date().toISOString(),
                    operation: 'encrypt',
                    keyLoaded: !!this.crypt.getKey()
                });
                throw new Error('Encryption operation failed');
            }
            return result;
        } catch (error) {
            // Don't log the actual data being encrypted
            this.logger.error('Encryption error', {
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }
    
    decrypt(ciphertext) {
        try {
            const result = this.crypt.decrypt(ciphertext);
            if (result === false) {
                this.logger.warn('Decryption failed', {
                    timestamp: new Date().toISOString(),
                    operation: 'decrypt',
                    ciphertextLength: ciphertext.length
                });
                throw new Error('Decryption failed');
            }
            return result;
        } catch (error) {
            // Log error without exposing plaintext or keys
            this.logger.error('Decryption error', {
                error: error.message,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }
}
```

### Safe Logging Practices

```javascript
// ✅ Safe logging
logger.info('Encryption successful', {
    operation: 'encrypt',
    keySize: crypt.getKey().n.bitLength(),
    timestamp: new Date().toISOString()
});

// ❌ Dangerous logging
logger.info('Encrypting data', { data: sensitiveData }); // Exposes data
logger.debug('Using key', { privateKey: privateKey }); // Exposes key
```

## Memory and Resource Security

### Secure Memory Handling

```javascript
class SecureKeyManager {
    constructor() {
        this.keys = new Map();
    }
    
    addKey(keyId, privateKey) {
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(privateKey);
        
        this.keys.set(keyId, {
            crypt: crypt,
            created: Date.now(),
            lastUsed: Date.now()
        });
    }
    
    // Use key and update last used time
    useKey(keyId, operation, data) {
        const keyData = this.keys.get(keyId);
        if (!keyData) {
            throw new Error('Key not found');
        }
        
        keyData.lastUsed = Date.now();
        
        if (operation === 'encrypt') {
            return keyData.crypt.encrypt(data);
        } else if (operation === 'decrypt') {
            return keyData.crypt.decrypt(data);
        }
        
        throw new Error('Invalid operation');
    }
    
    // Clean up old keys
    cleanup(maxAge = 3600000) { // 1 hour default
        const now = Date.now();
        for (const [keyId, keyData] of this.keys.entries()) {
            if (now - keyData.lastUsed > maxAge) {
                this.removeKey(keyId);
            }
        }
    }
    
    // Securely remove key from memory
    removeKey(keyId) {
        const keyData = this.keys.get(keyId);
        if (keyData) {
            // Clear the key object
            keyData.crypt = null;
            this.keys.delete(keyId);
        }
    }
    
    // Clean up all keys
    destroy() {
        for (const keyId of this.keys.keys()) {
            this.removeKey(keyId);
        }
    }
}
```

## Input Validation and Sanitization

### Comprehensive Input Validation

```javascript
class InputValidator {
    static validateEncryptionInput(data) {
        // Type validation
        if (typeof data !== 'string') {
            throw new Error('Encryption input must be a string');
        }
        
        // Length validation
        if (data.length === 0) {
            throw new Error('Cannot encrypt empty data');
        }
        
        // Size validation (will be checked against key size)
        if (data.length > 4096) {
            throw new Error('Data too large for RSA encryption');
        }
        
        return true;
    }
    
    static validateDecryptionInput(ciphertext) {
        if (typeof ciphertext !== 'string') {
            throw new Error('Ciphertext must be a string');
        }
        
        if (ciphertext.length === 0) {
            throw new Error('Cannot decrypt empty ciphertext');
        }
        
        // Basic base64 validation for RSA output
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(ciphertext)) {
            throw new Error('Invalid ciphertext format');
        }
        
        return true;
    }
    
    static validateKeyInput(keyString) {
        if (typeof keyString !== 'string') {
            throw new Error('Key must be a string');
        }
        
        // Check for PEM headers
        const hasPrivateHeader = keyString.includes('-----BEGIN RSA PRIVATE KEY-----');
        const hasPublicHeader = keyString.includes('-----BEGIN PUBLIC KEY-----');
        
        if (!hasPrivateHeader && !hasPublicHeader) {
            throw new Error('Invalid key format - missing PEM headers');
        }
        
        return true;
    }
}
```

## Production Deployment Security

### Environment Configuration

```javascript
// production-config.js
module.exports = {
    // Security headers
    security: {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    },
    
    // Key management
    encryption: {
        keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours
        minKeySize: 2048,
        preferredKeySize: 4096,
        keyStoragePath: process.env.KEY_STORAGE_PATH,
        backupKeyPath: process.env.BACKUP_KEY_PATH
    },
    
    // Monitoring
    logging: {
        level: 'info',
        auditEncryption: true,
        auditDecryption: true,
        auditKeyAccess: true
    }
};
```

### Security Monitoring

```javascript
class SecurityMonitor {
    constructor(config) {
        this.config = config;
        this.metrics = {
            encryptionCount: 0,
            decryptionCount: 0,
            failureCount: 0,
            keyAccessCount: 0
        };
    }
    
    logEncryption(success, keySize) {
        this.metrics.encryptionCount++;
        
        if (!success) {
            this.metrics.failureCount++;
            this.alertSecurityTeam('encryption_failure', {
                timestamp: new Date().toISOString(),
                keySize: keySize
            });
        }
    }
    
    logKeyAccess(keyId, operation) {
        this.metrics.keyAccessCount++;
        
        // Log key access for audit
        console.log(JSON.stringify({
            event: 'key_access',
            keyId: keyId,
            operation: operation,
            timestamp: new Date().toISOString(),
            source: this.getRequestSource()
        }));
    }
    
    alertSecurityTeam(event, details) {
        // Implement your security alerting system
        console.error('SECURITY ALERT:', event, details);
    }
    
    getRequestSource() {
        // Implement request source tracking
        return process.env.NODE_ENV || 'unknown';
    }
    
    getMetrics() {
        return { ...this.metrics };
    }
}
```

## Security Checklist

### Pre-Production Checklist

- [ ] **Key Generation**: Using OpenSSL with 2048+ bit keys
- [ ] **Key Storage**: Keys stored securely outside web root
- [ ] **Environment Variables**: Sensitive configuration in env vars
- [ ] **Input Validation**: All inputs validated and sanitized
- [ ] **Error Handling**: No sensitive data in error messages
- [ ] **Logging**: Security events logged, sensitive data excluded
- [ ] **HTTPS**: All communication over HTTPS in production
- [ ] **Memory Management**: Sensitive data cleared from memory
- [ ] **Key Rotation**: Key rotation strategy implemented
- [ ] **Monitoring**: Security monitoring and alerting in place

### Runtime Security Monitoring

- [ ] **Failed Decryption Attempts**: Monitor and alert on failures
- [ ] **Key Access Patterns**: Log all key access attempts
- [ ] **Performance Anomalies**: Monitor for unusual patterns
- [ ] **Error Rates**: Track encryption/decryption error rates
- [ ] **Key Age**: Monitor key age and rotation schedules

---

## Common Security Pitfalls

### What NOT to Do

```javascript
// ❌ Never hardcode keys
const PRIVATE_KEY = "-----BEGIN RSA PRIVATE KEY-----...";

// ❌ Never log sensitive data
console.log('Decrypted data:', decryptedPassword);

// ❌ Never expose keys in client-side code
window.privateKey = getPrivateKey();

// ❌ Never ignore encryption failures
const encrypted = crypt.encrypt(data);
// No check if encryption succeeded

// ❌ Never use weak key sizes
const weakCrypt = new JSEncrypt({ default_key_size: 512 });
```

---

## Additional Resources

- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [NIST Cryptographic Standards](https://csrc.nist.gov/projects/cryptographic-standards-and-guidelines)
- [Key Management Best Practices](../key-management/)
- [JSEncrypt API Reference](../api/)
