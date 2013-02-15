
RSA Private Key and Public Key translation
==========================================

The jsbn library was written using the variables to perform encryption.
However, most private keys use a Private Key in the PEM format seen below.

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

