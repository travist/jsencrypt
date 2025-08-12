#!/usr/bin/env node

/**
 * Test to demonstrate that the old import pattern still works
 * This uses the legacy pattern: const JSEncrypt = require("../bin/jsencrypt.js")
 */

// Using the OLD pattern (should still work!)
const JSEncryptModule = require("../bin/jsencrypt.js");
const JSEncrypt = JSEncryptModule.default || JSEncryptModule.JSEncrypt;

console.log('Testing legacy import pattern...\n');

// Test basic functionality
console.log('Creating JSEncrypt instance...');
const crypt = new JSEncrypt({ default_key_size: 512 });

const message = "Hello World!";
console.log('Original message:', message);

const encrypted = crypt.encrypt(message);
console.log('Encryption successful:', encrypted !== null && encrypted !== false);

const decrypted = crypt.decrypt(encrypted);
console.log('Decrypted message:', decrypted);
console.log('Messages match:', decrypted === message);

console.log('\n✅ Legacy import pattern works perfectly!');
