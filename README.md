Website
======================
http://travistidwell.com/jsencrypt

Introduction
======================
When browsing the internet looking for a good solution to RSA Javascript
encryption, there is a whole slew of libraries that basically take the fantastic
work done by Tom Wu @ http://www-cs-students.stanford.edu/~tjw/jsbn/ and then
modify that code to do what they want.

What I couldn't find, however, was a simple wrapper around this library that
basically uses the library <a href="https://github.com/travist/jsencrypt/pull/6">practically</a> untouched, but adds a wrapper to provide parsing of
actual Private and Public key-pairs generated with OpenSSL.

This library is the result of these efforts.

How to use this library.
=======================
This library should work hand-in-hand with openssl.  With that said, here is how to use this library.

 - Within your terminal (Unix based OS) type the following.

```
openssl genrsa -out rsa_1024_priv.pem 1024
```

 - This generates a private key, which you can see by doing the following...

```
cat rsa_1024_priv.pem
```

 - You can then copy and paste this in the Private Key section of within index.html.
 - Next, you can then get the public key by executing the following command.

```
openssl rsa -pubout -in rsa_1024_priv.pem -out rsa_1024_pub.pem
```

 - You can see the public key by typing...

```
cat rsa_1024_pub.pem
```

 - Now copy and paste this in the Public key within the index.html.
 - Now you can then convert to and from encrypted text by doing the following in code.


```html
<!doctype html>
<html>
  <head>
    <title>JavaScript RSA Encryption</title>
    <script src="http://code.jquery.com/jquery-1.8.3.min.js"></script>
    <script src="bin/jsencrypt.min.js"></script>
    <script type="text/javascript">

      // Call this code when the page is done loading.
      $(function() {

        // Run a quick encryption/decryption when they click.
        $('#testme').click(function() {

          // Encrypt with the public key...
          var encrypt = new JSEncrypt();
          encrypt.setPublicKey($('#pubkey').val());
          var encrypted = encrypt.encrypt($('#input').val());

          // Decrypt with the private key...
          var decrypt = new JSEncrypt();
          decrypt.setPrivateKey($('#privkey').val());
          var uncrypted = decrypt.decrypt(encrypted);

          // Now a simple check to see if the round-trip worked.
          if (uncrypted == $('#input').val()) {
            alert('It works!!!');
          }
          else {
            alert('Something went wrong....');
          }
        });
      });
    </script>
  </head>
  <body>
    <label for="privkey">Private Key</label><br/>
    <textarea id="privkey" rows="15" cols="65">-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
-----END RSA PRIVATE KEY-----</textarea><br/>
    <label for="pubkey">Public Key</label><br/>
    <textarea id="pubkey" rows="15" cols="65">-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----</textarea><br/>
    <label for="input">Text to encrypt:</label><br/>
    <textarea id="input" name="input" type="text" rows=4 cols=70>This is a test!</textarea><br/>
    <input id="testme" type="button" value="Test Me!!!" /><br/>
  </body>
</html>
```

 - Look at how http://www.travistidwell.com/jsencrypt/demo works to get a better idea.

 - Signing and verification works in a similar way.

```javascript
// Sign with the private key...
var sign = new JSEncrypt();
sign.setPrivateKey($('#privkey').val());
var signature = sign.sign($('#input').val(), CryptoJS.SHA256, "sha256");

// Verify with the public key...
var verify = new JSEncrypt();
verify.setPublicKey($('#pubkey').val());
var verified = verify.verify($('#input').val(), signature, CryptoJS.SHA256);

// Now a simple check to see if the round-trip worked.
if (verified) {
  alert('It works!!!');
}
else {
  alert('Something went wrong....');
}
```

- Note that you have to provide the hash function. In this example we use one from the [CryptoJS](https://github.com/brix/crypto-js) library, but you can use whichever you want.
- Also, unless you use a custom hash function, you should provide the hash type to the `sign` method. Possible values are: `md2`, `md5`, `sha1`, `sha224`, `sha256`, `sha384`, `sha512`, `ripemd160`.

Other Information
========================

This library heavily utilizes the wonderful work of Tom Wu found at http://www-cs-students.stanford.edu/~tjw/jsbn/.

This jsbn library was written using the raw variables to perform encryption.  This is great for encryption, but most private keys use a Private Key in the PEM format seen below.

1024 bit RSA Private Key in Base64 Format
-----------------------------------------
```
-----BEGIN RSA PRIVATE KEY-----
MIICXgIBAAKBgQDHikastc8+I81zCg/qWW8dMr8mqvXQ3qbPAmu0RjxoZVI47tvs
kYlFAXOf0sPrhO2nUuooJngnHV0639iTTEYG1vckNaW2R6U5QTdQ5Rq5u+uV3pMk
7w7Vs4n3urQ6jnqt2rTXbC1DNa/PFeAZatbf7ffBBy0IGO0zc128IshYcwIDAQAB
AoGBALTNl2JxTvq4SDW/3VH0fZkQXWH1MM10oeMbB2qO5beWb11FGaOO77nGKfWc
bYgfp5Ogrql4yhBvLAXnxH8bcqqwORtFhlyV68U1y4R+8WxDNh0aevxH8hRS/1X5
031DJm1JlU0E+vStiktN0tC3ebH5hE+1OxbIHSZ+WOWLYX7JAkEA5uigRgKp8ScG
auUijvdOLZIhHWq7y5Wz+nOHUuDw8P7wOTKU34QJAoWEe771p9Pf/GTA/kr0BQnP
QvWUDxGzJwJBAN05C6krwPeryFKrKtjOGJIniIoY72wRnoNcdEEs3HDRhf48YWFo
riRbZylzzzNFy/gmzT6XJQTfktGqq+FZD9UCQGIJaGrxHJgfmpDuAhMzGsUsYtTr
iRox0D1Iqa7dhE693t5aBG010OF6MLqdZA1CXrn5SRtuVVaCSLZEL/2J5UcCQQDA
d3MXucNnN4NPuS/L9HMYJWD7lPoosaORcgyK77bSSNgk+u9WSjbH1uYIAIPSffUZ
bti+jc1dUg5wb+aeZlgJAkEAurrpmpqj5vg087ZngKfFGR5rozDiTsK5DceTV97K
a3Y+Nzl+XWTxDBWk4YPh2ZlKv402hZEfWBYxUDn5ZkH/bw==
-----END RSA PRIVATE KEY-----
```

This library simply takes keys in the following format, and translates it to those variables needed to perform the encryptions used in Tom Wu's library.

Here are some good resources to investigate further.
 - http://etherhack.co.uk/asymmetric/docs/rsa_key_breakdown.html
 - http://www.di-mgt.com.au/rsa_alg.html
 - https://polarssl.org/kb/cryptography/asn1-key-structures-in-der-and-pem

With this information, we can translate a private key format to the variables
required with the jsbn library from Tom Wu by using the following mappings.

```
modulus => n
public exponent => e
private exponent => d
prime1 => p
prime2 => q
exponent1 => dmp1
exponent2 => dmq1
coefficient => coeff
```

