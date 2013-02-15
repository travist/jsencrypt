Introduction
======================
When browsing the internet looking for a good solution to RSA Javascript
encryption, there is a whole slew of libraries that basically take the fantastic
work done by Tom Wu @ http://www-cs-students.stanford.edu/~tjw/jsbn/ and then
modify that code to do what they want.

What I couldn't find, however, was a simple wrapper around this library that
basically uses the library UNTOUCHED, but adds a wrapper to provide parsing of
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


```
<script src="bin/jsencrypt.min.js"></script>
<script type="text/javascript">
  // Create the JSEncrypt object.
  var crypt = new JSEncrypt();

  // Encrypt some text.
  var crypted = crypt.encrypt(private_key, 'Hello There');

  // Decrypt that text.
  var uncrypted = crypt.encrypt(public_key, crypted);
</script>
```

 - Look at how index.html works to get a better idea.

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

