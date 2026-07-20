// Simple Node.js test for JSEncrypt
var JSEncrypt = require('./bin/jsencrypt.js');

console.log('Testing JSEncrypt in Node.js...');
console.log('typeof JSEncrypt:', typeof JSEncrypt);

try {
    var crypt = new JSEncrypt();
    console.log('✅ new JSEncrypt() successful');
    
    // Test key generation
    crypt.getKey();
    var privKey = crypt.getPrivateKey();
    var pubKey = crypt.getPublicKey();
    
    console.log('✅ Key generation successful');
    console.log('Private key length:', privKey.length);
    console.log('Public key length:', pubKey.length);
    
    // Test encryption/decryption
    var testText = "Hello JSEncrypt!";
    var encrypted = crypt.encrypt(testText);
    var decrypted = crypt.decrypt(encrypted);
    
    console.log('✅ Encryption/Decryption successful');
    console.log('Original:', testText);
    console.log('Decrypted:', decrypted);
    console.log('Match:', testText === decrypted);
    
} catch (e) {
    console.log('❌ Error:', e.message);
}
