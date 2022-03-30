var fs = require('fs');
var assert = require('assert');
var JSEncrypt = require('../../bin/jsencrypt');

var pubkey = fs.readFileSync(__dirname + '/assets/rsa_1024_pub.pem', 'utf8');
var privkey = fs.readFileSync(__dirname + '/assets/rsa_1024_priv.pem', 'utf8');

describe('algorithm: rsa', () => {
  it('public key encrypted / private key decrypted', () => {
    var client = new JSEncrypt();
    // client.setPublicKey(pubkey);

    // var server = new JSEncrypt();
    // server.setPrivateKey(privkey);

    var message = 'hello world';

    // var encrypted = client.encrypt(message);
    // var decrypted = server.decrypt(encrypted);

    // assert.equal(decrypted, message);
  });
});
