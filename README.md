# JSEncrypt

A tiny (18.5kB gzip), zero dependency, JavaScript library to perform both synchronous and asynchronous OpenSSL RSA Encryption, Decryption, and Key Generation in both the Browser and Node.js.

[![npm version](https://badge.fury.io/js/jsencrypt.svg)](https://www.npmjs.com/package/jsencrypt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**🌐 Documentation:** [https://travistidwell.com/jsencrypt](https://travistidwell.com/jsencrypt)  
**📦 NPM Package:** [https://www.npmjs.com/package/jsencrypt](https://www.npmjs.com/package/jsencrypt)  
**🚀 Interactive Demo:** [https://travistidwell.com/jsencrypt/demo](https://travistidwell.com/jsencrypt/demo)

## Why JSEncrypt?

When choosing an RSA encryption library for JavaScript, you need a solution that's reliable, secure, and fits seamlessly into your development workflow. JSEncrypt delivers on all fronts.

**JSEncrypt stands out** by providing enterprise-grade RSA encryption capabilities without the complexity and security concerns that come with heavy dependencies.

### Key Benefits

- **⚡ Tiny & Fast** - Just 18.5 kB gzipped - minimal impact on your bundle size.
- **🌐 Universal Compatibility** - Works seamlessly in both Node.js server environments and browser applications
- **📦 Zero Dependencies** - No external dependencies means better security posture and reduced bundle size
- **⚡ Flexible Execution** - Supports both synchronous and asynchronous JavaScript patterns
- **🔒 OpenSSL Compatible** - Direct support for PEM-formatted keys generated with OpenSSL
- **🛡️ Proven Security** - Built on Tom Wu's battle-tested jsbn library without modifying core algorithms
- **🚀 Production Ready** - Lightweight, well-tested, and used by thousands of developers worldwide

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
const JSEncrypt = require('jsencrypt');
```

#### Browser Global
```javascript
// JSEncrypt is available globally when using CDN
const crypt = new JSEncrypt();
```

### 2. Create RSA Keys

For the highest security, you'll need RSA key pairs to use JSEncrypt. Generate them using OpenSSL:

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

## Key Generation

JSEncrypt supports two approaches for obtaining RSA keys: **OpenSSL generation (recommended)** and **JavaScript generation (convenient but less secure)**.

### Option 1: OpenSSL Key Generation (Recommended)

For production applications and maximum security, generate keys using OpenSSL:

```bash
# Generate a 2048-bit private key (recommended minimum)
openssl genrsa -out private.pem 2048

# Generate a 4096-bit private key (higher security)
openssl genrsa -out private.pem 4096

# Extract the public key
openssl rsa -pubout -in private.pem -out public.pem

# View the private key
cat private.pem

# View the public key  
cat public.pem
```

**Why OpenSSL is more secure:**
- Uses cryptographically secure random number generators
- Better entropy sources from the operating system
- Optimized and audited implementations
- Industry standard for key generation

### Option 2: JavaScript Key Generation (Convenience)

JSEncrypt can generate keys directly in JavaScript, which is convenient for testing, demos, or non-critical applications:

```javascript
// Create JSEncrypt instance
const crypt = new JSEncrypt();

// Generate a new key pair (default: 1024-bit)
const privateKey = crypt.getPrivateKey();
const publicKey = crypt.getPublicKey();

console.log('Private Key:', privateKey);
console.log('Public Key:', publicKey);

// You can also specify key size (512, 1024, 2048, 4096)
const crypt2048 = new JSEncrypt({ default_key_size: 2048 });
const strongerPrivateKey = crypt2048.getPrivateKey();
const strongerPublicKey = crypt2048.getPublicKey();
```

#### Asynchronous Key Generation

For better performance (especially with larger keys), use async generation:

```javascript
// Asynchronous key generation (recommended for larger keys)
const crypt = new JSEncrypt({ default_key_size: 2048 });

crypt.getKey(() => {
    const privateKey = crypt.getPrivateKey();
    const publicKey = crypt.getPublicKey();
    
    console.log('Generated private key:', privateKey);
    console.log('Generated public key:', publicKey);
    
    // Now you can use the keys
    const encrypted = crypt.encrypt('Hello, World!');
    const decrypted = crypt.decrypt(encrypted);
});
```

#### Different Key Sizes

```javascript
// 512-bit (fast but less secure - only for testing)
const crypt512 = new JSEncrypt({ default_key_size: 512 });

// 1024-bit (default - basic security)
const crypt1024 = new JSEncrypt({ default_key_size: 1024 });

// 2048-bit (recommended minimum for production)
const crypt2048 = new JSEncrypt({ default_key_size: 2048 });

// 4096-bit (high security but slower)
const crypt4096 = new JSEncrypt({ default_key_size: 4096 });
```

**⚠️ Security Note:** JavaScript key generation uses browser/Node.js random number generators which may have less entropy than dedicated cryptographic tools. For production applications handling sensitive data, prefer OpenSSL-generated keys.

**💡 Use Cases for JavaScript Generation:**
- Rapid prototyping and testing
- Client-side demos and examples  
- Educational purposes
- Non-critical applications
- When OpenSSL is not available

## Advanced Features

### Digital Signatures

```javascript
// Sign with the private key
const sign = new JSEncrypt();
sign.setPrivateKey(privateKey);
const signature = sign.signSha256(data);

// Verify with the public key
const verify = new JSEncrypt();
verify.setPublicKey(publicKey);
const verified = verify.verifySha256(data, signature);
```

### OAEP Padding

```javascript
// Encrypt with OAEP padding and SHA-256 hash
const encrypt = new JSEncrypt();
encrypt.setPublicKey(publicKey);
const encrypted = encrypt.encryptOAEP(data);
```

### Supported Hash Functions

When using signatures, you can specify the hash type:
- `md2`, `md5`, `sha1`, `sha224`, `sha256`, `sha384`, `sha512`, `ripemd160`

## Browser Usage

For direct browser usage without a build system:

```html
<!DOCTYPE html>
<html>
<head>
    <title>JSEncrypt Example</title>
    <script src="https://cdn.jsdelivr.net/npm/jsencrypt/bin/jsencrypt.min.js"></script>
</head>
<body>
    <script>
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(crypt.getPrivateKey());
        
        // Use the library
        const encrypted = crypt.encrypt('Hello World!');
        const decrypted = crypt.decrypt(encrypted);
        
        console.log('Original:', 'Hello World!');
        console.log('Encrypted:', encrypted);
        console.log('Decrypted:', decrypted);
    </script>
</body>
</html>
```

## Node.js Usage

For use within Node.js, you can use the following.

```js
const JSEncrypt = require('jsencrypt');
const crypt = new JSEncrypt();
crypt.setPrivateKey(crypt.getPrivateKey());

// Use the library
const encrypted = crypt.encrypt('Hello World!');
const decrypted = crypt.decrypt(encrypted);

console.log('Original:', 'Hello World!');
console.log('Encrypted:', encrypted);
console.log('Decrypted:', decrypted);
```

## Development & Testing

### Running Tests

```bash
# Run all tests (Node.js + Browser)
npm test

# Run only Node.js tests  
npm run test:mocha

# Run only example validation tests
npm run test:examples

# Build the library
npm run build

# Build test bundle for browser testing
npm run build:test
```

### Browser Tests

Visit the test page to run browser-based tests:
- **Local development:** `http://localhost:4000/test/` (when running Jekyll)
- **Online:** [https://travistidwell.com/jsencrypt/test/](https://travistidwell.com/jsencrypt/test/)

## Documentation

For comprehensive documentation, examples, and API reference:

**📖 [Visit the Documentation Site](https://travistidwell.com/jsencrypt)**

- [Getting Started Guide](https://travistidwell.com/jsencrypt/docs/getting-started)
- [API Reference](https://travistidwell.com/jsencrypt/docs/api)
- [Examples & Use Cases](https://travistidwell.com/jsencrypt/docs/examples)
- [Interactive Demo](https://travistidwell.com/jsencrypt/demo)

## Technical Background

This library provides a simple JavaScript wrapper around Tom Wu's excellent [jsbn library](http://www-cs-students.stanford.edu/~tjw/jsbn/). The core cryptographic functions remain untouched, ensuring security and reliability.

### Key Format Support

JSEncrypt works with standard PEM-formatted RSA keys:

**Private Key (PKCS#1):**
```
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDHikastc8+I81zCg/qWW8dMr8mqvXQ3qbPAmu0RjxoZVI47tvs...
-----END RSA PRIVATE KEY-----
```

**Public Key (PKCS#8):**
```
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN...
-----END PUBLIC KEY-----
```

### RSA Variable Mappings

The library translates PEM key components to jsbn library variables:

| PEM Component | jsbn Variable |
|---------------|---------------|
| modulus | n |
| public exponent | e |
| private exponent | d |
| prime1 | p |
| prime2 | q |
| exponent1 | dmp1 |
| exponent2 | dmq1 |
| coefficient | coeff |

## Contributing

Contributions are welcome! Please read our contributing guidelines and ensure all tests pass before submitting a pull request.

```bash
# Clone the repository
git clone https://github.com/travist/jsencrypt.git
cd jsencrypt

# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.

## Resources

- **Tom Wu's jsbn library:** http://www-cs-students.stanford.edu/~tjw/jsbn/
- **RSA Key Breakdown:** http://etherhack.co.uk/asymmetric/docs/rsa_key_breakdown.html
- **RSA Algorithm Details:** http://www.di-mgt.com.au/rsa_alg.html
- **ASN.1 Key Structures:** https://polarssl.org/kb/cryptography/asn1-key-structures-in-der-and-pem

---

**Made with ❤️ by [Travis Tidwell](https://github.com/travist)**

