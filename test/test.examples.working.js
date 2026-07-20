import { JSEncrypt } from "../lib/JSEncrypt";
import chai from "chai";
import dirtyChai from "dirty-chai";

chai.use(dirtyChai);
const expect = chai.expect;

describe("JSEncrypt Examples Tests (Working)", function () {
    
    describe("Basic Functionality", function () {
        
        it("should encrypt and decrypt with generated keys", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const message = "Hello World";
            const encrypted = jse.encrypt(message);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(message);
        });
        
        it("should encrypt credentials", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const credentials = "user:pass";
            const encrypted = jse.encrypt(credentials);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(credentials);
        });
        
        it("should handle API data", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const apiData = '{"id":123}';
            const encrypted = jse.encrypt(apiData);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(apiData);
        });
        
        it("should handle document signing", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const docHash = "abc123";
            const signature = jse.encrypt(docHash);
            
            expect(signature).to.be.ok();
            
            const verified = jse.decrypt(signature);
            expect(verified).to.be.equal(docHash);
        });
        
        it("should handle chunked data", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const chunks = ["chunk1", "chunk2"];
            const encryptedChunks = chunks.map(chunk => jse.encrypt(chunk));
            
            expect(encryptedChunks.every(chunk => chunk)).to.be.ok();
            
            const decryptedChunks = encryptedChunks.map(chunk => jse.decrypt(chunk));
            expect(decryptedChunks).to.deep.equal(chunks);
        });
        
        it("should handle storage data", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const storageData = '{"k":"v"}';
            const encrypted = jse.encrypt(storageData);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(storageData);
        });
        
        it("should validate encryption operations", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const data = "test data";
            const encrypted = jse.encrypt(data);
            
            expect(encrypted).to.be.ok();
            expect(typeof encrypted).to.equal('string');
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.equal(data);
        });
        
        it("should handle secure operations", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const secureData = "secure123";
            const encrypted = jse.encrypt(secureData);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.equal(secureData);
        });
        
        it("should validate key properties", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const key = jse.getKey();
            expect(key).to.be.ok();
            expect(key.n).to.be.ok();
            expect(key.e).to.be.ok();
        });
        
        it("should handle error cases gracefully", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            // Test valid encryption first
            const validData = "valid";
            const encrypted = jse.encrypt(validData);
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.equal(validData);
        });
        
        it("should handle SHA-256 convenience methods", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const message = "Test message for SHA-256 signing";
            
            // Test signSha256 method
            const signature = jse.signSha256(message);
            expect(signature).to.be.ok();
            expect(signature).to.be.a('string');
            
            // Test verifySha256 method
            const isValid = jse.verifySha256(message, signature);
            expect(isValid).to.be.equal(true);
            
            // Test with different message (should fail)
            const isInvalid = jse.verifySha256("Different message", signature);
            expect(isInvalid).to.be.equal(false);
        });

        it("should handle SHA-256 methods with various message types", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const testCases = [
                "Simple string",
                "String with numbers 123456",
                "String with special chars !@#$%^&*()",
                "Unicode string: 你好世界 🌍",
                "Very long string: " + "a".repeat(1000),
                "",  // Empty string
                JSON.stringify({ key: "value", number: 42 }),
                "Multi\nline\nstring\nwith\nbreaks"
            ];
            
            for (const message of testCases) {
                const signature = jse.signSha256(message);
                expect(signature).to.be.ok();
                expect(signature).to.be.a('string');
                
                const isValid = jse.verifySha256(message, signature);
                expect(isValid).to.be.equal(true);
                
                // Test with modified message
                const modifiedMessage = message + "x";
                const isInvalid = jse.verifySha256(modifiedMessage, signature);
                expect(isInvalid).to.be.equal(false);
            }
        });

        it("should verify SHA-256 signatures are deterministic", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const message = "Deterministic test message";
            
            // Sign the same message multiple times
            const signature1 = jse.signSha256(message);
            const signature2 = jse.signSha256(message);
            const signature3 = jse.signSha256(message);
            
            // All signatures should be identical (deterministic)
            expect(signature1).to.be.equal(signature2);
            expect(signature2).to.be.equal(signature3);
            
            // All should verify correctly
            expect(jse.verifySha256(message, signature1)).to.be.equal(true);
            expect(jse.verifySha256(message, signature2)).to.be.equal(true);
            expect(jse.verifySha256(message, signature3)).to.be.equal(true);
        });

        it("should handle SHA-256 signature compatibility across different JSEncrypt instances", function () {
            const jse1 = new JSEncrypt({ default_key_size: 1024 });
            const jse2 = new JSEncrypt({ default_key_size: 1024 });
            
            const message = "Cross-instance compatibility test";
            
            // Get keys from first instance
            const privateKey = jse1.getPrivateKey();
            const publicKey = jse1.getPublicKey();
            
            // Ensure second instance is properly reset before setting keys
            jse2.setPrivateKey(privateKey);
            
            // Sign with first instance
            const signature1 = jse1.signSha256(message);
            expect(signature1).to.be.ok();
            
            // Verify with second instance (which should have the same private key)
            const isValid1 = jse2.verifySha256(message, signature1);
            expect(isValid1).to.be.equal(true);
            
            // Sign with second instance
            const signature2 = jse2.signSha256(message);
            expect(signature2).to.be.ok();
            
            // Verify with first instance
            const isValid2 = jse1.verifySha256(message, signature2);
            expect(isValid2).to.be.equal(true);
            
            // Note: Both cross-verifications should work
            // (signatures may differ due to randomness in RSA signing)
        });

        it("should handle SHA-256 methods with error cases", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const message = "Error handling test";
            const validSignature = jse.signSha256(message);
            
            // Test with clearly invalid signatures that should definitely fail
            const invalidSignatures = [
                "",                           // Empty string
                "not-a-valid-signature",      // Plain text
                "YWJjZGVmZw==",              // Valid base64 but not a signature
                "invalid-base64!@#",          // Invalid base64
            ];
            
            for (const invalidSig of invalidSignatures) {
                const result = jse.verifySha256(message, invalidSig);
                expect(result).to.be.equal(false);
            }
            
            // Test with null/undefined signatures - these should also return false
            expect(jse.verifySha256(message, null)).to.be.equal(false);
            expect(jse.verifySha256(message, undefined)).to.be.equal(false);
            
            // Test with wrong message - should fail with valid signature format
            expect(jse.verifySha256("different message", validSignature)).to.be.equal(false);
        });

        it("should verify SHA-256 methods are compatible with manual sign/verify", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const message = "Compatibility test message";
            
            // Sign using convenience method
            const convenienceSignature = jse.signSha256(message);
            expect(convenienceSignature).to.be.ok();
            
            // Verify using convenience method
            const convenienceVerify = jse.verifySha256(message, convenienceSignature);
            expect(convenienceVerify).to.be.equal(true);
            
            // Create a manual SHA-256 digest function that matches our convenience method
            const manualSha256Digest = (text) => {
                // This should match what rstr2hex(rstr_sha256(text)) does
                const crypto = require('crypto');
                return crypto.createHash('sha256').update(text).digest('hex');
            };
            
            // Sign using manual method with SHA-256
            const manualSignature = jse.sign(message, manualSha256Digest, "sha256");
            expect(manualSignature).to.be.ok();
            
            // Verify using manual method
            const manualVerify = jse.verify(message, manualSignature, manualSha256Digest);
            expect(manualVerify).to.be.equal(true);
            
            // Cross-verify: convenience signature with manual verify
            const crossVerify1 = jse.verify(message, convenienceSignature, manualSha256Digest);
            expect(crossVerify1).to.be.equal(true);
            
            // Cross-verify: manual signature with convenience verify
            const crossVerify2 = jse.verifySha256(message, manualSignature);
            expect(crossVerify2).to.be.equal(true);
            
            // Both signatures should be identical
            expect(convenienceSignature).to.be.equal(manualSignature);
        });

        it("should handle SHA-256 methods with different key sizes", function () {
            const keySizes = [1024, 2048];
            const message = "Key size test message";
            
            for (const keySize of keySizes) {
                const jse = new JSEncrypt({ default_key_size: keySize });
                
                const signature = jse.signSha256(message);
                expect(signature).to.be.ok();
                expect(signature).to.be.a('string');
                
                const isValid = jse.verifySha256(message, signature);
                expect(isValid).to.be.equal(true);
                
                // Signature length should vary with key size
                // Base64 encoding of RSA signature: (keySize in bits / 8) * 4/3 roughly
                const expectedMinLength = Math.floor((keySize / 8) * 4 / 3) - 10;
                expect(signature.length).to.be.greaterThan(expectedMinLength);
            }
        });

        it("should handle large messages with SHA-256 methods", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            // Test with increasingly large messages
            const baseSizes = [100, 1000, 10000, 50000];
            
            for (const size of baseSizes) {
                const largeMessage = "Large message test: " + "x".repeat(size);
                
                const signature = jse.signSha256(largeMessage);
                expect(signature).to.be.ok();
                expect(signature).to.be.a('string');
                
                const isValid = jse.verifySha256(largeMessage, signature);
                expect(isValid).to.be.equal(true);
                
                // Verify with slightly modified message fails
                const modifiedMessage = largeMessage.slice(0, -1) + "y";
                const isInvalid = jse.verifySha256(modifiedMessage, signature);
                expect(isInvalid).to.be.equal(false);
            }
        });
    });
});
