---
layout: default
title: Home
description: "A JavaScript library to perform OpenSSL RSA Encryption, Decryption, and Key Generation"
permalink: /
nav_order: 1
---
# JSEncrypt
{: .fs-9 }

A zero dependency JavaScript library to perform both synchronous and asynchronous OpenSSL RSA Encryption, Decryption, and Key Generation in both the Browser and Node.js.
{: .fs-6 .fw-300 }

[Get started now](docs/getting-started){: .btn .btn-primary .fs-5 .mb-4 .mb-md-0 .mr-2 }
[View on GitHub](https://github.com/travist/jsencrypt){: .btn .fs-5 .mb-4 .mb-md-0 }

---

## Quick Start

JSEncrypt uses the wonderful work of [Tom Wu](http://www-cs-students.stanford.edu/~tjw/jsbn/) and provides a simple wrapper to perform RSA encryption with JavaScript. It's designed to work seamlessly with OpenSSL-generated RSA key pairs.

### Installation

```bash
npm install jsencrypt
```

### Basic Usage

```javascript
// Create the encryption object
const crypt = new JSEncrypt();

// Set your RSA private key
crypt.setPrivateKey(privateKey);

// Encrypt data with the public key
const encrypted = crypt.encrypt('Hello World!');

// Decrypt data with the private key  
const decrypted = crypt.decrypt(encrypted);
```

---

## Features

### 🔐 OpenSSL Compatible
Works seamlessly with OpenSSL-generated RSA key pairs in PEM format.

### 🌐 Browser & Node.js
Runs in both browser environments and Node.js applications.

### 📦 Zero Dependencies
Lightweight library with no external dependencies.

### 🔒 Secure Encryption
Implements proper RSA encryption/decryption algorithms.

### 📖 Well Documented
Comprehensive documentation with examples and best practices.

### 🧪 Thoroughly Tested
Extensively tested codebase ensuring reliability.

---

## Real-World Example
Here's a complete example showing how to use JSEncrypt with OpenSSL keys:

### 1. Generate RSA Keys with OpenSSL
```bash
# Generate private key
openssl genrsa -out private.pem 2048

# Extract public key
openssl rsa -pubout -in private.pem -out public.pem
```

### 2. Use in JavaScript

```javascript
import { JSEncrypt } from 'jsencrypt';

// Initialize
const crypt = new JSEncrypt();

// Load your keys
crypt.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
-----END RSA PRIVATE KEY-----`);

// Encrypt sensitive data
const originalText = 'Secret message';
const encrypted = crypt.encrypt(originalText);

// Decrypt when needed
const decrypted = crypt.decrypt(encrypted);
console.log(decrypted === originalText); // true
```

---

## Why JSEncrypt?
When choosing an RSA encryption library for JavaScript, you need a solution that's reliable, secure, and fits seamlessly into your development workflow. JSEncrypt delivers on all fronts.

**JSEncrypt stands out** by providing enterprise-grade RSA encryption capabilities without the complexity and security concerns that come with heavy dependencies.

### Key Benefits

- **🌐 Universal Compatibility** - Works seamlessly in both Node.js server environments and browser applications without any modifications or polyfills

- **📦 Zero Dependencies** - No external dependencies means better security posture, easier CVE management, and reduced bundle size for your applications

- **⚡ Flexible Execution** - Supports both synchronous and asynchronous JavaScript patterns, giving you the flexibility to integrate with any codebase architecture

- **🔒 OpenSSL Compatible** - Direct support for PEM-formatted keys generated with OpenSSL, eliminating the need for key format conversions

- **🛡️ Proven Security** - Built on Tom Wu's battle-tested jsbn library without modifying the core cryptographic algorithms

- **🚀 Production Ready** - Lightweight, well-tested, and used by thousands of developers worldwide

---

## Get Started
Ready to add secure RSA encryption to your project?

<div class="code-example" markdown="1">
**Try it now:** Check out our [interactive demo](demo/) to see JSEncrypt in action, or dive into the [documentation](docs/) to learn more.
</div>

[Get Started](docs/getting-started){: .btn .btn-primary .mr-2 }
[View Demo](demo/){: .btn .btn-outline }
[API Reference](docs/api/){: .btn .btn-outline }
