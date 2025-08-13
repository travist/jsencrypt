---
layout: default
title: Examples
parent: Docs
nav_order: 3
permalink: /docs/examples/
aliases:
  - /docs/examples.html
---

# Examples
{: .no_toc }

Real-world examples showing how to use JSEncrypt for common encryption scenarios.
{: .fs-6 .fw-300 }

## Table of contents
{: .no_toc .text-delta }

1. TOC
{:toc}
---

## Basic Encryption/Decryption

### Simple Text Encryption

```javascript
import { JSEncrypt } from 'jsencrypt';

// Initialize JSEncrypt
const crypt = new JSEncrypt();

// Set your RSA key pair
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA...
-----END RSA PRIVATE KEY-----`;

const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...
-----END PUBLIC KEY-----`;

crypt.setPrivateKey(privateKey);
crypt.setPublicKey(publicKey);

// Encrypt sensitive data
const message = "This is a secret message";
const encrypted = crypt.encrypt(message);
console.log('Encrypted:', encrypted);

// Decrypt the message
const decrypted = crypt.decrypt(encrypted);
console.log('Decrypted:', decrypted); // "This is a secret message"
```

### Encrypting User Credentials

```javascript
import { JSEncrypt } from 'jsencrypt';

function encryptCredentials(username, password, publicKey) {
    const crypt = new JSEncrypt();
    crypt.setPublicKey(publicKey);
    
    // Create credentials object
    const credentials = JSON.stringify({
        username: username,
        password: password,
        timestamp: Date.now()
    });
    
    // Encrypt the credentials
    const encrypted = crypt.encrypt(credentials);
    return encrypted;
}

// Usage
const publicKey = `-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----`;
const encryptedCreds = encryptCredentials('john.doe', 'myPassword123', publicKey);

// Send encrypted credentials to server
fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encryptedCredentials: encryptedCreds })
});
```

---

## SHA-256 Digital Signatures

### Using the Convenience Methods

JSEncrypt provides convenient `signSha256()` and `verifySha256()` methods that automatically handle SHA-256 hashing for you.

```javascript
import { JSEncrypt } from 'jsencrypt';

// Initialize with your key pair
const crypt = new JSEncrypt();
crypt.setPrivateKey(privateKey);
crypt.setPublicKey(publicKey);

// Simple message signing with SHA-256
const message = "Important data to sign";
const signature = crypt.signSha256(message);
console.log('Signature:', signature);
const isValid = crypt.verifySha256(message, signature);
console.log('Signature valid:', isValid); // true
```

### API Token Validation

```javascript
class APITokenManager {
    constructor(privateKey, publicKey) {
        this.crypt = new JSEncrypt();
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    
    // Generate a signed API token
    generateToken(userId, permissions, expiresIn = 3600) {
        const tokenData = {
            userId: userId,
            permissions: permissions,
            issuedAt: Math.floor(Date.now() / 1000),
            expiresAt: Math.floor(Date.now() / 1000) + expiresIn
        };
        
        const payload = JSON.stringify(tokenData);
        this.crypt.setPrivateKey(this.privateKey);
        const signature = this.crypt.signSha256(payload);
        
        // Return token as base64 encoded payload + signature
        const token = Buffer.from(JSON.stringify({
            payload: payload,
            signature: signature
        })).toString('base64');
        
        return token;
    }
    
    // Validate an API token
    validateToken(token) {
        try {
            // Decode the token
            const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
            const { payload, signature } = decoded;
            
            // Verify signature using convenience method
            this.crypt.setPublicKey(this.publicKey);
            const isValidSignature = this.crypt.verifySha256(payload, signature);
            
            if (!isValidSignature) {
                return { valid: false, reason: 'Invalid signature' };
            }
            
            // Check expiration
            const tokenData = JSON.parse(payload);
            const now = Math.floor(Date.now() / 1000);
            
            if (tokenData.expiresAt < now) {
                return { valid: false, reason: 'Token expired' };
            }
            
            return {
                valid: true,
                data: tokenData
            };
        } catch (error) {
            return { valid: false, reason: 'Invalid token format' };
        }
    }
}

// Usage
const tokenManager = new APITokenManager(privateKey, publicKey);

// Generate a token for user
const token = tokenManager.generateToken(12345, ['read', 'write'], 7200); // 2 hours
console.log('Generated token:', token);

// Later, validate the token
const validation = tokenManager.validateToken(token);
if (validation.valid) {
    console.log('Token valid for user:', validation.data.userId);
    console.log('Permissions:', validation.data.permissions);
} else {
    console.log('Token invalid:', validation.reason);
}
```

### Message Integrity Verification

```javascript
class MessageIntegrityChecker {
    constructor(privateKey, publicKey) {
        this.signer = new JSEncrypt();
        this.verifier = new JSEncrypt();
        this.signer.setPrivateKey(privateKey);
        this.verifier.setPublicKey(publicKey);
    }
    
    // Create a signed message with metadata
    createSignedMessage(content, metadata = {}) {
        const messageData = {
            content: content,
            timestamp: Date.now(),
            metadata: metadata
        };
        
        const messageString = JSON.stringify(messageData);
        const signature = this.signer.signSha256(messageString);
        
        return {
            message: messageData,
            signature: signature
        };
    }
    
    // Verify a signed message
    verifyMessage(signedMessage) {
        const { message, signature } = signedMessage;
        const messageString = JSON.stringify(message);
        
        // Verify using SHA-256 convenience method
        const isValid = this.verifier.verifySha256(messageString, signature);
        
        if (!isValid) {
            return { valid: false, reason: 'Signature verification failed' };
        }
        
        return {
            valid: true,
            content: message.content,
            timestamp: new Date(message.timestamp),
            metadata: message.metadata
        };
    }
}

// Usage Example
const checker = new MessageIntegrityChecker(privateKey, publicKey);

// Create a signed message
const signedMessage = checker.createSignedMessage(
    "This is a secure message",
    { sender: "Alice", priority: "high" }
);

console.log('Signed message:', signedMessage);

// Verify the message
const verification = checker.verifyMessage(signedMessage);
if (verification.valid) {
    console.log('Message verified:', verification.content);
    console.log('Sent by:', verification.metadata.sender);
} else {
    console.log('Verification failed:', verification.reason);
}
```

### Simple JWT Implementation

Here's a straightforward JWT implementation using the `signSha256` and `verifySha256` methods:

```javascript
class SimpleJWT {
    constructor(privateKey, publicKey) {
        this.signer = new JSEncrypt();
        this.verifier = new JSEncrypt();
        this.signer.setPrivateKey(privateKey);
        this.verifier.setPublicKey(publicKey);
    }
    
    // Create a simple JWT
    createToken(payload, expiresInSeconds = 3600) {
        const header = {
            alg: 'RS256',
            typ: 'JWT'
        };
        
        const claims = {
            ...payload,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + expiresInSeconds
        };
        
        // Encode header and payload
        const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
        const encodedPayload = this.base64UrlEncode(JSON.stringify(claims));
        
        // Create signing input
        const signingInput = `${encodedHeader}.${encodedPayload}`;
        const signature = this.signer.signSha256(signingInput);
        const encodedSignature = this.base64UrlEncode(signature);
        
        return `${signingInput}.${encodedSignature}`;
    }
    
    // Verify and decode a JWT
    verifyToken(token) {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format');
        }
        
        const [encodedHeader, encodedPayload, encodedSignature] = parts;
        const signingInput = `${encodedHeader}.${encodedPayload}`;
        
        // Decode signature and verify using convenience method
        const signature = this.base64UrlDecode(encodedSignature);
        const isValid = this.verifier.verifySha256(signingInput, signature);
        
        if (!isValid) {
            throw new Error('Invalid signature');
        }
        
        // Decode and check expiration
        const payload = JSON.parse(this.base64UrlDecode(encodedPayload));
        const now = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < now) {
            throw new Error('Token expired');
        }
        
        return payload;
    }
    
    // Base64 URL encoding/decoding utilities
    base64UrlEncode(str) {
        return Buffer.from(str, 'utf8')
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    }
    
    base64UrlDecode(str) {
        // Add padding
        str += '='.repeat((4 - str.length % 4) % 4);
        // Convert back from URL-safe base64
        const standardBase64 = str.replace(/-/g, '+').replace(/_/g, '/');
        return Buffer.from(standardBase64, 'base64').toString('utf8');
    }
}

// Usage Example
const jwt = new SimpleJWT(privateKey, publicKey);

// Create a token
const token = jwt.createToken({
    userId: 12345,
    username: 'john.doe',
    role: 'admin'
}, 7200); // 2 hours

console.log('JWT Token:', token);

// Verify the token
try {
    const decoded = jwt.verifyToken(token);
    console.log('Token valid! User:', decoded.username);
    console.log('Role:', decoded.role);
    console.log('Expires:', new Date(decoded.exp * 1000));
} catch (error) {
    console.error('Token verification failed:', error.message);
}
```

---

## JWT Token Validation with Public Key

### Validating JWT Tokens with RSA Signatures / Public Key

```javascript
import { JSEncrypt } from 'jsencrypt';
class JWTValidator {
    private crypt: JSEncrypt;
    constructor(publicKey) {
        this.crypt = new JSEncrypt();
        this.crypt.setPublicKey(publicKey);
    }

    verifyJWT(token) {
        const [header, payload, signature] = token.split('.');
        if (!header || !payload || !signature) {
            throw new Error('Invalid JWT format');
        }
        
        const signingInput = `${header}.${payload}`;
        const isValid = this.verifyRSASignature(signingInput, signature);
        if (!isValid) {
            throw new Error('Invalid signature');
        }
        const decodedPayload = JSON.parse(this.base64UrlDecode(payload));
        const now = Math.floor(Date.now() / 1000);
        if (decodedPayload.exp && decodedPayload.exp < now) {
            throw new Error('Token expired');
        }
        return decodedPayload;
    }
    
    verifyRSASignature(data, signature) {
        const decodedSignature = this.base64UrlDecode(signature);
        return this.crypt.verifySha256(data, decodedSignature);
    }
    
    base64UrlDecode(str) {
        str += '='.repeat((4 - str.length % 4) % 4);
        return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
    }
}

// Usage Example
const publicKey = `-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----`;

const jwtValidator = new JWTValidator(publicKey);
const token = localStorage.getItem('x-jwt-token');
console.log('JWT Token:', token);

// Verify the token
try {
    const payload = jwtValidator.verifyJWT(token);
    console.log('Token is valid:', payload);
} catch (error) {
    console.error('Token verification failed:', error.message);
}
```

---

## Secure API Communication

### Client-Server Encrypted Communication

```javascript
// Client-side encryption
class SecureAPIClient {
    constructor(serverPublicKey, clientPrivateKey) {
        this.serverPublicKey = serverPublicKey;
        this.clientPrivateKey = clientPrivateKey;
        this.encryptor = new JSEncrypt();
        this.decryptor = new JSEncrypt();
        
        this.encryptor.setPublicKey(serverPublicKey);
        this.decryptor.setPrivateKey(clientPrivateKey);
    }
    
    async secureRequest(endpoint, data) {
        // Encrypt the request data
        const encryptedData = this.encryptor.encrypt(JSON.stringify(data));
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Encrypted': 'true'
            },
            body: JSON.stringify({ encrypted: encryptedData })
        });
        
        const result = await response.json();
        
        // Decrypt the response
        if (result.encrypted) {
            const decryptedResponse = this.decryptor.decrypt(result.encrypted);
            return JSON.parse(decryptedResponse);
        }
        
        return result;
    }
}

// Usage
const client = new SecureAPIClient(serverPublicKey, clientPrivateKey);

const userData = await client.secureRequest('/api/user/profile', {
    userId: 12345,
    fields: ['name', 'email', 'preferences']
});
```

### Server-side Decryption (Node.js)

```javascript
// Server-side (Node.js with Express)
const express = require('express');
const JSEncrypt = require('jsencrypt');

const app = express();
app.use(express.json());

const serverPrivateKey = `-----BEGIN RSA PRIVATE KEY-----...-----END RSA PRIVATE KEY-----`;
const serverPublicKey = `-----BEGIN PUBLIC KEY-----...-----END PUBLIC KEY-----`;

const decryptor = new JSEncrypt();
const encryptor = new JSEncrypt();
decryptor.setPrivateKey(serverPrivateKey);
encryptor.setPublicKey(serverPublicKey);

app.post('/api/user/profile', (req, res) => {
    try {
        // Decrypt incoming data
        const encryptedData = req.body.encrypted;
        const decryptedData = decryptor.decrypt(encryptedData);
        const requestData = JSON.parse(decryptedData);
        
        // Process the request
        const userProfile = getUserProfile(requestData.userId, requestData.fields);
        
        // Encrypt the response
        const encryptedResponse = encryptor.encrypt(JSON.stringify(userProfile));
        
        res.json({ encrypted: encryptedResponse });
    } catch (error) {
        res.status(400).json({ error: 'Decryption failed' });
    }
});
```

---

## Digital Document Signing

### Document Integrity and Authentication

```javascript
import { JSEncrypt } from 'jsencrypt';
import crypto from 'crypto';

class DocumentSigner {
    constructor(privateKey, publicKey) {
        this.crypt = new JSEncrypt();
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    
    // Sign a document
    signDocument(documentContent, metadata = {}) {
        this.crypt.setPrivateKey(this.privateKey);
        
        // Create document hash
        const documentHash = crypto
            .createHash('sha256')
            .update(documentContent)
            .digest('hex');
        
        // Create signature payload
        const signaturePayload = {
            documentHash,
            timestamp: Date.now(),
            signer: metadata.signer || 'unknown',
            ...metadata
        };
        
        // Sign the payload
        const payloadString = JSON.stringify(signaturePayload);
        const signature = this.crypt.signSha256(payloadString);
        
        return {
            document: documentContent,
            signature: signature,
            signaturePayload: signaturePayload
        };
    }
    
    // Verify a signed document
    verifyDocument(signedDocument) {
        this.crypt.setPublicKey(this.publicKey);
        
        const { document, signature, signaturePayload } = signedDocument;
        
        // Verify document hasn't been tampered with
        const currentHash = crypto
            .createHash('sha256')
            .update(document)
            .digest('hex');
        
        if (currentHash !== signaturePayload.documentHash) {
            return { valid: false, reason: 'Document has been modified' };
        }
        
        // Verify signature
        const payloadString = JSON.stringify(signaturePayload);
        // Use the new verifySha256 convenience method
        const isValidSignature = this.crypt.verifySha256(payloadString, signature);
        
        if (!isValidSignature) {
            return { valid: false, reason: 'Invalid signature' };
        }
        
        return {
            valid: true,
            signedAt: new Date(signaturePayload.timestamp),
            signer: signaturePayload.signer,
            documentHash: signaturePayload.documentHash
        };
    }
}

// Usage Example
const signer = new DocumentSigner(privateKey, publicKey);

// Sign a contract
const contract = `
This is a digital contract between parties...
Terms and conditions apply...
Signed on ${new Date().toISOString()}
`;

const signedContract = signer.signDocument(contract, {
    signer: 'John Doe',
    contractType: 'Service Agreement',
    version: '1.0'
});

console.log('Signed Contract:', signedContract);

// Later, verify the contract
const verification = signer.verifyDocument(signedContract);
console.log('Verification Result:', verification);
```

---

## Secure File Upload

### Encrypting Files Before Upload

```javascript
class SecureFileUploader {
    constructor(publicKey) {
        this.crypt = new JSEncrypt();
        this.crypt.setPublicKey(publicKey);
    }
    
    async encryptAndUpload(file, endpoint) {
        try {
            // Read file as base64
            const fileContent = await this.fileToBase64(file);
            
            // Split large files into chunks for encryption
            const chunks = this.chunkString(fileContent, 200); // RSA limitation
            const encryptedChunks = chunks.map(chunk => this.crypt.encrypt(chunk));
            
            // Create metadata
            const metadata = {
                filename: file.name,
                fileType: file.type,
                fileSize: file.size,
                chunksCount: encryptedChunks.length,
                uploadTime: Date.now()
            };
            
            // Upload encrypted file
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    encryptedChunks,
                    metadata
                })
            });
            
            return await response.json();
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }
    
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = error => reject(error);
        });
    }
    
    chunkString(str, length) {
        const chunks = [];
        for (let i = 0; i < str.length; i += length) {
            chunks.push(str.slice(i, i + length));
        }
        return chunks;
    }
}

// Usage
const uploader = new SecureFileUploader(serverPublicKey);

document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        try {
            const result = await uploader.encryptAndUpload(file, '/api/secure-upload');
            console.log('Upload successful:', result);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
});
```

---

## License Key Generation and Validation

### Software License Management

```javascript
class LicenseManager {
    constructor(privateKey, publicKey) {
        this.crypt = new JSEncrypt();
        this.privateKey = privateKey;
        this.publicKey = publicKey;
    }
    
    // Generate a license key
    generateLicense(licenseData) {
        this.crypt.setPrivateKey(this.privateKey);
        
        const license = {
            ...licenseData,
            generatedAt: Date.now(),
            licenseId: this.generateLicenseId()
        };
        
        const licenseString = JSON.stringify(license);
        const encryptedLicense = this.crypt.encrypt(licenseString);
        
        // Create a readable license key format
        return this.formatLicenseKey(encryptedLicense);
    }
    
    // Validate a license key
    validateLicense(licenseKey) {
        try {
            this.crypt.setPublicKey(this.publicKey);
            
            // Parse license key format
            const encryptedLicense = this.parseLicenseKey(licenseKey);
            const decryptedLicense = this.crypt.decrypt(encryptedLicense);
            
            if (!decryptedLicense) {
                return { valid: false, reason: 'Invalid license key format' };
            }
            
            const license = JSON.parse(decryptedLicense);
            
            // Check expiration
            if (license.expiresAt && Date.now() > license.expiresAt) {
                return { valid: false, reason: 'License has expired' };
            }
            
            // Check usage limits
            if (license.maxUsers && license.currentUsers > license.maxUsers) {
                return { valid: false, reason: 'User limit exceeded' };
            }
            
            return {
                valid: true,
                license: license
            };
        } catch (error) {
            return { valid: false, reason: 'License validation failed' };
        }
    }
    
    generateLicenseId() {
        return 'LIC-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
    
    formatLicenseKey(encryptedData) {
        // Convert to a readable format (groups of 4 characters)
        const key = encryptedData.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
        return key.match(/.{1,4}/g).join('-');
    }
    
    parseLicenseKey(formattedKey) {
        return formattedKey.replace(/-/g, '');
    }
}

// Usage Example
const licenseManager = new LicenseManager(privateKey, publicKey);

// Generate a license
const licenseData = {
    customerName: 'Acme Corporation',
    productName: 'Super Software Pro',
    version: '2.0',
    maxUsers: 100,
    features: ['feature1', 'feature2', 'premium'],
    expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
};

const licenseKey = licenseManager.generateLicense(licenseData);
console.log('Generated License:', licenseKey);

// Validate the license
const validation = licenseManager.validateLicense(licenseKey);
console.log('License Validation:', validation);
```

---

## Browser Storage Encryption

### Encrypting Sensitive Data in localStorage

```javascript
class SecureStorage {
    constructor(publicKey, privateKey) {
        this.encryptor = new JSEncrypt();
        this.decryptor = new JSEncrypt();
        this.encryptor.setPublicKey(publicKey);
        this.decryptor.setPrivateKey(privateKey);
    }
    
    // Securely store data
    setItem(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            const encryptedValue = this.encryptor.encrypt(serializedValue);
            
            if (!encryptedValue) {
                throw new Error('Encryption failed');
            }
            
            localStorage.setItem(key, encryptedValue);
            return true;
        } catch (error) {
            console.error('Failed to store encrypted data:', error);
            return false;
        }
    }
    
    // Retrieve and decrypt data
    getItem(key) {
        try {
            const encryptedValue = localStorage.getItem(key);
            
            if (!encryptedValue) {
                return null;
            }
            
            const decryptedValue = this.decryptor.decrypt(encryptedValue);
            
            if (!decryptedValue) {
                throw new Error('Decryption failed');
            }
            
            return JSON.parse(decryptedValue);
        } catch (error) {
            console.error('Failed to retrieve encrypted data:', error);
            return null;
        }
    }
    
    // Remove item
    removeItem(key) {
        localStorage.removeItem(key);
    }
    
    // Clear all secure storage
    clear() {
        // Only clear items that were encrypted by this instance
        // (This is a simplified version - in practice, you'd want to track which keys are encrypted)
        localStorage.clear();
    }
}

// Usage
const secureStorage = new SecureStorage(publicKey, privateKey);

// Store sensitive user data
const userData = {
    userId: 12345,
    email: 'user@example.com',
    preferences: {
        theme: 'dark',
        notifications: true
    },
    sessionToken: 'abc123xyz'
};

secureStorage.setItem('userData', userData);

// Retrieve the data later
const retrievedData = secureStorage.getItem('userData');
console.log('Retrieved data:', retrievedData);
```

---

## Key Generation and Management

### Generating RSA Key Pairs

```javascript
// Note: JSEncrypt doesn't include key generation, but here's how you'd typically handle it

class KeyManager {
    // Generate a new RSA key pair (requires Node.js crypto module or WebCrypto API)
    static async generateKeyPair(keySize = 2048) {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
            // Browser environment using WebCrypto API
            return await this.generateKeyPairBrowser(keySize);
        } else {
            // Node.js environment
            return await this.generateKeyPairNode(keySize);
        }
    }
    
    // Browser key generation using WebCrypto API
    static async generateKeyPairBrowser(keySize) {
        const keyPair = await window.crypto.subtle.generateKey(
            {
                name: 'RSA-OAEP',
                modulusLength: keySize,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: 'SHA-256',
            },
            true,
            ['encrypt', 'decrypt']
        );
        
        const publicKey = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
        const privateKey = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
        
        return {
            publicKey: this.arrayBufferToPem(publicKey, 'PUBLIC KEY'),
            privateKey: this.arrayBufferToPem(privateKey, 'PRIVATE KEY')
        };
    }
    
    // Node.js key generation
    static async generateKeyPairNode(keySize) {
        const crypto = require('crypto');
        
        return new Promise((resolve, reject) => {
            crypto.generateKeyPair('rsa', {
                modulusLength: keySize,
                publicKeyEncoding: {
                    type: 'spki',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs8',
                    format: 'pem'
                }
            }, (err, publicKey, privateKey) => {
                if (err) reject(err);
                else resolve({ publicKey, privateKey });
            });
        });
    }
    
    static arrayBufferToPem(buffer, type) {
        const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        const pemString = base64.match(/.{1,64}/g).join('\n');
        return `-----BEGIN ${type}-----\n${pemString}\n-----END ${type}-----`;
    }
    
    // Validate key pair compatibility
    static validateKeyPair(publicKey, privateKey) {
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(privateKey);
        crypt.setPublicKey(publicKey);
        
        const testMessage = 'test-message-' + Date.now();
        const encrypted = crypt.encrypt(testMessage);
        const decrypted = crypt.decrypt(encrypted);
        
        return decrypted === testMessage;
    }
}

// Usage
async function setupEncryption() {
    try {
        // Generate new key pair
        const { publicKey, privateKey } = await KeyManager.generateKeyPair(2048);
        
        console.log('Generated Public Key:', publicKey);
        console.log('Generated Private Key:', privateKey);
        
        // Validate the key pair
        const isValid = KeyManager.validateKeyPair(publicKey, privateKey);
        console.log('Key pair is valid:', isValid);
        
        // Store keys securely (implementation depends on your environment)
        // In production, never store private keys in localStorage or send them to the client!
        
        return { publicKey, privateKey };
    } catch (error) {
        console.error('Key generation failed:', error);
    }
}

setupEncryption();
```

---

## Error Handling and Best Practices

### Robust Encryption with Error Handling

```javascript
class RobustEncryption {
    constructor(publicKey, privateKey, options = {}) {
        this.crypt = new JSEncrypt();
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.options = {
            maxChunkSize: 200, // RSA encryption chunk size limit
            retryAttempts: 3,
            ...options
        };
    }
    
    async encryptLargeData(data) {
        try {
            this.crypt.setPublicKey(this.publicKey);
            
            const serializedData = JSON.stringify(data);
            const chunks = this.splitIntoChunks(serializedData, this.options.maxChunkSize);
            
            const encryptedChunks = [];
            
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                let encrypted = null;
                let attempts = 0;
                
                while (!encrypted && attempts < this.options.retryAttempts) {
                    try {
                        encrypted = this.crypt.encrypt(chunk);
                        if (encrypted) {
                            encryptedChunks.push(encrypted);
                            break;
                        }
                    } catch (error) {
                        attempts++;
                        if (attempts >= this.options.retryAttempts) {
                            throw new Error(`Failed to encrypt chunk ${i} after ${attempts} attempts`);
                        }
                        // Wait before retry
                        await new Promise(resolve => setTimeout(resolve, 100 * attempts));
                    }
                }
            }
            
            return {
                success: true,
                encryptedChunks,
                totalChunks: chunks.length,
                originalSize: serializedData.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async decryptLargeData(encryptedChunks) {
        try {
            this.crypt.setPrivateKey(this.privateKey);
            
            const decryptedChunks = [];
            
            for (let i = 0; i < encryptedChunks.length; i++) {
                const encryptedChunk = encryptedChunks[i];
                let decrypted = null;
                let attempts = 0;
                
                while (!decrypted && attempts < this.options.retryAttempts) {
                    try {
                        decrypted = this.crypt.decrypt(encryptedChunk);
                        if (decrypted) {
                            decryptedChunks.push(decrypted);
                            break;
                        }
                    } catch (error) {
                        attempts++;
                        if (attempts >= this.options.retryAttempts) {
                            throw new Error(`Failed to decrypt chunk ${i} after ${attempts} attempts`);
                        }
                        await new Promise(resolve => setTimeout(resolve, 100 * attempts));
                    }
                }
            }
            
            const reconstructedData = decryptedChunks.join('');
            const parsedData = JSON.parse(reconstructedData);
            
            return {
                success: true,
                data: parsedData
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    splitIntoChunks(str, chunkSize) {
        const chunks = [];
        for (let i = 0; i < str.length; i += chunkSize) {
            chunks.push(str.slice(i, i + chunkSize));
        }
        return chunks;
    }
    
    // Validate keys before use
    validateKeys() {
        try {
            this.crypt.setPrivateKey(this.privateKey);
            this.crypt.setPublicKey(this.publicKey);
            
            const testData = 'validation-test';
            const encrypted = this.crypt.encrypt(testData);
            const decrypted = this.crypt.decrypt(encrypted);
            
            return {
                valid: decrypted === testData,
                error: decrypted !== testData ? 'Key validation failed' : null
            };
        } catch (error) {
            return {
                valid: false,
                error: error.message
            };
        }
    }
}

// Usage with error handling
async function secureDataHandling() {
    const encryption = new RobustEncryption(publicKey, privateKey);
    
    // Validate keys first
    const keyValidation = encryption.validateKeys();
    if (!keyValidation.valid) {
        console.error('Key validation failed:', keyValidation.error);
        return;
    }
    
    // Encrypt large data
    const largeData = {
        users: Array.from({ length: 1000 }, (_, i) => ({
            id: i,
            name: `User ${i}`,
            email: `user${i}@example.com`
        })),
        timestamp: Date.now()
    };
    
    const encryptionResult = await encryption.encryptLargeData(largeData);
    
    if (encryptionResult.success) {
        console.log('Encryption successful:', {
            chunks: encryptionResult.totalChunks,
            originalSize: encryptionResult.originalSize
        });
        
        // Decrypt the data
        const decryptionResult = await encryption.decryptLargeData(encryptionResult.encryptedChunks);
        
        if (decryptionResult.success) {
            console.log('Decryption successful, data integrity verified');
        } else {
            console.error('Decryption failed:', decryptionResult.error);
        }
    } else {
        console.error('Encryption failed:', encryptionResult.error);
    }
}
```

---

## Security Considerations

### Best Practices for Production Use

```javascript
// Security checklist and recommendations

class SecurityUtils {
    // Validate key format and strength
    static validateKeyStrength(publicKey, privateKey) {
        const warnings = [];
        
        // Check key format
        if (!publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
            warnings.push('Public key format may be invalid');
        }
        
        if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----') && 
            !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
            warnings.push('Private key format may be invalid');
        }
        
        // Check key length (basic estimation)
        const keyLengthEstimate = publicKey.length;
        if (keyLengthEstimate < 400) {
            warnings.push('Key appears to be less than 2048 bits (weak)');
        }
        
        return {
            isValid: warnings.length === 0,
            warnings: warnings
        };
    }
    
    // Secure random string generation
    static generateSecureRandom(length = 32) {
        if (typeof window !== 'undefined' && window.crypto) {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);
            return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
        } else {
            // Node.js
            const crypto = require('crypto');
            return crypto.randomBytes(length).toString('hex');
        }
    }
    
    // Memory cleanup (limited in JavaScript)
    static secureCleanup(sensitiveData) {
        if (typeof sensitiveData === 'string') {
            // Overwrite string memory (limited effectiveness in JS)
            sensitiveData = 'x'.repeat(sensitiveData.length);
        } else if (typeof sensitiveData === 'object') {
            // Clear object properties
            for (const key in sensitiveData) {
                if (sensitiveData.hasOwnProperty(key)) {
                    sensitiveData[key] = null;
                }
            }
        }
        
        // Force garbage collection if available
        if (typeof window !== 'undefined' && window.gc) {
            window.gc();
        }
    }
}

// Production-ready encryption wrapper
class ProductionEncryption {
    constructor(publicKey, privateKey) {
        // Validate keys on initialization
        const validation = SecurityUtils.validateKeyStrength(publicKey, privateKey);
        if (!validation.isValid) {
            console.warn('Key validation warnings:', validation.warnings);
        }
        
        this.crypt = new JSEncrypt();
        this.publicKey = publicKey;
        this.privateKey = privateKey;
    }
    
    // Encrypt with timestamp and integrity check
    encryptSecure(data, metadata = {}) {
        try {
            this.crypt.setPublicKey(this.publicKey);
            
            const payload = {
                data: data,
                timestamp: Date.now(),
                nonce: SecurityUtils.generateSecureRandom(16),
                ...metadata
            };
            
            const serialized = JSON.stringify(payload);
            const encrypted = this.crypt.encrypt(serialized);
            
            if (!encrypted) {
                throw new Error('Encryption failed');
            }
            
            return {
                success: true,
                encrypted: encrypted,
                timestamp: payload.timestamp
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Decrypt with integrity verification
    decryptSecure(encryptedData, maxAge = 3600000) { // 1 hour default
        try {
            this.crypt.setPrivateKey(this.privateKey);
            
            const decrypted = this.crypt.decrypt(encryptedData);
            if (!decrypted) {
                throw new Error('Decryption failed');
            }
            
            const payload = JSON.parse(decrypted);
            
            // Check timestamp
            const age = Date.now() - payload.timestamp;
            if (age > maxAge) {
                throw new Error('Data too old');
            }
            
            // Verify nonce exists (basic integrity check)
            if (!payload.nonce) {
                throw new Error('Invalid payload format');
            }
            
            return {
                success: true,
                data: payload.data,
                timestamp: payload.timestamp,
                age: age
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Clean up sensitive data
    cleanup() {
        SecurityUtils.secureCleanup(this.privateKey);
        SecurityUtils.secureCleanup(this.publicKey);
    }
}
```

These examples demonstrate practical, real-world applications of the JSEncrypt library. Remember to:

1. **Never expose private keys** in client-side code
2. **Use HTTPS** for all communications
3. **Validate input data** before encryption
4. **Handle errors gracefully**
5. **Keep keys secure** and rotate them regularly
6. **Consider key size** (minimum 2048 bits for RSA)
7. **Use proper random number generation** for nonces and salts
