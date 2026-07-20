---
layout: default
title: Key Management
parent: Docs
nav_order: 5
permalink: /docs/key-management/
---

# Key Management
{: .fs-9 }

Comprehensive guide to managing RSA keys with JSEncrypt
{: .fs-6 .fw-300 }

---

## Overview

Proper key management is crucial for maintaining the security of your RSA encryption implementation. This guide covers best practices for generating, storing, and using RSA keys with JSEncrypt.

## Key Generation Methods

### OpenSSL Generation (Recommended)

For production applications, generate keys using OpenSSL for maximum security:

```bash
# Generate 2048-bit private key (minimum recommended)
openssl genrsa -out private.pem 2048

# Generate 4096-bit private key (higher security)
openssl genrsa -out private.pem 4096

# Extract public key
openssl rsa -pubout -in private.pem -out public.pem

# Generate encrypted private key (password protected)
openssl genrsa -aes256 -out private_encrypted.pem 2048
```

### JSEncrypt Generation (Development/Testing)

For development, testing, or client-side applications:

```javascript
import { JSEncrypt } from 'jsencrypt';

// Generate key pair synchronously
const crypt = new JSEncrypt({ default_key_size: 2048 });
const privateKey = crypt.getPrivateKey();
const publicKey = crypt.getPublicKey();

// Generate key pair asynchronously (recommended for larger keys)
const cryptAsync = new JSEncrypt({ default_key_size: 2048 });
cryptAsync.getKey(() => {
    const privateKey = cryptAsync.getPrivateKey();
    const publicKey = cryptAsync.getPublicKey();
    // Keys are ready to use
});
```

## Key Formats

### PEM Format (Standard)

JSEncrypt supports standard PEM-formatted keys:

**Private Key (PKCS#1):**
```
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT9u...
-----END RSA PRIVATE KEY-----
```

**Public Key (PKCS#8):**
```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDw...
-----END PUBLIC KEY-----
```

### Key Components

RSA keys contain several mathematical components:

| Component | Description | JSEncrypt Property |
|-----------|-------------|-------------------|
| n | Modulus | `getKey().n` |
| e | Public exponent | `getKey().e` |
| d | Private exponent | `getKey().d` |
| p | Prime factor 1 | `getKey().p` |
| q | Prime factor 2 | `getKey().q` |
| dmp1 | d mod (p-1) | `getKey().dmp1` |
| dmq1 | d mod (q-1) | `getKey().dmq1` |
| coeff | Coefficient | `getKey().coeff` |

## Working with Keys

### Loading Existing Keys

```javascript
import { JSEncrypt } from 'jsencrypt';

const crypt = new JSEncrypt();

// Load private key (enables both encryption and decryption)
crypt.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
-----END RSA PRIVATE KEY-----`);

// Load public key only (encryption only)
crypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD...
-----END PUBLIC KEY-----`);
```

### Extracting Keys

```javascript
// Get keys as PEM strings
const privateKeyPEM = crypt.getPrivateKey();
const publicKeyPEM = crypt.getPublicKey();

// Get keys as base64 (without headers)
const privateKeyB64 = crypt.getPrivateKeyB64();
const publicKeyB64 = crypt.getPublicKeyB64();

// Get key object for advanced operations
const keyObject = crypt.getKey();
console.log('Key size:', keyObject.n.bitLength());
```

### Key Validation

```javascript
function validateKey(crypt) {
    const key = crypt.getKey();
    
    if (!key) {
        throw new Error('No key loaded');
    }
    
    // Check key size
    const keySize = key.n.bitLength();
    if (keySize < 1024) {
        console.warn(`Key size ${keySize} is below recommended minimum (2048)`);
    }
    
    // Test encryption/decryption if private key is available
    if (key.d) {
        const testMessage = 'test';
        const encrypted = crypt.encrypt(testMessage);
        const decrypted = crypt.decrypt(encrypted);
        
        if (testMessage !== decrypted) {
            throw new Error('Key validation failed: encryption/decryption mismatch');
        }
    }
    
    return true;
}
```

## Troubleshooting

### Common Key Issues

**1. Invalid Key Format**
```javascript
// Ensure proper PEM headers and line breaks
const invalidKey = "MIIEowIBAAKCAQEA..."; // Missing headers
const validKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
-----END RSA PRIVATE KEY-----`;
```

**2. Key Size Problems**
```javascript
// Check key size
const keySize = crypt.getKey().n.bitLength();
if (keySize < 2048) {
    console.warn('Key size too small for production use');
}
```

**3. Mixed Key Types**
```javascript
// Don't mix different key types
// Wrong:
crypt.setPublicKey(somePrivateKey);

// Correct:
crypt.setPrivateKey(privateKey); // Sets both private and derives public
// OR
crypt.setPublicKey(publicKey);   // Sets only public key
```

### Key Compatibility

```javascript
// Test key compatibility
function testKeyCompatibility(privateKey, publicKey) {
    const sender = new JSEncrypt();
    const receiver = new JSEncrypt();
    
    sender.setPublicKey(publicKey);
    receiver.setPrivateKey(privateKey);
    
    const testData = 'compatibility test';
    const encrypted = sender.encrypt(testData);
    const decrypted = receiver.decrypt(encrypted);
    
    return testData === decrypted;
}
```

## Security Considerations

- **Never expose private keys** in client-side code or logs
- **Use strong key sizes** (minimum 2048-bit for production)
- **Implement key rotation** for long-running applications
- **Validate key integrity** before use
- **Use encrypted storage** for sensitive keys
- **Monitor key usage** and access patterns

---

## Next Steps

- Review [Security Best Practices](../security/) for comprehensive security guidance
- Check the [API Reference](../api/) for detailed method documentation
- Explore [Examples](../examples/) for practical implementation patterns
