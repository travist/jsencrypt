/**
 * Simple test verification script for JSEncrypt examples
 * Uses the bundled library from the bin directory
 */

const fs = require('fs');
const path = require('path');

// Read the bundled JSEncrypt library
const jsencryptPath = path.join(__dirname, '../bin/jsencrypt.js');
const jsencryptCode = fs.readFileSync(jsencryptPath, 'utf8');

// Create a sandbox environment
const vm = require('vm');
const sandbox = {
    console: console,
    require: require,
    module: {},
    exports: {},
    Buffer: Buffer,
    process: process,
    window: {}, // Add window object for browser compatibility
    self: {}, // Add self reference
    btoa: (str) => Buffer.from(str, 'binary').toString('base64'),
    atob: (str) => Buffer.from(str, 'base64').toString('binary')
};

// Make window and self reference each other
sandbox.window.self = sandbox.self;
sandbox.self.window = sandbox.window;

// Execute the JSEncrypt library in the sandbox
vm.createContext(sandbox);
vm.runInContext(jsencryptCode, sandbox);

// Extract JSEncrypt from the sandbox
const JSEncrypt = sandbox.JSEncrypt || sandbox.module?.exports?.JSEncrypt;

if (!JSEncrypt) {
    console.error('Could not find JSEncrypt in the bundled library');
    process.exit(1);
}

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

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

function runBasicTest() {
    console.log('Running basic JSEncrypt functionality test...\n');
    
    try {
        // Test 1: Basic encryption/decryption
        console.log('Testing basic encryption/decryption...');
        const crypt = new JSEncrypt();
        crypt.setPrivateKey(testKeys.privateKey);
        crypt.setPublicKey(testKeys.publicKey);
        
        const message = "This is a secret message for testing";
        const encrypted = crypt.encrypt(message);
        assert(encrypted !== null, "Encryption should succeed");
        assert(typeof encrypted === 'string', "Encrypted data should be a string");
        console.log('✓ Encryption successful');
        
        const decrypted = crypt.decrypt(encrypted);
        assert(decrypted === message, "Decrypted message should match original");
        console.log('✓ Decryption successful');
        console.log('✓ Basic encryption/decryption test passed\n');
        
        // Test 2: Credentials encryption example
        console.log('Testing credentials encryption example...');
        
        function encryptCredentials(username, password, publicKey) {
            const crypt = new JSEncrypt();
            crypt.setPublicKey(publicKey);
            
            const credentials = JSON.stringify({
                username: username,
                password: password,
                timestamp: Date.now()
            });
            
            return crypt.encrypt(credentials);
        }
        
        const encryptedCreds = encryptCredentials('john.doe', 'myPassword123', testKeys.publicKey);
        assert(encryptedCreds !== null, "Credentials encryption should succeed");
        console.log('✓ Credentials encryption successful');
        
        // Verify we can decrypt credentials
        const decryptedCreds = crypt.decrypt(encryptedCreds);
        const credentials = JSON.parse(decryptedCreds);
        
        assert(credentials.username === 'john.doe', "Username should match");
        assert(credentials.password === 'myPassword123', "Password should match");
        console.log('✓ Credentials decryption and verification successful');
        console.log('✓ Credentials encryption example test passed\n');
        
        // Test 3: API Communication example
        console.log('Testing API communication example...');
        
        class SecureAPIClient {
            constructor(serverPublicKey, clientPrivateKey) {
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
        
        const client = new SecureAPIClient(testKeys.publicKey, testKeys.privateKey);
        const requestData = {
            userId: 12345,
            fields: ['name', 'email', 'preferences']
        };
        
        const encryptedRequest = client.encryptData(requestData);
        assert(encryptedRequest.encrypted !== null, "API data encryption should succeed");
        console.log('✓ API data encryption successful');
        
        const decryptedData = client.decryptData(encryptedRequest);
        assert(decryptedData.userId === 12345, "Decrypted user ID should match");
        assert(JSON.stringify(decryptedData.fields) === JSON.stringify(requestData.fields), "Fields should match");
        console.log('✓ API data decryption and verification successful');
        console.log('✓ API communication example test passed\n');
        
        // Test 4: Small data chunking test
        console.log('Testing data chunking example...');
        
        function chunkString(str, length) {
            const chunks = [];
            for (let i = 0; i < str.length; i += length) {
                chunks.push(str.slice(i, i + length));
            }
            return chunks;
        }
        
        const largeMessage = "This is a longer message that will be split into chunks for encryption. It demonstrates how to handle data that might be too large for a single RSA encryption operation.";
        const chunks = chunkString(largeMessage, 50);
        
        const encryptedChunks = chunks.map(chunk => crypt.encrypt(chunk));
        assert(encryptedChunks.every(chunk => chunk !== null), "All chunks should encrypt successfully");
        console.log(`✓ Successfully encrypted ${chunks.length} chunks`);
        
        const decryptedChunks = encryptedChunks.map(chunk => crypt.decrypt(chunk));
        const reconstructedMessage = decryptedChunks.join('');
        
        assert(reconstructedMessage === largeMessage, "Reconstructed message should match original");
        console.log('✓ Data chunking and reconstruction successful');
        console.log('✓ Data chunking example test passed\n');
        
        console.log('🎉 All examples tests passed successfully!');
        console.log('\nExample functionalities verified:');
        console.log('• Basic encryption/decryption');
        console.log('• User credentials encryption');
        console.log('• Secure API communication');
        console.log('• Data chunking for large content');
        console.log('\nThe examples in the documentation are working correctly! ✨');
        
        return true;
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        return false;
    }
}

// Run the tests
const success = runBasicTest();
process.exit(success ? 0 : 1);
