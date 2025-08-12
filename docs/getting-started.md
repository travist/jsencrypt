---
layout: default
title: Getting Started
parent: Docs
nav_order: 1
permalink: /docs/getting-started/
aliases:
  - /docs/getting-started.html
---

# Getting Started with JSEncrypt
{: .no_toc }

This guide will help you get up and running with JSEncrypt in just a few minutes.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Installation

### Using npm

```bash
npm install jsencrypt
```

### Using yarn

```bash
yarn add jsencrypt
```

### Using CDN

Include JSEncrypt directly in your HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/jsencrypt@latest/bin/jsencrypt.min.js"></script>
```

## Basic Usage

### 1. Import the Library

#### ES6 Modules
```javascript
import { JSEncrypt } from 'jsencrypt';
```

#### CommonJS
```javascript
const { JSEncrypt } = require('jsencrypt');
```

#### Browser Global
```javascript
// JSEncrypt is available globally when using CDN
const crypt = new JSEncrypt();
```

### 2. Create RSA Keys

You'll need RSA key pairs to use JSEncrypt. Generate them using OpenSSL:

```bash
# Generate a 2048-bit private key
openssl genrsa -out private.pem 2048

# Extract the public key
openssl rsa -pubout -in private.pem -out public.pem
```

### 3. Basic Encryption/Decryption

```javascript
// Create JSEncrypt instance
const crypt = new JSEncrypt();

// Set your private key (for decryption)
crypt.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT9u
U38KPhX7l3YXkLMfJj8sE3PUi0EaL6rN6rOUY8dq1fQhPhT1wfI6V8KQtQnq
1FKnNgQCVmQpCxK7qFR7Z+9MRWoJrPb8lZMmT1ELkKL6FBfkp3H3WcTl+BF0
XoZnLK0CfXfKzPJPm9jfKKE7dqnCsRiXYJbBwkNpQ5xo2lRKnNaH8GjPzJ4X
TZ5J7G6hDpXN1F3YzWZNVQRzfDfLB+w9FDaZ5kFhRc2PgB1Y8dNOhgK7RFJF
JDZhqBhSRnQ1YkLkQOnHq4Bz8l7YgRJkJHdIfTOO8l3YXkLMfJj8sE3PUi0E
qL6r9OOCzGJnVgQCVmQpCxK7qFR7Z+9MRWoJrPb8lZMmT1ELkKL6FBfkp3H3
...
-----END RSA PRIVATE KEY-----`);

// The public key is automatically derived from the private key
// Or you can set it explicitly:
// crypt.setPublicKey('-----BEGIN PUBLIC KEY-----...');

// Encrypt data
const originalText = 'Hello, World!';
const encrypted = crypt.encrypt(originalText);

// Decrypt data
const decrypted = crypt.decrypt(encrypted);

console.log('Original:', originalText);
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
console.log('Match:', originalText === decrypted); // true
```

## Key Concepts

### Public vs Private Keys

- **Public Key**: Used for **encryption**. Safe to share publicly.
- **Private Key**: Used for **decryption**. Keep this secret!

```javascript
const crypt = new JSEncrypt();

// For encryption only (using public key)
crypt.setPublicKey(publicKeyString);
const encrypted = crypt.encrypt('secret message');

// For decryption (requires private key)
crypt.setPrivateKey(privateKeyString);  
const decrypted = crypt.decrypt(encrypted);
```

### Key Size Limitations

RSA encryption has limitations based on key size:

- **1024-bit key**: Can encrypt up to 117 bytes
- **2048-bit key**: Can encrypt up to 245 bytes  
- **4096-bit key**: Can encrypt up to 501 bytes

For larger data, use hybrid encryption (RSA + AES).

## Next Steps

Now that you have JSEncrypt working, explore these topics:

- **[API Reference](../api/)** - Complete method documentation
- **[Examples](../examples/)** - Real-world usage patterns
- **[Key Management](../key-management/)** - Advanced key handling
- **[Security Best Practices](../security/)** - Keep your app secure

---

## Troubleshooting

### Common Issues

**"Invalid key" error**
: Make sure your key is in PEM format and includes the BEGIN/END headers.

**"Message too long" error**  
: Your message exceeds the key size limit. Use shorter messages or implement hybrid encryption.

**Encryption works but decryption fails**
: Ensure you're using the correct private key that corresponds to the public key used for encryption.

### Getting Help

If you're still having issues:

1. Check our [Examples](../examples/) for working code
2. Search [existing issues](https://github.com/travist/jsencrypt/issues) on GitHub
3. [Open a new issue](https://github.com/travist/jsencrypt/issues/new) with a minimal reproduction case
