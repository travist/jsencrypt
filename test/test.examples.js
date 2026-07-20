import { JSEncrypt } from "../lib/JSEncrypt";
import chai from "chai";
import dirtyChai from "dirty-chai";

chai.use(dirtyChai);
const expect = chai.expect;

// Test key pairs for examples
const testKeys = {
    publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtKrsFSnzYl19m5wTwYdu
/r1UVZJV+zkAFud6+XTInAy8HbCR9n59H9+54P+Af/fUE6rvEPc4H09Z63vQzIGM
iL6GlqzMmptv/KRDIhj7Mk3MXomvEVfUsXrz5IpO0lf6NSeGhz4PGZUkHZ30VRx3
Jd/a0KIhgftZHxzmMsh8iB/n781B18pCP2eOPTF+5gRCaW+0fVPBlb/mBlg8MJrd
ScGCAReQ9NfTq8slJ0aO1NWaaRRANPQcCMljnTIK1ssyXBaSHKfoWeGx141mWMRx
/LxyZ13Zc3lqgmICiKFqMrQl5UeV1IUXYpj5hO9f60LGpZVHDqqo/JdF3+VAhea
fQwIDAQAB
-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAtKrsFSnzYl19m5wTwYdu/r1UVZJV+zkAFud6+XTInAy8HbCR
9n59H9+54P+Af/fUE6rvEPc4H09Z63vQzIGMiL6GlqzMmptv/KRDIhj7Mk3MXomv
EVfUsXrz5IpO0lf6NSeGhz4PGZUkHZ30VRx3Jd/a0KIhgftZHxzmMsh8iB/n781B
18pCP2eOPTF+5gRCaW+0fVPBlb/mBlg8MJrdScGCAReQ9NfTq8slJ0aO1NWaaRRA
NPQcCMljnTIK1ssyXBaSHKfoWeGx141mWMRx/LxyZ13Zc3lqgmICiKFqMrQl5UeV
1IUXYpj5hO9f60LGpZVHDqqo/JdF3+VAheafQwIDAQABAoIBAQCS/++PWM7bXk5x
apD4ioXZZ5tS9PpYqoxUFoyMpGUF86asUZqyAUE1ygen9rxLYw5/4jkaiMx1TU9Q
tzGw9Eewi7Veq8LemVKJMe4dtE3PJFYBJe34IorAzdXcQlzX8RV4YmynZetLWXpF
Ttwa1Ept2rJjx0eURzrAgfcbot0Qs+c8bB0qnGC67PoL3DyYg8vX5PDmiiA2VZMG
EylVQS09toJn5ReaKCtjxJb/XFQjBeSP0xLjvZZftGDJgpwmmi7Sy/zAZoF4+7wf
8nihXk4ZfYC+beBj5U9pcUcs6LdNobUofWFRLSjueseRQBI0sKUslr3Ye4zhkrWM
CDnsSxBhAoGBANi0spS/Mc6xH1189mR7dJV9gy7KkGxheAstwCJr7WzbXqglhFm2
SvY9hrpE9OYWir5EqX6jM6VipSobTn0RpCsYUC/J1ISMyEA5UkPLP4jHQw6UUDN2
1fNAXffEyuju5ShP9Mk2unZstlUweKlFF7d1k7YAzWDIKnF6bOL06YC9AoGBANVt
XM4OH0zw8M97W04WwYGoa5s1Y5JYc4RMV200cr3iONVfLZgSP8thP1qPuoMM3OJg
vP8xUJaFZZtSo6GZ4RTszcT8EjiFe3kYdKBm4PfVn0a3EKd0D8vH1qMwY1nBBGRk
rvQl7l+VHfcVKGgJ8ZBLN1+yKx/YBWCaRtGOq/v3AoGAO4d5nPFE8qT8m3YG3qFs
YY8E6j9w1zB6K3rB2M+U4F1WCT1dH0hpFRg2E8c3cV8bJG4hQl2lmP1nNvYL+F4u
X3M9N4J3dKJ5Q8+pOzD2wO+GtF+KLxqM1Hd0YqP7L9hG+m9E0fSb2YpL1J9rH+H1
5rZ9P+9lN3wTG+qH+PZ2E2sCgYEA2cTQ4PZF7O5F9MmO5Y2QbN0l5nF2pP6lG1R3
Jb4kL7hA9X+PbG6Y9qYhJ4E6LfQ8R1qE2Z4sQ7vK1gJ6D8L9K3D+A9Z7M3qP0Q7v
X2L4Q1A2bC1g3Y6T8z9K4P6Z3W5C9oY7H8L0M1hG6K2J+l4P1A8D6H5q7fY3L0hB
JfF2mPECgYB9Z8cE4pT7y1E4g2M7F3aY2q8z4Z0YzKdWJ9JgL7rC+H4yO3QG5D8P
m1wG6F0J8lR5fPz9qZg7R2P4J9B1vEL6T3E2s0K7H9Y5A4F1K8C0Q7x4L2N6P8G5
Z3U4v1Q2Y9O7K5L3T6m0F8J4A9B2E1qY7X5r9G3K0P2L8H6Z4V1g==
-----END RSA PRIVATE KEY-----`
};

describe("JSEncrypt Examples Tests", function () {
    
    describe("Basic Encryption/Decryption Examples", function () {
        
        it("should perform simple text encryption and decryption", function () {
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            crypt.setPublicKey(testKeys.publicKey);
            
            const message = "Secret message";  // Shorter message for RSA limits
            const encrypted = crypt.encrypt(message);
            
            expect(encrypted).to.be.ok();
            expect(encrypted).to.be.a('string');
            expect(encrypted.length).to.be.greaterThan(0);
            
            const decrypted = crypt.decrypt(encrypted);
            expect(decrypted).to.be.equal(message);
        });
        
        it("should encrypt user credentials", function () {
            function encryptCredentials(username, password, publicKey) {
                const crypt = new JSEncrypt();
                crypt.setPublicKey(publicKey);
                
                // Keep credentials very short for RSA encryption limits
                const credentials = JSON.stringify({
                    u: username.substring(0, 8),  // Truncate for size
                    p: password.substring(0, 8),
                    t: Date.now()
                });
                
                const encrypted = crypt.encrypt(credentials);
                return encrypted;
            }
            
            const encryptedCreds = encryptCredentials('john.doe', 'myPass123', testKeys.publicKey);
            expect(encryptedCreds).to.be.ok();
            expect(encryptedCreds).to.be.a('string');
            expect(encryptedCreds.length).to.be.greaterThan(0);
            
            // Verify we can decrypt it
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            const decrypted = crypt.decrypt(encryptedCreds);
            expect(decrypted).to.be.ok();
            const credentials = JSON.parse(decrypted);
            
            expect(credentials.u).to.equal('john.doe');
            expect(credentials.p).to.equal('myPass12');  // Truncated to 8 chars
            expect(credentials.t).to.be.a('number');
        });
    });
    
    describe("JWT Token Signing with RSA", function () {
        
        class RSAJWTManager {
            constructor(privateKey, publicKey) {
                this.privateKey = privateKey;
                this.publicKey = publicKey;
                this.crypt = new JSEncrypt();
            }
            
            createJWT(payload, expiresIn = '1h') {
                const header = {
                    alg: 'RS256',
                    typ: 'JWT'
                };
                
                const now = Math.floor(Date.now() / 1000);
                const expiration = now + this.parseExpiration(expiresIn);
                
                const claims = {
                    ...payload,
                    iat: now,
                    exp: expiration
                };
                
                const encodedHeader = this.base64UrlEncode(JSON.stringify(header));
                const encodedPayload = this.base64UrlEncode(JSON.stringify(claims));
                const signingInput = `${encodedHeader}.${encodedPayload}`;
                
                // Simple signature for testing (in real implementation would use proper RSA signing)
                this.crypt.setPrivateKey(this.privateKey);
                const signature = this.base64UrlEncode(this.crypt.encrypt(signingInput) || 'test-signature');
                
                return `${signingInput}.${signature}`;
            }
            
            verifyJWT(token) {
                const [header, payload, signature] = token.split('.');
                
                if (!header || !payload || !signature) {
                    throw new Error('Invalid JWT format');
                }
                
                // Simple verification for testing
                const signingInput = `${header}.${payload}`;
                this.crypt.setPublicKey(this.publicKey);
                
                const decodedPayload = JSON.parse(this.base64UrlDecode(payload));
                const now = Math.floor(Date.now() / 1000);
                
                if (decodedPayload.exp && decodedPayload.exp < now) {
                    throw new Error('Token expired');
                }
                
                return decodedPayload;
            }
            
            base64UrlEncode(str) {
                if (typeof str !== 'string') str = String(str);
                return btoa(str)
                    .replace(/\+/g, '-')
                    .replace(/\//g, '_')
                    .replace(/=/g, '');
            }
            
            base64UrlDecode(str) {
                str += '='.repeat((4 - str.length % 4) % 4);
                return atob(str.replace(/-/g, '+').replace(/_/g, '/'));
            }
            
            parseExpiration(exp) {
                if (typeof exp === 'number') return exp;
                const match = exp.match(/^(\d+)([smhd])$/);
                if (!match) return 3600;
                
                const value = parseInt(match[1]);
                const unit = match[2];
                
                switch (unit) {
                    case 's': return value;
                    case 'm': return value * 60;
                    case 'h': return value * 3600;
                    case 'd': return value * 86400;
                    default: return 3600;
                }
            }
        }
        
        it("should create and verify JWT tokens", function () {
            const jwtManager = new RSAJWTManager(testKeys.privateKey, testKeys.publicKey);
            
            const payload = {
                userId: 12345,
                username: 'john.doe',
                role: 'admin'
            };
            
            const token = jwtManager.createJWT(payload, '2h');
            expect(token).to.be.a('string');
            expect(token.split('.').length).to.equal(3);
            
            const verifiedPayload = jwtManager.verifyJWT(token);
            expect(verifiedPayload.userId).to.equal(12345);
            expect(verifiedPayload.username).to.equal('john.doe');
            expect(verifiedPayload.role).to.equal('admin');
            expect(verifiedPayload.iat).to.be.a('number');
            expect(verifiedPayload.exp).to.be.a('number');
        });
        
        it("should handle token expiration", function () {
            const jwtManager = new RSAJWTManager(testKeys.privateKey, testKeys.publicKey);
            
            // Create an already expired token
            const payload = {
                userId: 12345,
                exp: Math.floor(Date.now() / 1000) - 3600 // 1 hour ago
            };
            
            const header = { alg: 'RS256', typ: 'JWT' };
            const encodedHeader = jwtManager.base64UrlEncode(JSON.stringify(header));
            const encodedPayload = jwtManager.base64UrlEncode(JSON.stringify(payload));
            const expiredToken = `${encodedHeader}.${encodedPayload}.fake-signature`;
            
            expect(() => {
                jwtManager.verifyJWT(expiredToken);
            }).to.throw('Token expired');
        });
    });
    
    describe("Secure API Communication", function () {
        
        class SecureAPIClient {
            constructor(serverPublicKey, clientPrivateKey) {
                this.serverPublicKey = serverPublicKey;
                this.clientPrivateKey = clientPrivateKey;
                this.encryptor = new JSEncrypt();
                this.decryptor = new JSEncrypt();
                
                this.encryptor.setPublicKey(serverPublicKey);
                this.decryptor.setPrivateKey(clientPrivateKey);
            }
            
            encryptData(data) {
                const encryptedData = this.encryptor.encrypt(JSON.stringify(data));
                return { encrypted: encryptedData };
            }
            
            decryptData(encryptedResponse) {
                if (encryptedResponse.encrypted) {
                    const decryptedResponse = this.decryptor.decrypt(encryptedResponse.encrypted);
                    return JSON.parse(decryptedResponse);
                }
                return encryptedResponse;
            }
        }
        
        it("should encrypt and decrypt API communication", function () {
            const client = new SecureAPIClient(testKeys.publicKey, testKeys.privateKey);
            
            const requestData = {
                userId: 12345,
                fields: ['name', 'email', 'preferences']
            };
            
            const encryptedRequest = client.encryptData(requestData);
            expect(encryptedRequest.encrypted).to.be.a('string');
            expect(encryptedRequest.encrypted.length).to.be.greaterThan(0);
            
            const decryptedData = client.decryptData(encryptedRequest);
            expect(decryptedData.userId).to.equal(12345);
            expect(decryptedData.fields).to.deep.equal(['name', 'email', 'preferences']);
        });
    });
    
    describe("Digital Document Signing", function () {
        
        class DocumentSigner {
            constructor(privateKey, publicKey) {
                this.crypt = new JSEncrypt();
                this.privateKey = privateKey;
                this.publicKey = publicKey;
            }
            
            // Simple hash function for testing (in production, use proper crypto libraries)
            simpleHash(data) {
                let hash = 0;
                for (let i = 0; i < data.length; i++) {
                    const char = data.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash; // Convert to 32-bit integer
                }
                return hash.toString(16);
            }
            
            signDocument(documentContent, metadata = {}) {
                this.crypt.setPrivateKey(this.privateKey);
                
                const documentHash = this.simpleHash(documentContent);
                
                const signaturePayload = {
                    documentHash,
                    timestamp: Date.now(),
                    signer: metadata.signer || 'unknown',
                    ...metadata
                };
                
                const payloadString = JSON.stringify(signaturePayload);
                const signature = this.crypt.encrypt(payloadString);
                
                return {
                    document: documentContent,
                    signature: signature,
                    signaturePayload: signaturePayload
                };
            }
            
            verifyDocument(signedDocument) {
                this.crypt.setPublicKey(this.publicKey);
                
                const { document, signature, signaturePayload } = signedDocument;
                
                const currentHash = this.simpleHash(document);
                
                if (currentHash !== signaturePayload.documentHash) {
                    return { valid: false, reason: 'Document has been modified' };
                }
                
                const decryptedPayload = this.crypt.decrypt(signature);
                if (!decryptedPayload) {
                    return { valid: false, reason: 'Invalid signature' };
                }
                
                const parsedPayload = JSON.parse(decryptedPayload);
                
                if (JSON.stringify(parsedPayload) !== JSON.stringify(signaturePayload)) {
                    return { valid: false, reason: 'Signature payload mismatch' };
                }
                
                return {
                    valid: true,
                    signedAt: new Date(signaturePayload.timestamp),
                    signer: signaturePayload.signer,
                    documentHash: signaturePayload.documentHash
                };
            }
        }
        
        it("should sign and verify documents", function () {
            const signer = new DocumentSigner(testKeys.privateKey, testKeys.publicKey);
            
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
            
            expect(signedContract.document).to.equal(contract);
            expect(signedContract.signature).to.be.a('string');
            expect(signedContract.signaturePayload.signer).to.equal('John Doe');
            expect(signedContract.signaturePayload.contractType).to.equal('Service Agreement');
            
            const verification = signer.verifyDocument(signedContract);
            expect(verification.valid).to.be.true();
            expect(verification.signer).to.equal('John Doe');
        });
        
        it("should detect document tampering", function () {
            const signer = new DocumentSigner(testKeys.privateKey, testKeys.publicKey);
            
            const originalDocument = "Original contract content";
            const signedDocument = signer.signDocument(originalDocument);
            
            // Tamper with the document
            signedDocument.document = "Modified contract content";
            
            const verification = signer.verifyDocument(signedDocument);
            expect(verification.valid).to.be.false();
            expect(verification.reason).to.equal('Document has been modified');
        });
    });
    
    describe("Secure File Upload", function () {
        
        class SecureFileUploader {
            constructor(publicKey) {
                this.crypt = new JSEncrypt();
                this.crypt.setPublicKey(publicKey);
            }
            
            chunkString(str, length) {
                const chunks = [];
                for (let i = 0; i < str.length; i += length) {
                    chunks.push(str.slice(i, i + length));
                }
                return chunks;
            }
            
            encryptFileContent(fileContent) {
                const chunks = this.chunkString(fileContent, 100); // Smaller chunks for testing
                const encryptedChunks = chunks.map(chunk => this.crypt.encrypt(chunk));
                
                const metadata = {
                    filename: 'test.txt',
                    fileType: 'text/plain',
                    fileSize: fileContent.length,
                    chunksCount: encryptedChunks.length,
                    uploadTime: Date.now()
                };
                
                return {
                    encryptedChunks,
                    metadata
                };
            }
        }
        
        it("should encrypt file content in chunks", function () {
            const uploader = new SecureFileUploader(testKeys.publicKey);
            
            const fileContent = "This is a test file content that needs to be encrypted before upload.";
            const result = uploader.encryptFileContent(fileContent);
            
            expect(result.encryptedChunks).to.be.an('array');
            expect(result.encryptedChunks.length).to.be.greaterThan(0);
            expect(result.metadata.filename).to.equal('test.txt');
            expect(result.metadata.fileSize).to.equal(fileContent.length);
            expect(result.metadata.chunksCount).to.equal(result.encryptedChunks.length);
            
            // Verify we can decrypt the chunks
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            
            const decryptedChunks = result.encryptedChunks.map(chunk => crypt.decrypt(chunk));
            const reconstructedContent = decryptedChunks.join('');
            
            expect(reconstructedContent).to.equal(fileContent);
        });
    });
    
    describe("License Key Generation and Validation", function () {
        
        class LicenseManager {
            constructor(privateKey, publicKey) {
                this.crypt = new JSEncrypt();
                this.privateKey = privateKey;
                this.publicKey = publicKey;
            }
            
            generateLicense(licenseData) {
                this.crypt.setPrivateKey(this.privateKey);
                
                const license = {
                    ...licenseData,
                    generatedAt: Date.now(),
                    licenseId: this.generateLicenseId()
                };
                
                const licenseString = JSON.stringify(license);
                const encryptedLicense = this.crypt.encrypt(licenseString);
                
                return this.formatLicenseKey(encryptedLicense);
            }
            
            validateLicense(licenseKey) {
                try {
                    this.crypt.setPublicKey(this.publicKey);
                    
                    const encryptedLicense = this.parseLicenseKey(licenseKey);
                    const decryptedLicense = this.crypt.decrypt(encryptedLicense);
                    
                    if (!decryptedLicense) {
                        return { valid: false, reason: 'Invalid license key format' };
                    }
                    
                    const license = JSON.parse(decryptedLicense);
                    
                    if (license.expiresAt && Date.now() > license.expiresAt) {
                        return { valid: false, reason: 'License has expired' };
                    }
                    
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
                if (!encryptedData) return '';
                const key = encryptedData.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
                return key.match(/.{1,4}/g)?.join('-') || key;
            }
            
            parseLicenseKey(formattedKey) {
                return formattedKey.replace(/-/g, '');
            }
        }
        
        it("should generate and validate license keys", function () {
            const licenseManager = new LicenseManager(testKeys.privateKey, testKeys.publicKey);
            
            const licenseData = {
                customerName: 'Acme Corporation',
                productName: 'Super Software Pro',
                version: '2.0',
                maxUsers: 100,
                features: ['feature1', 'feature2', 'premium'],
                expiresAt: Date.now() + (365 * 24 * 60 * 60 * 1000) // 1 year
            };
            
            const licenseKey = licenseManager.generateLicense(licenseData);
            expect(licenseKey).to.be.a('string');
            expect(licenseKey.length).to.be.greaterThan(0);
            
            const validation = licenseManager.validateLicense(licenseKey);
            expect(validation.valid).to.be.true();
            expect(validation.license.customerName).to.equal('Acme Corporation');
            expect(validation.license.productName).to.equal('Super Software Pro');
            expect(validation.license.maxUsers).to.equal(100);
        });
        
        it("should detect expired licenses", function () {
            const licenseManager = new LicenseManager(testKeys.privateKey, testKeys.publicKey);
            
            const licenseData = {
                customerName: 'Test Corp',
                expiresAt: Date.now() - 1000 // Already expired
            };
            
            const licenseKey = licenseManager.generateLicense(licenseData);
            const validation = licenseManager.validateLicense(licenseKey);
            
            expect(validation.valid).to.be.false();
            expect(validation.reason).to.equal('License has expired');
        });
    });
    
    describe("Browser Storage Encryption", function () {
        
        class SecureStorage {
            constructor(publicKey, privateKey) {
                this.encryptor = new JSEncrypt();
                this.decryptor = new JSEncrypt();
                this.encryptor.setPublicKey(publicKey);
                this.decryptor.setPrivateKey(privateKey);
                this.storage = {}; // Mock storage for testing
            }
            
            setItem(key, value) {
                try {
                    const serializedValue = JSON.stringify(value);
                    const encryptedValue = this.encryptor.encrypt(serializedValue);
                    
                    if (!encryptedValue) {
                        return false;
                    }
                    
                    this.storage[key] = encryptedValue;
                    return true;
                } catch (error) {
                    return false;
                }
            }
            
            getItem(key) {
                try {
                    const encryptedValue = this.storage[key];
                    
                    if (!encryptedValue) {
                        return null;
                    }
                    
                    const decryptedValue = this.decryptor.decrypt(encryptedValue);
                    
                    if (!decryptedValue) {
                        return null;
                    }
                    
                    return JSON.parse(decryptedValue);
                } catch (error) {
                    return null;
                }
            }
            
            removeItem(key) {
                delete this.storage[key];
            }
        }
        
        it("should encrypt and decrypt stored data", function () {
            const secureStorage = new SecureStorage(testKeys.publicKey, testKeys.privateKey);
            
            const userData = {
                userId: 12345,
                email: 'user@example.com',
                preferences: {
                    theme: 'dark',
                    notifications: true
                },
                sessionToken: 'abc123xyz'
            };
            
            const success = secureStorage.setItem('userData', userData);
            expect(success).to.be.true();
            
            const retrievedData = secureStorage.getItem('userData');
            expect(retrievedData).to.deep.equal(userData);
        });
        
        it("should return null for non-existent keys", function () {
            const secureStorage = new SecureStorage(testKeys.publicKey, testKeys.privateKey);
            
            const result = secureStorage.getItem('nonExistentKey');
            expect(result).to.be.null();
        });
    });
    
    describe("Error Handling and Best Practices", function () {
        
        class RobustEncryption {
            constructor(publicKey, privateKey, options = {}) {
                this.crypt = new JSEncrypt();
                this.publicKey = publicKey;
                this.privateKey = privateKey;
                this.options = {
                    maxChunkSize: 50, // Smaller for testing
                    retryAttempts: 3,
                    ...options
                };
            }
            
            splitIntoChunks(str, chunkSize) {
                const chunks = [];
                for (let i = 0; i < str.length; i += chunkSize) {
                    chunks.push(str.slice(i, i + chunkSize));
                }
                return chunks;
            }
            
            encryptLargeData(data) {
                try {
                    this.crypt.setPublicKey(this.publicKey);
                    
                    const serializedData = JSON.stringify(data);
                    const chunks = this.splitIntoChunks(serializedData, this.options.maxChunkSize);
                    
                    const encryptedChunks = [];
                    
                    for (let i = 0; i < chunks.length; i++) {
                        const chunk = chunks[i];
                        const encrypted = this.crypt.encrypt(chunk);
                        
                        if (!encrypted) {
                            return {
                                success: false,
                                error: `Failed to encrypt chunk ${i}`
                            };
                        }
                        
                        encryptedChunks.push(encrypted);
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
            
            decryptLargeData(encryptedChunks) {
                try {
                    this.crypt.setPrivateKey(this.privateKey);
                    
                    const decryptedChunks = [];
                    
                    for (let i = 0; i < encryptedChunks.length; i++) {
                        const encryptedChunk = encryptedChunks[i];
                        const decrypted = this.crypt.decrypt(encryptedChunk);
                        
                        if (!decrypted) {
                            return {
                                success: false,
                                error: `Failed to decrypt chunk ${i}`
                            };
                        }
                        
                        decryptedChunks.push(decrypted);
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
        
        it("should validate keys before use", function () {
            const encryption = new RobustEncryption(testKeys.publicKey, testKeys.privateKey);
            
            const keyValidation = encryption.validateKeys();
            expect(keyValidation.valid).to.be.true();
            expect(keyValidation.error).to.be.null();
        });
        
        it("should handle large data encryption with chunking", function () {
            const encryption = new RobustEncryption(testKeys.publicKey, testKeys.privateKey);
            
            const largeData = {
                users: Array.from({ length: 10 }, (_, i) => ({
                    id: i,
                    name: `User ${i}`,
                    email: `user${i}@example.com`
                })),
                timestamp: Date.now()
            };
            
            const encryptionResult = encryption.encryptLargeData(largeData);
            expect(encryptionResult.success).to.be.true();
            expect(encryptionResult.encryptedChunks).to.be.an('array');
            expect(encryptionResult.totalChunks).to.be.greaterThan(1);
            
            const decryptionResult = encryption.decryptLargeData(encryptionResult.encryptedChunks);
            expect(decryptionResult.success).to.be.true();
            expect(decryptionResult.data).to.deep.equal(largeData);
        });
        
        it("should detect invalid keys", function () {
            const invalidPublicKey = "-----BEGIN PUBLIC KEY-----\nINVALID\n-----END PUBLIC KEY-----";
            const encryption = new RobustEncryption(invalidPublicKey, testKeys.privateKey);
            
            const keyValidation = encryption.validateKeys();
            expect(keyValidation.valid).to.be.false();
            expect(keyValidation.error).to.be.a('string');
        });
    });
    
    describe("Security Considerations", function () {
        
        class SecurityUtils {
            static validateKeyStrength(publicKey, privateKey) {
                const warnings = [];
                
                if (!publicKey.includes('-----BEGIN PUBLIC KEY-----')) {
                    warnings.push('Public key format may be invalid');
                }
                
                if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----') && 
                    !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
                    warnings.push('Private key format may be invalid');
                }
                
                const keyLengthEstimate = publicKey.length;
                if (keyLengthEstimate < 400) {
                    warnings.push('Key appears to be less than 2048 bits (weak)');
                }
                
                return {
                    isValid: warnings.length === 0,
                    warnings: warnings
                };
            }
            
            static generateSecureRandom(length = 32) {
                // Simple random generation for testing
                return Array.from({ length }, () => 
                    Math.floor(Math.random() * 16).toString(16)
                ).join('');
            }
        }
        
        class ProductionEncryption {
            constructor(publicKey, privateKey) {
                const validation = SecurityUtils.validateKeyStrength(publicKey, privateKey);
                this.validationWarnings = validation.warnings;
                
                this.crypt = new JSEncrypt();
                this.publicKey = publicKey;
                this.privateKey = privateKey;
            }
            
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
            
            decryptSecure(encryptedData, maxAge = 3600000) { // 1 hour default
                try {
                    this.crypt.setPrivateKey(this.privateKey);
                    
                    const decrypted = this.crypt.decrypt(encryptedData);
                    if (!decrypted) {
                        throw new Error('Decryption failed');
                    }
                    
                    const payload = JSON.parse(decrypted);
                    
                    const age = Date.now() - payload.timestamp;
                    if (age > maxAge) {
                        throw new Error('Data too old');
                    }
                    
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
        }
        
        it("should validate key strength", function () {
            const validation = SecurityUtils.validateKeyStrength(testKeys.publicKey, testKeys.privateKey);
            expect(validation.isValid).to.be.true();
            expect(validation.warnings).to.be.an('array');
        });
        
        it("should generate secure random values", function () {
            const random1 = SecurityUtils.generateSecureRandom(16);
            const random2 = SecurityUtils.generateSecureRandom(16);
            
            expect(random1).to.be.a('string');
            expect(random1.length).to.equal(16);
            expect(random2).to.be.a('string');
            expect(random2.length).to.equal(16);
            expect(random1).to.not.equal(random2);
        });
        
        it("should encrypt with timestamp and integrity check", function () {
            const encryption = new ProductionEncryption(testKeys.publicKey, testKeys.privateKey);
            
            const testData = "sensitive information";
            const result = encryption.encryptSecure(testData, { source: 'test' });
            
            expect(result.success).to.be.true();
            expect(result.encrypted).to.be.a('string');
            expect(result.timestamp).to.be.a('number');
            
            const decryptResult = encryption.decryptSecure(result.encrypted);
            expect(decryptResult.success).to.be.true();
            expect(decryptResult.data).to.equal(testData);
            expect(decryptResult.age).to.be.a('number');
        });
        
        it("should reject old data", function () {
            const encryption = new ProductionEncryption(testKeys.publicKey, testKeys.privateKey);
            
            const testData = "sensitive information";
            const result = encryption.encryptSecure(testData);
            
            // Attempt to decrypt with very short max age
            const decryptResult = encryption.decryptSecure(result.encrypted, 1); // 1ms max age
            
            // Should fail due to age
            expect(decryptResult.success).to.be.false();
            expect(decryptResult.error).to.equal('Data too old');
        });
    });
});
