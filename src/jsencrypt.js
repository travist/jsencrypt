/**
 * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
 * @returns {string}
 * @public
 */
ASN1.prototype.getHexStringValue = function () {
  var hexString = this.toHexString();
  var offset = this.header * 2;
  var length = this.length * 2;
  return hexString.substr(offset, length);
};

/**
 * Method to parse a pem encoded string containing both a public or private key.
 * The method will translate the pem encoded string in a der encoded string and
 * will parse private key and public key parameters. This method accepts public key
 * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
 *
 * @todo Check how many rsa formats use the same format of pkcs #1.
 *
 * The format is defined as:
 * PublicKeyInfo ::= SEQUENCE {
 *   algorithm       AlgorithmIdentifier,
 *   PublicKey       BIT STRING
 * }
 * Where AlgorithmIdentifier is:
 * AlgorithmIdentifier ::= SEQUENCE {
 *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
 *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
 * }
 * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
 * RSAPublicKey ::= SEQUENCE {
 *   modulus           INTEGER,  -- n
 *   publicExponent    INTEGER   -- e
 * }
 * it's possible to examine the structure of the keys obtained from openssl using
 * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
 * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
 * @private
 */
RSAKey.prototype.parseKey = function (pem) {
  try {
    var modulus = 0;
    var public_exponent = 0;
    var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
    var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
    var asn1 = ASN1.decode(der);
    if (asn1.sub.length === 9) {

      // Parse the private key.
      modulus = asn1.sub[1].getHexStringValue(); //bigint
      this.n = parseBigInt(modulus, 16);

      public_exponent = asn1.sub[2].getHexStringValue(); //int
      this.e = parseInt(public_exponent, 16);

      var private_exponent = asn1.sub[3].getHexStringValue(); //bigint
      this.d = parseBigInt(private_exponent, 16);

      var prime1 = asn1.sub[4].getHexStringValue(); //bigint
      this.p = parseBigInt(prime1, 16);

      var prime2 = asn1.sub[5].getHexStringValue(); //bigint
      this.q = parseBigInt(prime2, 16);

      var exponent1 = asn1.sub[6].getHexStringValue(); //bigint
      this.dmp1 = parseBigInt(exponent1, 16);

      var exponent2 = asn1.sub[7].getHexStringValue(); //bigint
      this.dmq1 = parseBigInt(exponent2, 16);

      var coefficient = asn1.sub[8].getHexStringValue(); //bigint
      this.coeff = parseBigInt(coefficient, 16);

    }
    else if (asn1.sub.length === 2) {

      // Parse the public key.
      var bit_string = asn1.sub[1];
      var sequence = bit_string.sub[0];

      modulus = sequence.sub[0].getHexStringValue();
      this.n = parseBigInt(modulus, 16);
      public_exponent = sequence.sub[1].getHexStringValue();
      this.e = parseInt(public_exponent, 16);

    }
    else {
      return false;
    }
    return true;
  }
  catch (ex) {
    return false;
  }
};

/**
 * Translate rsa parameters in a hex encoded string representing the rsa key.
 *
 * The translation follow the ASN.1 notation :
 * RSAPrivateKey ::= SEQUENCE {
 *   version           Version,
 *   modulus           INTEGER,  -- n
 *   publicExponent    INTEGER,  -- e
 *   privateExponent   INTEGER,  -- d
 *   prime1            INTEGER,  -- p
 *   prime2            INTEGER,  -- q
 *   exponent1         INTEGER,  -- d mod (p1)
 *   exponent2         INTEGER,  -- d mod (q-1)
 *   coefficient       INTEGER,  -- (inverse of q) mod p
 * }
 * @returns {string}  DER Encoded String representing the rsa private key
 * @private
 */
RSAKey.prototype.getPrivateBaseKey = function () {
  var options = {
    'array': [
      new KJUR.asn1.DERInteger({'int': 0}),
      new KJUR.asn1.DERInteger({'bigint': this.n}),
      new KJUR.asn1.DERInteger({'int': this.e}),
      new KJUR.asn1.DERInteger({'bigint': this.d}),
      new KJUR.asn1.DERInteger({'bigint': this.p}),
      new KJUR.asn1.DERInteger({'bigint': this.q}),
      new KJUR.asn1.DERInteger({'bigint': this.dmp1}),
      new KJUR.asn1.DERInteger({'bigint': this.dmq1}),
      new KJUR.asn1.DERInteger({'bigint': this.coeff})
    ]
  };
  var seq = new KJUR.asn1.DERSequence(options);
  return seq.getEncodedHex();
};

/**
 * base64 (pem) encoded version of the DER encoded representation
 * @returns {string} pem encoded representation without header and footer
 * @public
 */
RSAKey.prototype.getPrivateBaseKeyB64 = function () {
  return hex2b64(this.getPrivateBaseKey());
};

/**
 * Translate rsa parameters in a hex encoded string representing the rsa public key.
 * The representation follow the ASN.1 notation :
 * PublicKeyInfo ::= SEQUENCE {
 *   algorithm       AlgorithmIdentifier,
 *   PublicKey       BIT STRING
 * }
 * Where AlgorithmIdentifier is:
 * AlgorithmIdentifier ::= SEQUENCE {
 *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
 *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
 * }
 * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
 * RSAPublicKey ::= SEQUENCE {
 *   modulus           INTEGER,  -- n
 *   publicExponent    INTEGER   -- e
 * }
 * @returns {string} DER Encoded String representing the rsa public key
 * @private
 */
RSAKey.prototype.getPublicBaseKey = function () {
  var options = {
    'array': [
      new KJUR.asn1.DERObjectIdentifier({'oid': '1.2.840.113549.1.1.1'}), //RSA Encryption pkcs #1 oid
      new KJUR.asn1.DERNull()
    ]
  };
  var first_sequence = new KJUR.asn1.DERSequence(options);

  options = {
    'array': [
      new KJUR.asn1.DERInteger({'bigint': this.n}),
      new KJUR.asn1.DERInteger({'int': this.e})
    ]
  };
  var second_sequence = new KJUR.asn1.DERSequence(options);

  options = {
    'hex': '00' + second_sequence.getEncodedHex()
  };
  var bit_string = new KJUR.asn1.DERBitString(options);

  options = {
    'array': [
      first_sequence,
      bit_string
    ]
  };
  var seq = new KJUR.asn1.DERSequence(options);
  return seq.getEncodedHex();
};

/**
 * base64 (pem) encoded version of the DER encoded representation
 * @returns {string} pem encoded representation without header and footer
 * @public
 */
RSAKey.prototype.getPublicBaseKeyB64 = function () {
  return hex2b64(this.getPublicBaseKey());
};

/**
 * wrap the string in block of width chars. The default value for rsa keys is 64
 * characters.
 * @param {string} str the pem encoded string without header and footer
 * @param {Number} [width=64] - the length the string has to be wrapped at
 * @returns {string}
 * @private
 */
RSAKey.prototype.wordwrap = function (str, width) {
  width = width || 64;
  if (!str) {
    return str;
  }
  var regex = '(.{1,' + width + '})( +|$\n?)|(.{1,' + width + '})';
  return str.match(RegExp(regex, 'g')).join('\n');
};

/**
 * Retrieve the pem encoded private key
 * @returns {string} the pem encoded private key with header/footer
 * @public
 */
RSAKey.prototype.getPrivateKey = function () {
  var key = '-----BEGIN RSA PRIVATE KEY-----\n';
  key += this.wordwrap(this.getPrivateBaseKeyB64()) + '\n';
  key += '-----END RSA PRIVATE KEY-----';
  return key;
};

/**
 * Retrieve the pem encoded public key
 * @returns {string} the pem encoded public key with header/footer
 * @public
 */
RSAKey.prototype.getPublicKey = function () {
  var key = '-----BEGIN PUBLIC KEY-----\n';
  key += this.wordwrap(this.getPublicBaseKeyB64()) + '\n';
  key += '-----END PUBLIC KEY-----';
  return key;
};

/**
 * Check if the object contains the necessary parameters to populate the rsa modulus
 * and public exponent parameters.
 * @param {Object} [obj={}] - An object that may contain the two public key
 * parameters
 * @returns {boolean} true if the object contains both the modulus and the public exponent
 * properties (n and e)
 * @todo check for types of n and e. N should be a parseable bigInt object, E should
 * be a parseable integer number
 * @private
 */
RSAKey.prototype.hasPublicKeyProperty = function (obj) {
  obj = obj || {};
  return (
    obj.hasOwnProperty('n') &&
    obj.hasOwnProperty('e')
  );
};

/**
 * Check if the object contains ALL the parameters of an RSA key.
 * @param {Object} [obj={}] - An object that may contain nine rsa key
 * parameters
 * @returns {boolean} true if the object contains all the parameters needed
 * @todo check for types of the parameters all the parameters but the public exponent
 * should be parseable bigint objects, the public exponent should be a parseable integer number
 * @private
 */
RSAKey.prototype.hasPrivateKeyProperty = function (obj) {
  obj = obj || {};
  return (
    obj.hasOwnProperty('n') &&
    obj.hasOwnProperty('e') &&
    obj.hasOwnProperty('d') &&
    obj.hasOwnProperty('p') &&
    obj.hasOwnProperty('q') &&
    obj.hasOwnProperty('dmp1') &&
    obj.hasOwnProperty('dmq1') &&
    obj.hasOwnProperty('coeff')
  );
};

/**
 * Parse the properties of obj in the current rsa object. Obj should AT LEAST
 * include the modulus and public exponent (n, e) parameters.
 * @param {Object} obj - the object containing rsa parameters
 * @private
 */
RSAKey.prototype.parsePropertiesFrom = function (obj) {
  this.n = obj.n;
  this.e = obj.e;

  if (obj.hasOwnProperty('d')) {
    this.d = obj.d;
    this.p = obj.p;
    this.q = obj.q;
    this.dmp1 = obj.dmp1;
    this.dmq1 = obj.dmq1;
    this.coeff = obj.coeff;
  }
};

/**
 * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
 * This object is just a decorator for parsing the key parameter
 * @param {string|Object} key - The key in string format, or an object containing
 * the parameters needed to build a RSAKey object.
 * @constructor
 */
var JSEncryptRSAKey = function (key) {
  // Call the super constructor.
  RSAKey.call(this);
  // If a key key was provided.
  if (key) {
    // If this is a string...
    if (typeof key === 'string') {
      this.parseKey(key);
    }
    else if (
      this.hasPrivateKeyProperty(key) ||
      this.hasPublicKeyProperty(key)
    ) {
      // Set the values for the key.
      this.parsePropertiesFrom(key);
    }
  }
  this.worker = null;
  this.blobUrl = null;
};

// Derive from RSAKey.
JSEncryptRSAKey.prototype = new RSAKey();

// Reset the contructor.
JSEncryptRSAKey.prototype.constructor = JSEncryptRSAKey;

/**
 * This function will be called only if the JSEncrypt object has been created with the script_path options. If worker are available in the current browser
 * will try to create one to be used later.
 * @param {string} scriptPath the network path reference or the absolute URI to the file containing the jsencrypt source code (e.g. "//example.com/js/jsencrypt.min.js")
 * @private
 */
JSEncryptRSAKey.prototype.loadWorker = function (scriptPath) {
  if (!scriptPath)
    return;
  if (typeof Worker === "undefined")
    return;
  this.terminateWorker();
  //Yeah I know, this is a bit of a hack, but this way we will
  //have only one file to distribute instead of two.
  var source = '@@jsencrypt_worker_source@@';
  source = source.replace('@@source_file@@', scriptPath);
  var blob = new Blob([source]);
  this.blobUrl = URL.createObjectURL(blob);
  this.worker = new Worker(this.blobUrl);
};

/**
 * This function will check if a worker has been created by the loadWorker function (meaning that worker are available in the current browser
 * and that the JSEncrypt object has been created with the script_path option), if so it will ask the worker to create an RSA key with the
 * specified parameters (keySize and exponent) and will call the callback function when it's done. If instead worker are not available or the
 * object has not been created with the script_path option this method will fallback on the old generateAsync method
 * @param {number} [keySize]  default: 1024 the key size in bit
 * @param {string} [exponent] default: '010001' the hexadecimal representation of the public exponent
 * @param {callback} [cb] the callback to be called if we want the key to be generated in an async fashion
 * @param {string} [scriptPath] the network path reference or the absolute URI to the file containing the jsencrypt source code (e.g. "//example.com/js/jsencrypt.min.js")
 * @public
 */
JSEncryptRSAKey.prototype.generateAsync2 = function(keySize, exponent, callback, scriptPath) {
  this.loadWorker(scriptPath);
  if (this.worker) {
    var that = this;
    this.worker.addEventListener('message', function(e) {
      that.parseKey(e.data.key);
      that.terminateWorker();
      if (callback) {
        callback();
      }
    }, false);
    this.worker.postMessage({size:keySize, exp: exponent});
  } else {
    this.generateAsync(keySize, exponent, callback);
  }
};

/**
 * Terminate a worker that was previously created, releasing the BLOB holding the current source file
 * @private
 */
JSEncryptRSAKey.prototype.terminateWorker = function () {
  if (this.worker) {
    this.worker.terminate();
    URL.revokeObjectURL(this.blobUrl);
    this.blobUrl = null;
    this.worker = null;
  }
};

/**
 *
 * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
 * possible parameters are:
 * - default_key_size        {number}  default: 1024 the key size in bit
 * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
 * - log                     {boolean} default: false whether log warn/error or not
 * - script_path             {string}  default: null a network path reference or an absolute URI to the file containing the jsencrypt source code (e.g. "//example.com/js/jsencrypt.min.js")
 * @constructor
 */
var JSEncrypt = function (options) {
  options = options || {};
  this.default_key_size = parseInt(options.default_key_size) || 1024;
  this.default_public_exponent = options.default_public_exponent || '010001'; //65537 default openssl public exponent for rsa key type
  this.log = options.log || false;
  // The private and public key.
  this.key = null;
  // Used to cache the string representations of the current key, created lazily
  this.publicKey = null;
  this.privateKey = null;
  this.publicKeyB64 = null;
  this.privateKeyB64 = null;

  //A worker object that keeps a copy of the current object
  this.scriptPath = options.script_path || null;
};

/**
 * Method to set the rsa key parameter (one method is enough to set both the public
 * and the private key, since the private key contains the public key paramenters)
 * Log a warning if logs are enabled
 * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
 * @public
 */
JSEncrypt.prototype.setKey = function (key) {
  if (this.log && this.key) {
    console.warn('A key was already set, overriding existing.');
  }
  this.key = new JSEncryptRSAKey(key);
  // Reset caches
  this.publicKey = null;
  this.privateKey = null;
  this.publicKeyB64 = null;
  this.privateKeyB64 = null;
};

/**
 * Proxy method for setKey, for api compatibility
 * @see setKey
 * @public
 */
JSEncrypt.prototype.setPrivateKey = function (privkey) {
  // Create the key.
  this.setKey(privkey);
};

/**
 * Proxy method for setKey, for api compatibility
 * @see setKey
 * @public
 */
JSEncrypt.prototype.setPublicKey = function (pubkey) {
  // Sets the public key.
  this.setKey(pubkey);
};

/**
 * Proxy method for RSAKey object's decrypt, decrypt the string using the private
 * components of the rsa key object. Note that if the object was not set will be created
 * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
 * @param {string} string base64 encoded crypted string to decrypt
 * @return {string} the decrypted string
 * @public
 */
JSEncrypt.prototype.decrypt = function (string) {
  // Return the decrypted string.
  try {
    return this.getKey().decrypt(b64tohex(string));
  }
  catch (ex) {
    return false;
  }
};

/**
 * Proxy method for RSAKey object's encrypt, encrypt the string using the public
 * components of the rsa key object. Note that if the object was not set will be created
 * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
 * @param {string} string the string to encrypt
 * @return {string} the encrypted string encoded in base64
 * @public
 */
JSEncrypt.prototype.encrypt = function (string) {
  // Return the encrypted string.
  try {
    return hex2b64(this.getKey().encrypt(string));
  }
  catch (ex) {
    return false;
  }
};

/**
 * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
 * will be created and returned
 * @param {callback} [cb] the callback to be called if we want the key to be generated
 * in an async fashion
 * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
 * @public
 */
JSEncrypt.prototype.getKey = function (cb) {
  // Only create new if it does not exist.
  if (!this.key) {
    // Get a new private key.
    this.key = new JSEncryptRSAKey();
    if (cb && {}.toString.call(cb) === '[object Function]') {
      this.key.generateAsync2(this.default_key_size, this.default_public_exponent, cb, this.scriptPath);
      return;
    }
    // Generate the key.
    this.key.generate(this.default_key_size, this.default_public_exponent);
  }
  return this.key;
};

/**
 * Returns the pem encoded representation of the private key
 * If the key doesn't exists a new key will be created
 * @returns {string} pem encoded representation of the private key WITH header and footer
 * @public
 */
JSEncrypt.prototype.getPrivateKey = function () {
  // Return the private representation of this key.
  if (!this.privateKey) {
    this.privateKey = this.getKey().getPrivateKey();
  }
  return this.privateKey;
};

/**
 * Returns the pem encoded representation of the private key
 * If the key doesn't exists a new key will be created
 * @returns {string} pem encoded representation of the private key WITHOUT header and footer
 * @public
 */
JSEncrypt.prototype.getPrivateKeyB64 = function () {
  // Return the private representation of this key.
  if (!this.privateKeyB64) {
    this.privateKeyB64 = this.getKey().getPrivateBaseKeyB64();
  }
  return this.privateKeyB64;
};


/**
 * Returns the pem encoded representation of the public key
 * If the key doesn't exists a new key will be created
 * @returns {string} pem encoded representation of the public key WITH header and footer
 * @public
 */
JSEncrypt.prototype.getPublicKey = function () {
  // Return the private representation of this key.
  if (!this.publicKey) {
    this.publicKey = this.getKey().getPublicKey();
  }
  return this.publicKey;
};

/**
 * Returns the pem encoded representation of the public key
 * If the key doesn't exists a new key will be created
 * @returns {string} pem encoded representation of the public key WITHOUT header and footer
 * @public
 */
JSEncrypt.prototype.getPublicKeyB64 = function () {
  // Return the private representation of this key.
  if (!this.publicKeyB64) {
    this.publicKeyB64 = this.getKey().getPublicBaseKeyB64();
  }
  return this.publicKeyB64;
};


/**

Reference: 
http://www.ietf.org/rfc/rfc5480.txt
http://tools.ietf.org/html/rfc5915

Tom Wu's supported SEC key algorithms :

secp160k1
secp160r1
secp192k1
secp192r1
secp224r1
secp256r1


SEC public key format:

SubjectPublicKeyInfo  ::=  SEQUENCE  {
  algorithm         AlgorithmIdentifier,
  subjectPublicKey  BIT STRING
}

where 

AlgorithmIdentifier  ::=  SEQUENCE  {
  algorithm   OBJECT IDENTIFIER,
  parameters  ANY DEFINED BY algorithm OPTIONAL
}

SEC private key format:

ECPrivateKey ::= SEQUENCE {
  version        INTEGER { ecPrivkeyVer1(1) } (ecPrivkeyVer1),
  privateKey     OCTET STRING,
  parameters [0] ECParameters {{ NamedCurve }} OPTIONAL,
  publicKey  [1] BIT STRING OPTIONAL
}

Mind that althought parameters are indicated as OPTIONAL implementation that conforms to RFC 5480 and 5915 MUST ALWAYS include the parameters field

generate keys:

#!/bin/bash

curves=("secp160k1" "secp160r1" "secp192k1" "secp192r1" "secp224r1" "secp256r1")

for curve in ${curves[@]} 
do
  echo "Generating curve $curve..."
  openssl ecparam -name "$curve" -genkey -noout -out "$curve-key.pem" 
  openssl ec -in "$curve-key.pem" -pubout -out "$curve-key.pub.pem"
  echo -e "\n\n$curve-key.pem" >> output
  cat "$curve-key.pem" >> output
  echo -e "\n$curve-key.pub.pem" >> output
  cat "$curve-key.pub.pem" >> output
done

====================================================================================================================================

secp160k1-key.pem
-----BEGIN EC PRIVATE KEY-----
MFACAQEEFG2KnYudKdPsl36Mm5/EHScUAaXboAcGBSuBBAAJoSwDKgAEornk9n3G
R1GXUxaSWowH4i32eSDQSY2zFoQyFBjNuBGqwZAt4uomyA==
-----END EC PRIVATE KEY-----

SEQUENCE(4 elem)
  INTEGER 1
  OCTET STRING(20 byte) 6D8A9D8B9D29D3EC977E8C9B9FC41D271401A5DB
  [0](1 elem)
    OBJECT IDENTIFIER 1.3.132.0.9
  [1](1 elem)
    BIT STRING(328 bit) 0001001101100100010101110100011110110100000010011000001101010101100010…

secp160k1-key.pub.pem
-----BEGIN PUBLIC KEY-----
MD4wEAYHKoZIzj0CAQYFK4EEAAkDKgAEornk9n3GR1GXUxaSWowH4i32eSDQSY2z
FoQyFBjNuBGqwZAt4uomyA==
-----END PUBLIC KEY-----

SEQUENCE (2 elem)
  SEQUENCE (2 elem)
    OBJECT IDENTIFIER 1.2.840.10045.2.1
    OBJECT IDENTIFIER 1.3.132.0.9
  BIT STRING (328 bit) 0001001101100100010101110100011110110100000010011000001101010101100010…

====================================================================================================================================

secp160r1-key.pem
-----BEGIN EC PRIVATE KEY-----
MFACAQEEFH0rFivZZmIDljGa10r9xqS/rdkpoAcGBSuBBAAIoSwDKgAE9vjkoYyF
qVGmgq+TgKPpDRfRx4R6EwQot2dsh362nLcpV4+CpUloRQ==
-----END EC PRIVATE KEY-----

SEQUENCE (4 elem)
INTEGER 1
  OCTET STRING (20 byte) 7D2B162BD966620396319AD74AFDC6A4BFADD929
  [0](1 elem)
    OBJECT IDENTIFIER 1.3.132.0.8
  [1] (1 elem)
    BIT STRING(328 bit) 1010001000010110100100101010010101000001111100011110101010010100111011…

secp160r1-key.pub.pem
-----BEGIN PUBLIC KEY-----
MD4wEAYHKoZIzj0CAQYFK4EEAAgDKgAE9vjkoYyFqVGmgq+TgKPpDRfRx4R6EwQo
t2dsh362nLcpV4+CpUloRQ==
-----END PUBLIC KEY-----

====================================================================================================================================

secp192k1-key.pem
-----BEGIN EC PRIVATE KEY-----
MFwCAQEEGCcPzu2cfD/7yilD2NQV6gblCRkcYoVHc6AHBgUrgQQAH6E0AzIABBim
ummr+v5+n5ZH9lYE+4zuHyxMWeJL4ZcXhMWApW5YsW1PUKQ9Fti2rcaYvLvjQQ==
-----END EC PRIVATE KEY-----

secp192k1-key.pub.pem
-----BEGIN PUBLIC KEY-----
MEYwEAYHKoZIzj0CAQYFK4EEAB8DMgAEGKa6aav6/n6flkf2VgT7jO4fLExZ4kvh
lxeExYClblixbU9QpD0W2Latxpi8u+NB
-----END PUBLIC KEY-----

====================================================================================================================================

secp192r1-key.pem
-----BEGIN EC PRIVATE KEY-----
MF8CAQEEGMPLTo1oAumyOlTyyq0yN7WSs31VcLuIa6AKBggqhkjOPQMBAaE0AzIA
BEwsAYl/hqxkDWcurXhPyaQK1RzhdpyUFDduFXlhmeX2D0NJPcNSdBHn1nqWOPPS
5A==
-----END EC PRIVATE KEY-----

secp192r1-key.pub.pem
-----BEGIN PUBLIC KEY-----
MEkwEwYHKoZIzj0CAQYIKoZIzj0DAQEDMgAETCwBiX+GrGQNZy6teE/JpArVHOF2
nJQUN24VeWGZ5fYPQ0k9w1J0EefWepY489Lk
-----END PUBLIC KEY-----

====================================================================================================================================

secp224r1-key.pem
-----BEGIN EC PRIVATE KEY-----
MGgCAQEEHLtZCwOBR2TjcKyugYcA6oMz64r10+QS9vpSK42gBwYFK4EEACGhPAM6
AARBMstxa5L4zLl0+ENlBWtuDXkbRTX+6DBVwj62OpV3DSLXGEns7AHI8DSoSD1V
yZ+/W2UEJhGStg==
-----END EC PRIVATE KEY-----

secp224r1-key.pub.pem
-----BEGIN PUBLIC KEY-----
ME4wEAYHKoZIzj0CAQYFK4EEACEDOgAEQTLLcWuS+My5dPhDZQVrbg15G0U1/ugw
VcI+tjqVdw0i1xhJ7OwByPA0qEg9Vcmfv1tlBCYRkrY=
-----END PUBLIC KEY-----

====================================================================================================================================

secp256r1-key.pem
-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIHM8o0pJf654Brckx/IKqMMfxMr7HIYR93a/prP3ncqBoAoGCCqGSM49
AwEHoUQDQgAElg2fQy0QbRvGbKKvQcH1vF+GcOYa4a//pL2Md6LBj1WkwXqdN8ei
aq8sfK4MFZ5jUhujkJ+1566o1a80bIOGsQ==
-----END EC PRIVATE KEY-----

secp256r1-key.pub.pem
-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAElg2fQy0QbRvGbKKvQcH1vF+GcOYa
4a//pL2Md6LBj1WkwXqdN8eiaq8sfK4MFZ5jUhujkJ+1566o1a80bIOGsQ==
-----END PUBLIC KEY-----

====================================================================================================================================

****/

