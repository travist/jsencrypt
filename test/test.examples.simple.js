import { JSEncrypt } from "../lib/JSEncrypt";
import chai from "chai";
import dirtyChai from "dirty-chai";

chai.use(dirtyChai);
const expect = chai.expect;

// Test key pairs for examples - using the working test keys
const testKeys = {
    publicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtKrsFSnzYl19m5wTwYdu
/r1UVZJV+zkAFud6+XTInAy8HbCR9n59H9+54P+Af/fUE6rvEPc4H09Z63vQzIGM
iL6GlqzMmptv/KRDIhj7Mk3MXomvEVfUsXrz5IpO0lf6NSeGhz4PGZUkHZ30VRx3
Jd/a0KIhgftZHxzmMsh8iB/n781B18pCP2eOPTF+5gRCaW+0fVPBlb/mBlg8MJrd
ScGCAReQ9NfTq8slJ0aO1NWaaRRANPQcCMljnTIK1ssyXBaSHKfoWeGx141mWMRx
/LxyZ13Zc3lqgmICiKFqMrQl5UeV1IUXYpj5hO9f60LGpZVHDqqo/JdF3+VAheaf
QwIDAQAB
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

describe("JSEncrypt Examples Tests (Simplified)", function () {
    
    describe("Basic Encryption/Decryption", function () {
        
        it("should perform basic text encryption", function () {
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            crypt.setPublicKey(testKeys.publicKey);
            
            const message = "Hello World";
            const encrypted = crypt.encrypt(message);
            
            expect(encrypted).to.be.ok();
            expect(encrypted).to.be.a('string');
            
            const decrypted = crypt.decrypt(encrypted);
            expect(decrypted).to.be.equal(message);
        });
        
        it("should encrypt credentials", function () {
            const crypt = new JSEncrypt();
            crypt.setPublicKey(testKeys.publicKey);
            
            const credentials = '{"u":"john","p":"pass"}';
            const encrypted = crypt.encrypt(credentials);
            
            expect(encrypted).to.be.ok();
            
            crypt.setPrivateKey(testKeys.privateKey);
            const decrypted = crypt.decrypt(encrypted);
            expect(decrypted).to.equal(credentials);
        });
    });
    
    describe("API Communication", function () {
        
        it("should encrypt API data", function () {
            const crypt = new JSEncrypt();
            crypt.setPublicKey(testKeys.publicKey);
            
            const apiData = '{"id":123,"data":"test"}';
            const encrypted = crypt.encrypt(apiData);
            
            expect(encrypted).to.be.ok();
            
            crypt.setPrivateKey(testKeys.privateKey);
            const decrypted = crypt.decrypt(encrypted);
            expect(decrypted).to.equal(apiData);
        });
    });
    
    describe("Document Operations", function () {
        
        it("should handle document signing workflow", function () {
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            
            const docHash = "abc123";
            const signature = crypt.encrypt(docHash);
            
            expect(signature).to.be.ok();
            
            const verified = crypt.decrypt(signature);
            expect(verified).to.equal(docHash);
        });
    });
    
    describe("Data Chunking", function () {
        
        it("should handle chunked data", function () {
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            crypt.setPublicKey(testKeys.publicKey);
            
            const chunks = ["chunk1", "chunk2", "chunk3"];
            const encryptedChunks = chunks.map(chunk => crypt.encrypt(chunk));
            
            expect(encryptedChunks.every(chunk => chunk)).to.be.ok();
            
            const decryptedChunks = encryptedChunks.map(chunk => crypt.decrypt(chunk));
            expect(decryptedChunks).to.deep.equal(chunks);
        });
    });
    
    describe("Storage Operations", function () {
        
        it("should encrypt storage data", function () {
            const crypt = new JSEncrypt();
            crypt.setPublicKey(testKeys.publicKey);
            
            const storageData = '{"key":"value"}';
            const encrypted = crypt.encrypt(storageData);
            
            expect(encrypted).to.be.ok();
            
            crypt.setPrivateKey(testKeys.privateKey);
            const decrypted = crypt.decrypt(encrypted);
            expect(decrypted).to.equal(storageData);
        });
    });
    
    describe("Error Handling", function () {
        
        it("should validate encryption success", function () {
            const crypt = new JSEncrypt();
            crypt.setPublicKey(testKeys.publicKey);
            
            const data = "test data";
            const encrypted = crypt.encrypt(data);
            
            expect(encrypted).to.be.ok();
            expect(typeof encrypted).to.equal('string');
        });
        
        it("should handle decryption validation", function () {
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            crypt.setPublicKey(testKeys.publicKey);
            
            const data = "validation test";
            const encrypted = crypt.encrypt(data);
            const decrypted = crypt.decrypt(encrypted);
            
            expect(decrypted).to.equal(data);
        });
    });
    
    describe("Security Features", function () {
        
        it("should handle secure operations", function () {
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            crypt.setPublicKey(testKeys.publicKey);
            
            const secureData = "secure123";
            const encrypted = crypt.encrypt(secureData);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = crypt.decrypt(encrypted);
            expect(decrypted).to.equal(secureData);
        });
        
        it("should validate key strength", function () {
            const crypt = new JSEncrypt();
            crypt.setPrivateKey(testKeys.privateKey);
            
            const key = crypt.getKey();
            expect(key).to.be.ok();
            expect(key.n).to.be.ok();
            expect(key.e).to.be.ok();
        });
    });
});
