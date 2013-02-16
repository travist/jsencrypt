/**
 * Add a translate method to the RSAKey class.
 */
RSAKey.prototype.parseKey = function(structure, keyString) {

  // Go through and parse all the properties.
  var offset = 0, info = null, value = null, length = 0;
  for (var prop in structure) {
    info = structure[prop];
    if (info.hasOwnProperty('offset')) {
      offset += (info.offset * 2);
    }

    // Determine the length.
    length = typeof info.length == 'string' ? this[info.length] : info.length;
    length *= 2;
    value = keyString.substr(offset, length);
    if (info.hasOwnProperty('type')) {
      if (info.type == 'int') {
        value = parseInt(value, 16);
      }
      else if (info.type == 'bigint') {
        value = parseBigInt(value, 16);
      }
    }

    // Increment the offset with the length.
    offset += length;

    // Assign the property.
    this[prop] = value;
  }
};

/**
 * Add a char64toHex method.
 */
RSAKey.prototype.char64ToHex = function(str) {
  var hex = '';
  str = atob(str);
  for (var i = 0; i < str.length; ++i) {
    var tmp = str.charCodeAt(i).toString(16);
    if (tmp.length === 1) tmp = "0" + tmp;
    hex += tmp;
  }
  return hex;
};

/**
 * Add a prepare key method.
 *
 * @param {string} The key to prepare.
 * @return {string} The hexidecimal version of the key.
 */
RSAKey.prototype.prepareKey = function(keyString) {

  // Split the key from the line feeds.
  var lines = keyString.split('\n');

  // Remove the first and last lines.
  lines = lines.slice(1, (lines.length - 1));

  // Join these back into the key.
  keyString = lines.join('');

  // Convert the key to hex.
  return this.char64ToHex(keyString);
};

/**
 * Create a private key class to extend the RSAKey.
 *
 * @param string privkey - The private key in string format.
 */
var RSAPrivateKey = function(privkey) {

  // Call teh constructor.
  RSAKey.call(this);

  // Parse the key.
  this.parseKey(privkey);
};

// Derive from RSAKey.
RSAPrivateKey.prototype = new RSAKey();

// Reset the contructor.
RSAPrivateKey.prototype.constructor = RSAPrivateKey;

// Parse a key.
RSAPrivateKey.prototype.parseKey = function(privkey) {

  // Now parse this key according to the structure defined @
  // http://etherhack.co.uk/asymmetric/docs/rsa_key_breakdown.html
  RSAKey.prototype.parseKey.call(this, {
    'header': {length: 4},
    'versionlength': {length: 1, offset: 1, type: 'int'},
    'version': {length:'versionlength', type: 'int'},
    'n_length': {length:1, offset:2, type: 'int'},
    'n': {length:'n_length', type: 'bigint'},
    'e_length': {length:1, offset:1, type: 'int'},
    'e': {length:'e_length', type: 'int'},
    'd_length': {length:1, offset:2, type: 'int'},
    'd': {length:'d_length', type: 'bigint'},
    'p_length': {length:1, offset:1, type: 'int'},
    'p': {length:'p_length', type: 'bigint'},
    'q_length': {length:1, offset:1, type: 'int'},
    'q': {length:'q_length', type: 'bigint'},
    'dmp1_length': {length: 1, offset: 1, type: 'int'},
    'dmp1': {length: 'dmp1_length', type: 'bigint'},
    'dmq1_length': {length: 1, offset: 1, type: 'int'},
    'dmq1': {length: 'dmq1_length', type: 'bigint'},
    'coeff_length': {length: 1, offset: 1, type: 'int'},
    'coeff': {length: 'coeff_length', type: 'bigint'}
  }, this.prepareKey(privkey));
};

/**
 * Create a public key class to extend the RSAKey.
 *
 * @param string privkey - The private key in string format.
 */
var RSAPublicKey = function(privkey) {

  // Call teh constructor.
  RSAKey.call(this);

  // Parse the key.
  this.parseKey(privkey);
};

// Derive from RSAKey.
RSAPublicKey.prototype = new RSAKey();

// Reset the contructor.
RSAPublicKey.prototype.constructor = RSAPublicKey;

// Parse a key.
RSAPublicKey.prototype.parseKey = function(pubkey) {

  // Now parse this key according to the structure defined @
  // http://etherhack.co.uk/asymmetric/docs/rsa_key_breakdown.html
  RSAKey.prototype.parseKey.call(this, {
    'header': {length: 25},
    'n_length': {length:1, offset:2, type: 'int'},
    'n': {length:'n_length', type: 'bigint'},
    'e_length': {length:1, offset:1, type: 'int'},
    'e': {length:'e_length', type: 'int'}
  }, this.prepareKey(pubkey));
};

/**
 * Class to do the encryption.
 */
var JSEncrypt = function() {

  // The private and public keys.
  this.privkey = null;
  this.pubkey = null;
};

/**
 * Decryption method to take a private PEM string and decrypt text.
 */
JSEncrypt.prototype.decrypt = function(privkey, string) {

  // If the key has already been defined, then don't define it again.
  if (!this.privkey) {
    this.privkey = new RSAPrivateKey(privkey);
  }

  // Return the decrypted string.
  return this.privkey.decrypt(b64tohex(string));
}

/**
 * Encrypttion method to take a public PEM string and encrypt text.
 */
JSEncrypt.prototype.encrypt = function(pubkey, string) {

  // If the pubkey has not been defined then do it here.
  if (!this.pubkey) {
    this.pubkey = new RSAPublicKey(pubkey);
  }

  // Return the encrypted string.
  return hex2b64(this.pubkey.encrypt(string));
}