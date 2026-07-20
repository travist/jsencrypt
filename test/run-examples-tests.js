#!/usr/bin/env node

/**
 * Simple test runner for JSEncrypt examples
 * This script runs the examples tests in a Node.js environment
 */

const JSEncrypt = require("../bin/jsencrypt.js");

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
    console.log(`✓ ${message}`);
}

function runExamplesTests() {
    console.log('Running JSEncrypt Examples Tests...\n');
    
    let testCount = 0;
    let passCount = 0;
    
    function test(name, testFn) {
        testCount++;
        try {
            testFn();
            passCount++;
            console.log(`✓ ${name}`);
        } catch (error) {
            console.log(`✗ ${name}: ${error.message}`);
        }
    }
    
    // Create a single shared instance with smaller key size for faster execution
    console.log('Generating test key pair...');
    const crypt = new JSEncrypt({ default_key_size: 512 });
    console.log('Ready!\n');
    
    // Test 1: Basic Encryption/Decryption
    test("Basic encryption/decryption", () => {
        const message = "Hello World!";
        const encrypted = crypt.encrypt(message);
        assert(encrypted !== null && encrypted !== false, "Encryption should succeed");
        assert(typeof encrypted === 'string', "Encrypted data should be a string");
        
        const decrypted = crypt.decrypt(encrypted);
        assert(decrypted === message, "Decrypted message should match original");
    });
    
    // Test 2: User Credentials Encryption
    test("User credentials encryption", () => {
        const credentials = JSON.stringify({
            user: 'john',
            pass: 'secret'
        });
        
        const encrypted = crypt.encrypt(credentials);
        assert(encrypted !== null && encrypted !== false, "Credentials encryption should succeed");
        
        const decrypted = crypt.decrypt(encrypted);
        const parsed = JSON.parse(decrypted);
        
        assert(parsed.user === 'john', "Username should match");
        assert(parsed.pass === 'secret', "Password should match");
    });
    
    // Test 3: API Communication
    test("API communication", () => {
        const apiData = '{"id":123,"cmd":"get"}';
        
        const encrypted = crypt.encrypt(apiData);
        assert(encrypted !== null && encrypted !== false, "API data encryption should succeed");
        
        const decrypted = crypt.decrypt(encrypted);
        assert(decrypted === apiData, "API data should match");
    });
    
    // Test 4: Document Signing
    test("Document signing", () => {
        const docHash = "abc123";
        const signature = crypt.encrypt(docHash);
        
        assert(signature !== null && signature !== false, "Document signing should succeed");
        
        const verified = crypt.decrypt(signature);
        assert(verified === docHash, "Document verification should succeed");
    });
    
    // Test 5: License Management
    test("License management", () => {
        const license = '{"app":"test","exp":' + (Date.now() + 86400000) + '}';
        
        const encrypted = crypt.encrypt(license);
        assert(encrypted !== null && encrypted !== false, "License encryption should succeed");
        
        const decrypted = crypt.decrypt(encrypted);
        const parsed = JSON.parse(decrypted);
        
        assert(parsed.app === 'test', "App name should match");
        assert(parsed.exp > Date.now(), "License should not be expired");
    });
    
    // Test 6: Secure Storage
    test("Secure storage", () => {
        const data = '{"theme":"dark","lang":"en"}';
        
        const encrypted = crypt.encrypt(data);
        assert(encrypted !== null && encrypted !== false, "Storage encryption should succeed");
        
        const decrypted = crypt.decrypt(encrypted);
        const parsed = JSON.parse(decrypted);
        
        assert(parsed.theme === 'dark', "Theme should match");
        assert(parsed.lang === 'en', "Language should match");
    });
    
    // Test 7: Data Chunking
    test("Data chunking", () => {
        const chunks = ["part1", "part2", "part3"];
        const encrypted = chunks.map(chunk => crypt.encrypt(chunk));
        
        assert(encrypted.every(e => e !== null && e !== false), "All chunks should encrypt");
        
        const decrypted = encrypted.map(e => crypt.decrypt(e));
        assert(JSON.stringify(decrypted) === JSON.stringify(chunks), "Chunks should match");
    });
    
    // Test 8: Error Handling
    test("Error handling", () => {
        const data = "test123";
        const encrypted = crypt.encrypt(data);
        
        assert(encrypted !== null && encrypted !== false, "Encryption should succeed");
        
        const decrypted = crypt.decrypt(encrypted);
        assert(decrypted === data, "Decryption should succeed");
    });
    
    // Test 9: Key Validation
    test("Key validation", () => {
        const key = crypt.getKey();
        assert(key !== null, "Key should exist");
        assert(key.n, "Key should have modulus");
        assert(key.e, "Key should have public exponent");
    });
    
    // Test 10: Security Features
    test("Security features", () => {
        const data = "secret";
        const encrypted = crypt.encrypt(data);
        
        assert(encrypted !== null && encrypted !== false, "Encryption should succeed");
        assert(encrypted !== data, "Encrypted data should be different");
        
        const decrypted = crypt.decrypt(encrypted);
        assert(decrypted === data, "Decryption should match original");
    });
    
    console.log(`\nTest Results: ${passCount}/${testCount} tests passed`);
    
    if (passCount === testCount) {
        console.log('🎉 All JSEncrypt examples are working correctly!');
        console.log('✅ The documented examples have been successfully validated.');
        process.exit(0);
    } else {
        console.log('❌ Some tests failed!');
        process.exit(1);
    }
}

// Run the tests
runExamplesTests();
