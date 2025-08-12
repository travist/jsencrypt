#!/usr/bin/env node

/**
 * Test using the OLD direct import pattern to see what happens
 */

// OLD pattern - direct import (what the test was using before)
const JSEncrypt = require("./bin/jsencrypt.js");

console.log('Testing OLD direct import pattern...');
console.log('Type of JSEncrypt:', typeof JSEncrypt);
console.log('JSEncrypt keys:', Object.keys(JSEncrypt));
console.log('JSEncrypt constructor name:', JSEncrypt.constructor?.name);

// Try to use it directly (this is what would fail)
try {
  console.log('\nTrying: new JSEncrypt()');
  const crypt = new JSEncrypt();
  console.log('✅ SUCCESS: Created instance');
} catch (error) {
  console.log('❌ FAILED:', error.message);
  
  // Try the corrected approach
  console.log('\nTrying: new JSEncrypt.default()');
  try {
    const crypt = new JSEncrypt.default();
    console.log('✅ SUCCESS: Created instance with .default');
  } catch (error2) {
    console.log('❌ FAILED with .default:', error2.message);
    
    // Try the other property
    console.log('\nTrying: new JSEncrypt.JSEncrypt()');
    try {
      const crypt = new JSEncrypt.JSEncrypt();
      console.log('✅ SUCCESS: Created instance with .JSEncrypt');
    } catch (error3) {
      console.log('❌ FAILED with .JSEncrypt:', error3.message);
    }
  }
}
