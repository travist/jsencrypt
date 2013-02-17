/**
 * Add a translate method to the RSAKey class.
 */
RSAKey.prototype.parseKey = function(keyString) {

  // Prepare the key string.
  keyString = this.prepareKey(keyString);

  // Get the structure of this key.
  var structure = this.structure();

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
 * Returns the base key without header in base16 (hex) format.
 */
RSAKey.prototype.getBaseKey = function() {
  var b16 = '';
  var structure = this.structure();
  var info = null, value = null, length = 0;
  for (var prop in structure) {
    info = structure[prop];
    if (info.variable) {
      value = this[prop].toString(16);
      if (!!(value.length % 2)) {
        value = "0" + value;
      }
      length = (value.length / 2);
      if (info.hasOwnProperty('padded')) {
        length++;
      }
      length = length.toString(16);
      if (!!(length.length % 2)) {
        length = "0" + length;
      }
      b16 += length;
      if (info.hasOwnProperty('offset')) {
        b16 += length;
      }
      if (info.hasOwnProperty('padded')) {
        b16 += "00";
      }
      b16 += value;
      b16 += "02";   // spacer.
    }
  }

  // Remove the last spacer.
  return b16.slice(0, -2);
};

/**
 * Create a word wrap.
 */
RSAKey.prototype.wordwrap = function(str, width) {
  width = width || 64;
  if (!str) {
    return str;
  }
  var regex = '(.{1,' + width + '})( +|$\n?)|(.{1,' + width + '})';
  return str.match(RegExp(regex, 'g')).join('\n');
}

// Return a new Private key.
RSAKey.prototype.getPrivateKey = function() {
  var key = "-----BEGIN RSA PRIVATE KEY-----\n";
  var b16 = '';
  b16 += "3082025e02010002";  // header + spacer + verlen + version + spacer.
  b16 += this.getBaseKey();
  key += this.wordwrap(hex2b64(b16)) + "\n";
  key += "-----END RSA PRIVATE KEY-----";
  return key;
};

// Return a new Public key.
RSAKey.prototype.getPublicKey = function() {
  var key = "-----BEGIN PUBLIC KEY-----\n";
  var b16 = '';
  b16 += "30819f300d06092a864886f70d010101050003818d0030818902";  // header + spacer.
  b16 += this.getBaseKey();
  key += this.wordwrap(hex2b64(b16)) + "\n";
  key += "-----END PUBLIC KEY-----";
  return key;
};

/**
 * Create a private key class to extend the RSAKey.
 *
 * @param string privkey - The private key in string format.
 */
var RSAPrivateKey = function(privkey) {

  // Call teh constructor.
  RSAKey.call(this);

  // If a private key was provided.
  if (privkey) {

    // Parse the key.
    this.parseKey(privkey);
  }
};

// Derive from RSAKey.
RSAPrivateKey.prototype = new RSAKey();

// Reset the contructor.
RSAPrivateKey.prototype.constructor = RSAPrivateKey;

// Returns the structure for the private key.
// See http://etherhack.co.uk/asymmetric/docs/rsa_key_breakdown.html
RSAPrivateKey.prototype.structure = function() {
  return {
    'header': {length: 4},
    'versionlength': {length: 1, offset: 1, type: 'int'},
    'version': {length:'versionlength', type: 'int'},
    'n_length': {length:1, offset:1, type: 'int'},
    'n': {length:'n_length', offset:1, type: 'bigint', variable:true, padded: true},
    'e_length': {length:1, offset:1, type: 'int'},
    'e': {length:'e_length', type: 'int', variable:true},
    'd_length': {length:1, offset:1, type: 'int'},
    'd': {length:'d_length', offset:1, type: 'bigint', variable:true, padded: true},
    'p_length': {length:1, offset:1, type: 'int'},
    'p': {length:'p_length', type: 'bigint', variable:true, padded: true},
    'q_length': {length:1, offset:1, type: 'int'},
    'q': {length:'q_length', type: 'bigint', variable:true, padded: true},
    'dmp1_length': {length: 1, offset: 1, type: 'int'},
    'dmp1': {length: 'dmp1_length', type: 'bigint', variable:true},
    'dmq1_length': {length: 1, offset: 1, type: 'int'},
    'dmq1': {length: 'dmq1_length', type: 'bigint', variable:true, padded: true},
    'coeff_length': {length: 1, offset: 1, type: 'int'},
    'coeff': {length: 'coeff_length', type: 'bigint', variable:true, padded: true}
  };
};

/**
 * Create a public key class to extend the RSAKey.
 *
 * @param string pubkey - The public key in string format.
 */
var RSAPublicKey = function(pubkey) {

  // Call teh constructor.
  RSAKey.call(this);

  // If a pubkey key was provided.
  if (pubkey) {

    // Parse the key.
    this.parseKey(pubkey);
  }
};

// Derive from RSAKey.
RSAPublicKey.prototype = new RSAKey();

// Reset the contructor.
RSAPublicKey.prototype.constructor = RSAPublicKey;

// Returns the structure for the public key.
// See http://etherhack.co.uk/asymmetric/docs/rsa_key_breakdown.html
RSAPublicKey.prototype.structure = function() {
  return {
    'header': {length: 25},
    'n_length': {length:1, offset:1, type: 'int'},
    'n': {length:'n_length', offset:1, type: 'bigint', variable:true, padded: true},
    'e_length': {length:1, offset:1, type: 'int'},
    'e': {length:'e_length', type: 'int', variable:true}
  };
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
 * Set the private key.
 */
JSEncrypt.prototype.setPrivateKey = function(privkey) {
  this.privkey = new RSAPrivateKey(privkey);
};

/**
 * Set the public key.
 */
JSEncrypt.prototype.setPublicKey = function(pubkey) {
  this.pubkey = new RSAPublicKey(pubkey);
};

/**
 * Decryption method to take a private PEM string and decrypt text.
 */
JSEncrypt.prototype.decrypt = function(string) {

  // If a private ke is available, then decrypt.
  if (this.privkey) {

    // Return the decrypted string.
    return this.privkey.decrypt(b64tohex(string));
  }
  else {

    // Return false...
    return false;
  }
}

/**
 * Encrypttion method to take a public PEM string and encrypt text.
 */
JSEncrypt.prototype.encrypt = function(string) {

  // We can use either the public key or the private key for encryption.
  var key = this.pubkey || this.privkey;

  // If the key exists.
  if (key) {

    // Return the encrypted string.
    return hex2b64(key.encrypt(string));
  }
  else {

    // Return false.
    return false;
  }
}

/**
 * Return the private key, or a generated one if it doesn't exist.
 */
JSEncrypt.prototype.getPrivateKey = function() {

  // Only create new if it does not exist.
  if (!this.privkey) {

    // Get a new private key.
    this.privkey = new RSAPrivateKey();

    // Generate the key.
    this.privkey.generate();
  }

  // Return the private representation of this key.
  return this.privkey.getPrivateKey();
};

/**
 * Return the public key, or a generated one if it doesn't exist.
 */
JSEncrypt.prototype.getPublicKey = function() {

  // Only create new if it does not exist.
  if (!this.pubkey) {

    // Get a new private key.
    this.pubkey = new RSAPublicKey();

    // Generate the key.
    this.pubkey.generate();
  }

  // Return the private representation of this key.
  return this.pubkey.getPublicKey();
};