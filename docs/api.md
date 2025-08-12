---
layout: default
title: API Reference
parent: Docs
nav_order: 2
permalink: /docs/api/
aliases:
  - /docs/api.html
---

# API Reference
{: .no_toc }

Complete reference for all JSEncrypt methods and properties.

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}

---

## Constructor

### `new JSEncrypt(options?)`

Creates a new JSEncrypt instance.

#### Parameters

| Parameter | Type | Default | Description |
|:----------|:-----|:--------|:------------|
| `options` | `Object` | `{}` | Configuration options |
| `options.default_key_size` | `number` | `1024` | Default key size for key generation |

#### Example

```javascript
// Default constructor
const crypt = new JSEncrypt();

// With custom key size
const crypt = new JSEncrypt({ default_key_size: 2048 });
```

---

## Key Management

### `setKey(key)`
{: .d-inline-block }

Alias
{: .label .label-yellow }

Sets either a private or public key. This is an alias for both `setPrivateKey()` and `setPublicKey()`.

#### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `key` | `string` | PEM-formatted RSA key |

#### Example

```javascript
// Can be used with either key type
crypt.setKey(privateKeyPem);
crypt.setKey(publicKeyPem);
```

### `setPrivateKey(key)`

Sets the private key for decryption operations.

#### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `key` | `string` | PEM-formatted RSA private key |

#### Returns

`void`

#### Example

```javascript
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA4f5wg5l2hKsTeNem/V41fGnJm6gOdrj8ym3rFkEjWT9u
...
-----END RSA PRIVATE KEY-----`;

crypt.setPrivateKey(privateKey);
```

### `setPublicKey(key)`

Sets the public key for encryption operations.

#### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `key` | `string` | PEM-formatted RSA public key |

#### Returns

`void`

#### Example

```javascript
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4f5wg5l2hKsTeNem
...
-----END PUBLIC KEY-----`;

crypt.setPublicKey(publicKey);
```

### `getPrivateKey()`

Returns the current private key in PEM format.

#### Returns

`string` - PEM-formatted private key

#### Example

```javascript
const privateKey = crypt.getPrivateKey();
console.log(privateKey);
```

### `getPublicKey()`

Returns the current public key in PEM format. If only a private key is set, this will derive and return the corresponding public key.

#### Returns

`string` - PEM-formatted public key

#### Example

```javascript
// After setting a private key
crypt.setPrivateKey(privateKey);
const publicKey = crypt.getPublicKey(); // Derived from private key
```

### `getKey(callback?)`

Generates a new RSA key pair.

#### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `callback` | `function` | Optional callback for async generation |

#### Returns

- If `callback` provided: `void` (result passed to callback)
- If no callback: `Object` with `key` property

#### Example

```javascript
// Synchronous generation
const result = crypt.getKey();
console.log('Generated key');

// Asynchronous generation
crypt.getKey(() => {
  console.log('Key generated asynchronously');
  const privateKey = crypt.getPrivateKey();
  const publicKey = crypt.getPublicKey();
});
```

---

## Encryption/Decryption

### `encrypt(text)`

Encrypts the given text using the current public key.

#### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `text` | `string` | Text to encrypt |

#### Returns

`string | false` - Base64-encoded encrypted text, or `false` if encryption fails

#### Example

```javascript
crypt.setPublicKey(publicKey);
const encrypted = crypt.encrypt('Hello, World!');

if (encrypted) {
  console.log('Encrypted:', encrypted);
} else {
  console.log('Encryption failed');
}
```

#### Notes

- Requires a public key to be set
- Input length is limited by key size (see [Key Size Limitations](../getting-started/#key-size-limitations))
- Returns `false` if no key is set or encryption fails

### `decrypt(text)`

Decrypts the given encrypted text using the current private key.

#### Parameters

| Parameter | Type | Description |
|:----------|:-----|:------------|
| `text` | `string` | Base64-encoded encrypted text |

#### Returns

`string | false` - Decrypted text, or `false` if decryption fails

#### Example

```javascript
crypt.setPrivateKey(privateKey);
const decrypted = crypt.decrypt(encryptedText);

if (decrypted) {
  console.log('Decrypted:', decrypted);
} else {
  console.log('Decryption failed');
}
```

#### Notes

- Requires a private key to be set
- Returns `false` if no key is set, wrong key is used, or decryption fails

---

## Signing/Verification

### `sign(text, digestMethod, digestEncoding)`

Signs the given text using the private key.

#### Parameters

| Parameter | Type | Default | Description |
|:----------|:-----|:--------|:------------|
| `text` | `string` | - | Text to sign |
| `digestMethod` | `string` | `'sha256'` | Hash algorithm |
| `digestEncoding` | `string` | `'base64'` | Encoding for the signature |

#### Returns

`string | false` - Signature, or `false` if signing fails

#### Example

```javascript
crypt.setPrivateKey(privateKey);
const signature = crypt.sign('message to sign');
console.log('Signature:', signature);
```

### `verify(text, signature, digestMethod)`

Verifies a signature using the public key.

#### Parameters

| Parameter | Type | Default | Description |
|:----------|:-----|:--------|:------------|
| `text` | `string` | - | Original text |
| `signature` | `string` | - | Signature to verify |
| `digestMethod` | `string` | `'sha256'` | Hash algorithm |

#### Returns

`boolean` - `true` if signature is valid, `false` otherwise

#### Example

```javascript
crypt.setPublicKey(publicKey);
const isValid = crypt.verify('message to sign', signature);
console.log('Signature valid:', isValid);
```

---

## Utility Methods

### `getKeySize()`

Returns the size of the current key in bits.

#### Returns

`number` - Key size in bits

#### Example

```javascript
crypt.setPrivateKey(privateKey);
const keySize = crypt.getKeySize();
console.log('Key size:', keySize, 'bits');
```

### `getMaxMessageSize()`

Returns the maximum message size that can be encrypted with the current key.

#### Returns

`number` - Maximum message size in bytes

#### Example

```javascript
crypt.setPublicKey(publicKey);
const maxSize = crypt.getMaxMessageSize();
console.log('Max message size:', maxSize, 'bytes');
```

---

## Error Handling

All methods return `false` when they fail. Common failure scenarios:

- **No key set**: Attempting encryption/decryption without setting appropriate keys
- **Invalid key format**: Malformed PEM keys
- **Message too long**: Exceeding key size limitations
- **Wrong key**: Using incorrect key for decryption
- **Corruption**: Tampered encrypted data

### Best Practices

Always check return values:

```javascript
const encrypted = crypt.encrypt(message);
if (!encrypted) {
  throw new Error('Encryption failed');
}

const decrypted = crypt.decrypt(encrypted);
if (!decrypted) {
  throw new Error('Decryption failed');
}
```

---

## Type Definitions

For TypeScript users, JSEncrypt includes type definitions:

```typescript
interface JSEncryptOptions {
  default_key_size?: number;
}

declare class JSEncrypt {
  constructor(options?: JSEncryptOptions);
  
  setKey(key: string): void;
  setPrivateKey(key: string): void;
  setPublicKey(key: string): void;
  getPrivateKey(): string;
  getPublicKey(): string;
  getKey(callback?: () => void): any;
  
  encrypt(text: string): string | false;
  decrypt(text: string): string | false;
  
  sign(text: string, digestMethod?: string, digestEncoding?: string): string | false;
  verify(text: string, signature: string, digestMethod?: string): boolean;
  
  getKeySize(): number;
  getMaxMessageSize(): number;
}
```
