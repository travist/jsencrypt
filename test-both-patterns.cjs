// Test both import patterns to verify they both work
console.log('Testing both import patterns...\n');

// Pattern 1: Destructuring import (modern way)
console.log('1. Testing destructuring import: const { JSEncrypt } = require("./bin/jsencrypt.js")');
try {
  const { JSEncrypt } = require("./bin/jsencrypt.js");
  console.log('✅ Destructuring import works');
  console.log('   Type:', typeof JSEncrypt);
  
  const crypt1 = new JSEncrypt();
  console.log('   Can create instance:', crypt1.constructor.name === 'JSEncrypt');
} catch (error) {
  console.log('❌ Destructuring import failed:', error.message);
}

console.log();

// Pattern 2: Direct import (legacy way)
console.log('2. Testing direct import: const JSEncrypt = require("./bin/jsencrypt.js")');
try {
  const JSEncryptModule = require("./bin/jsencrypt.js");
  console.log('✅ Direct import works');
  console.log('   Module type:', typeof JSEncryptModule);
  console.log('   Has JSEncrypt property:', 'JSEncrypt' in JSEncryptModule);
  console.log('   Has default property:', 'default' in JSEncryptModule);
  
  // Try using it as the old way (should be the module object now)
  const JSEncrypt = JSEncryptModule.default || JSEncryptModule.JSEncrypt;
  console.log('   JSEncrypt type:', typeof JSEncrypt);
  
  const crypt2 = new JSEncrypt();
  console.log('   Can create instance:', crypt2.constructor.name === 'JSEncrypt');
} catch (error) {
  console.log('❌ Direct import failed:', error.message);
}

console.log();

// Pattern 3: What the module actually exports
const moduleExports = require("./bin/jsencrypt.js");
console.log('3. Module exports analysis:');
console.log('   Module keys:', Object.keys(moduleExports));
console.log('   JSEncrypt type:', typeof moduleExports.JSEncrypt);
console.log('   default type:', typeof moduleExports.default);
console.log('   Are they the same?', moduleExports.JSEncrypt === moduleExports.default);
