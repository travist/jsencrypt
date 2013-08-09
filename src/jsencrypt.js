ASN1.prototype.getHexStringValue = function(){
    var hexString = this.toHexString();
    var offset = this.header * 2;
    var length = this.length * 2;
    return hexString.substr(offset,length);
};

/**
 * Add a translate method to the RSAKey class.
 */
RSAKey.prototype.parseKey = function(pem) {
  try{
    var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
    var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
    var asn1 = ASN1.decode(der);
    if (asn1.sub.length === 9){
        //Private key   
        //Algorithm version, n, e, d, p, q, dmp1, dmq1, coeff
        //Alg version, modulus, public exponent, private exponent, prime 1, prime 2, exponent 1, exponent 2, coefficient
        var modulus = asn1.sub[1].getHexStringValue(); //bigint
        this.n = parseBigInt(modulus, 16);
        
        var public_exponent = asn1.sub[2].getHexStringValue(); //int
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
        
    }else if (asn1.sub.length === 2){
      //Public key
      
      var bit_string = asn1.sub[1];
      var sequence   = bit_string.sub[0];
      
      var modulus = sequence.sub[0].getHexStringValue();
      this.n = parseBigInt(modulus, 16);
      var public_exponent = sequence.sub[1].getHexStringValue();
      this.e = parseInt(public_exponent, 16);
      
    }else{
      return false;
    }
    return true;
  }catch(ex){
    return false;
  }
};

RSAKey.prototype.getPrivateBaseKey = function() {
    //Algorithm version, n, e, d, p, q, dmp1, dmq1, coeff
    //Alg version, modulus, public exponent, private exponent, prime 1, prime 2, exponent 1, exponent 2, coefficient
    var options = {
        'array' : [
            new KJUR.asn1.DERInteger({'int'    : 0}),
            new KJUR.asn1.DERInteger({'bigint' : this.n}),
            new KJUR.asn1.DERInteger({'int'    : this.e}),
            new KJUR.asn1.DERInteger({'bigint' : this.d}),
            new KJUR.asn1.DERInteger({'bigint' : this.p}),
            new KJUR.asn1.DERInteger({'bigint' : this.q}),
            new KJUR.asn1.DERInteger({'bigint' : this.dmp1}),
            new KJUR.asn1.DERInteger({'bigint' : this.dmq1}),
            new KJUR.asn1.DERInteger({'bigint' : this.coeff})
        ]
    };
    var seq = new KJUR.asn1.DERSequence(options);
    return seq.getEncodedHex();
};

RSAKey.prototype.getPrivateBaseKeyB64 = function (){
    return hex2b64(this.getPrivateBaseKey());
};

RSAKey.prototype.getPublicBaseKey = function() {
    var options = {
        'array' : [
            new KJUR.asn1.DERObjectIdentifier({'oid':'1.2.840.113549.1.1.1'}), //RSA Encryption pkcs #1 oid
            new KJUR.asn1.DERNull()
        ]
    };
    var first_sequence = new KJUR.asn1.DERSequence(options);
    
    options = {
        'array' : [
            new KJUR.asn1.DERInteger({'bigint' : this.n}),
            new KJUR.asn1.DERInteger({'int' : this.e})
        ]
    };
    var second_sequence = new KJUR.asn1.DERSequence(options);
    
    options = {
        'hex' : '00'+second_sequence.getEncodedHex()
    };
    var bit_string = new KJUR.asn1.DERBitString(options);
    
    options = {
        'array' : [
            first_sequence,
            bit_string
        ]
    };
    var seq = new KJUR.asn1.DERSequence(options);
    return seq.getEncodedHex();
};

RSAKey.prototype.getPublicBaseKeyB64 = function (){
    return hex2b64(this.getPublicBaseKey());
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
};

// Return a new Private key.
RSAKey.prototype.getPrivateKey = function() {
  var key = "-----BEGIN RSA PRIVATE KEY-----\n";
  key += this.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
  key += "-----END RSA PRIVATE KEY-----";
  return key;
};

// Return a new Public key.
RSAKey.prototype.getPublicKey = function() {
  var key = "-----BEGIN PUBLIC KEY-----\n";
  key += this.wordwrap(this.getPublicBaseKeyB64()) + "\n";
  key += "-----END PUBLIC KEY-----";
  return key;
};

RSAKey.prototype.hasPublicKeyProperty = function(obj){
    obj = obj || {};
    return obj.hasOwnProperty('n') &&
           obj.hasOwnProperty('e');
};

RSAKey.prototype.hasPrivateKeyProperty = function(obj){
    obj = obj || {};
    return obj.hasOwnProperty('n') &&
           obj.hasOwnProperty('e') &&
           obj.hasOwnProperty('d') &&
           obj.hasOwnProperty('p') &&
           obj.hasOwnProperty('q') &&
           obj.hasOwnProperty('dmp1') &&
           obj.hasOwnProperty('dmq1') &&
           obj.hasOwnProperty('coeff');
};

RSAKey.prototype.parsePropertiesFrom = function(obj){
    this.n = obj.n;
    this.e = obj.e;        
    
    if (obj.hasOwnProperty('d')){
        this.d = obj.d;
        this.p = obj.p;
        this.q = obj.q;
        this.dmp1 = obj.dmp1;
        this.dmq1 = obj.dmq1;
        this.coeff = obj.coeff;
    }
};

/**
 * Create a public key class to extend the RSAKey.
 *
 * @param string key - The key in string format, or RSAKey object.
 */
var JSEncryptRSAKey = function(key) {

  // Call the constructor.
  RSAKey.call(this);
  
  // If a key key was provided.
  if (key) {
    // If this is a string...
    if (typeof key === 'string') {
      this.parseKey(key);
    }else if (this.hasPrivateKeyProperty(key)||this.hasPublicKeyProperty(key)) {
      // Set the values for the key.
      this.parsePropertiesFrom(key);
    }
  }
};

// Derive from RSAKey.
JSEncryptRSAKey.prototype = new RSAKey();

// Reset the contructor.
JSEncryptRSAKey.prototype.constructor = JSEncryptRSAKey;

/**
 * Class to do the encryption.
 */
var JSEncrypt = function(options) {
  options = options || {};
  this.default_key_size = options.default_key_size || 1024;
  this.default_public_exponent = options.default_public_exponent || '010001'; //65537 default openssl public exponent for rsa key type
  // The private and public key.
  this.key = null;
};

JSEncrypt.prototype.setKey = function(key){
    if (this.key)
        console.warn('A key was already set, overriding existing.');
    this.key = new JSEncryptRSAKey(key);
};

/**
 * Set the private key.
 */
JSEncrypt.prototype.setPrivateKey = function(privkey) {
  // Create the key.
  this.setKey(privkey);
};

/**
 * Set the public key.
 */
JSEncrypt.prototype.setPublicKey = function(pubkey) {
  // Sets the public key.
  this.setKey(pubkey);
};

/**
 * Decryption method to take a private PEM string and decrypt text.
 */
JSEncrypt.prototype.decrypt = function(string) {
  // Return the decrypted string.
  return this.getKey().decrypt(b64tohex(string));
};

/**
 * Encrypttion method to take a public PEM string and encrypt text.
 */
JSEncrypt.prototype.encrypt = function(string) {
  // Return the encrypted string.
  return hex2b64(this.getKey().encrypt(string));
};

JSEncrypt.prototype.getKey = function(){
  // Only create new if it does not exist.
  if (!this.key) {
    // Get a new private key.
    this.key = new JSEncryptRSAKey();
    // Generate the key.
    this.key.generate(this.default_key_size, this.default_public_exponent);
  }
  return this.key;
};

/**
 * Return the private key, or a generated one if it doesn't exist.
 */
JSEncrypt.prototype.getPrivateKey = function() {
  // Return the private representation of this key.
  return this.getKey().getPrivateKey();
};

/**
 * Return the public key, or a generated one if it doesn't exist.
 */
JSEncrypt.prototype.getPublicKey = function() {
  // Return the private representation of this key.
  return this.getKey().getPublicKey();
};