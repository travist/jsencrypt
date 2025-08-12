// Test both import patterns to verify the fix
console.log('Testing JSEncrypt exports...');

// Test 1: Destructured import (should work now)
try {
  const { JSEncrypt } = require('./bin/jsencrypt.js');
  console.log('✅ Destructured import works:', typeof JSEncrypt === 'function');
  
  // Try to create an instance
  const crypt = new JSEncrypt();
  console.log('✅ Can create instance with destructured import:', crypt instanceof JSEncrypt);
} catch (error) {
  console.log('❌ Destructured import failed:', error.message);
}

// Test 2: Default import (should still work)
try {
  const JSEncryptModule = require('./bin/jsencrypt.js');
  const JSEncrypt = JSEncryptModule.default || JSEncryptModule;
  console.log('✅ Default import works:', typeof JSEncrypt === 'function');
  
  // Try to create an instance
  const crypt = new JSEncrypt();
  console.log('✅ Can create instance with default import:', crypt.constructor.name === 'JSEncrypt');
} catch (error) {
  console.log('❌ Default import failed:', error.message);
}

// Test 3: Check what's actually exported
const exports = require('./bin/jsencrypt.js');
console.log('📦 Available exports:', Object.keys(exports));
console.log('📦 Type of exports:', typeof exports);
console.log('📦 Has JSEncrypt property:', 'JSEncrypt' in exports);
console.log('📦 Has default property:', 'default' in exports);
