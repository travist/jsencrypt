# JSEncrypt

A zero dependency JavaScript library to perform both synchronous and asynchronous OpenSSL RSA Encryption, Decryption, and Key Generation in both the Browser and Node.js.

[![npm version](https://badge.fury.io/js/jsencrypt.svg)](https://www.npmjs.com/package/jsencrypt)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**🌐 Documentation:** [https://travistidwell.com/jsencrypt](https://travistidwell.com/jsencrypt)  
**📦 NPM Package:** [https://www.npmjs.com/package/jsencrypt](https://www.npmjs.com/package/jsencrypt)  
**🚀 Interactive Demo:** [https://travistidwell.com/jsencrypt/demo](https://travistidwell.com/jsencrypt/demo)

## Why JSEncrypt?

When choosing an RSA encryption library for JavaScript, you need a solution that's reliable, secure, and fits seamlessly into your development workflow. JSEncrypt delivers on all fronts.

**JSEncrypt stands out** by providing enterprise-grade RSA encryption capabilities without the complexity and security concerns that come with heavy dependencies.

### Key Benefits

- **🌐 Universal Compatibility** - Works seamlessly in both Node.js server environments and browser applications
- **📦 Zero Dependencies** - No external dependencies means better security posture and reduced bundle size
- **⚡ Flexible Execution** - Supports both synchronous and asynchronous JavaScript patterns
- **🔒 OpenSSL Compatible** - Direct support for PEM-formatted keys generated with OpenSSL
- **🛡️ Proven Security** - Built on Tom Wu's battle-tested jsbn library without modifying core algorithms
- **🚀 Production Ready** - Lightweight, well-tested, and used by thousands of developers worldwide

## Quick Start

### Installation

```bash
npm install jsencrypt
```

### Basic Usage

```javascript
import { JSEncrypt } from 'jsencrypt';

// Create the encryption object
const crypt = new JSEncrypt();

// Set your RSA private key
crypt.setPrivateKey(privateKey);

// Encrypt data with the public key
const encrypted = crypt.encrypt('Hello World!');

// Decrypt data with the private key  
const decrypted = crypt.decrypt(encrypted);
```


## Complete Example with OpenSSL

Here's a complete example showing how to use JSEncrypt with OpenSSL-generated keys:

### 1. Generate RSA Keys with OpenSSL

```bash
# Generate private key (2048-bit recommended for production)
openssl genrsa -out private.pem 2048

# Extract public key
openssl rsa -pubout -in private.pem -out public.pem

# View your keys
cat private.pem
cat public.pem
```

### 2. Use in Your Application

```javascript
import { JSEncrypt } from 'jsencrypt';

// Initialize
const crypt = new JSEncrypt();

// Load your private key (for both encryption and decryption)
crypt.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
-----END RSA PRIVATE KEY-----`);

// Or load just the public key (for encryption only)
crypt.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----`);

// Encrypt sensitive data
const originalText = 'Secret message';
const encrypted = crypt.encrypt(originalText);

// Decrypt when needed (requires private key)
const decrypted = crypt.decrypt(encrypted);
console.log(decrypted === originalText); // true
```

## Advanced Features

### Digital Signatures

```javascript
// Sign with the private key
const sign = new JSEncrypt();
sign.setPrivateKey(privateKey);
const signature = sign.sign(data, CryptoJS.SHA256, "sha256");

// Verify with the public key
const verify = new JSEncrypt();
verify.setPublicKey(publicKey);
const verified = verify.verify(data, signature, CryptoJS.SHA256);
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
const { JSEncrypt } = require('jsencrypt');
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

