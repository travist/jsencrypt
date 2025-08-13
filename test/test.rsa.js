import { JSEncrypt } from "../lib/JSEncrypt";
import chai from "chai";
import dirtyChai from "dirty-chai";
import { JSEncryptRSAKey } from "../lib/JSEncryptRSAKey";
import { KJUR, extendClass } from "../lib/lib/jsrsasign/asn1-1.0";
import { parseBigInt } from "../lib/lib/jsbn/jsbn";

chai.use(dirtyChai);

var expect = chai.expect;

var keySizes = [128, 256, 512, 1024, 2048];

// pbKeyObject for RSA public key pbkeys[2]:
// -----BEGIN PUBLIC KEY-----
// MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKEpu21RDTXxEly55HdkVV9SlFL3Hgpl
// i6+IohAsnaqFnApsKi1R7fAd3tBLmeHV2tlxYIogtxpzfpcc+QBVDx8CAwEAAQ==
// -----END PUBLIC KEY-----
var pbKeyObject = {
    n: parseBigInt(
        "8440792054978758064869897516311406885364968765682484036772649496770016298874677916537637858819623046743693275780499081114467575196675260735321172503498527",
        16,
    ),
    e: parseInt("65537", 16),
};

// prKeyObject for RSA private key prkeys[2]:
// -----BEGIN RSA PRIVATE KEY-----
// MIIBOQIBAAJBAKEpu21RDTXxEly55HdkVV9SlFL3Hgpli6+IohAsnaqFnApsKi1R
// 7fAd3tBLmeHV2tlxYIogtxpzfpcc+QBVDx8CAwEAAQJAFn0VS07JEiLelhPWfpaA
// lzmVuvICvh6nXEormygupBGiIPSXfIsTFid26yxt9wu4JHeRF0lq+Ozo55XpBQED
// 4QIhAM0E7ikuEa2bDsR2hQJhIz3SvzzyhE5dJcqFjRtKtMQvAiEAyT0C0gUyqCdN
// YuRON1T7FUffarMdQXR+8tgRkhoCeBECID+ZKfAoVF+QXDJhub0VOQNyntRfPt+4
// UYLTjwRKVm0NAiBuOCtuSoiHTxd0naU1aycmbboxn67bZeoOKkfdZL+LcQIgK6Xh
// 1wb9I/sNYv9ByJEGBNJRwtUEZrk5babLEdkUq90=
// -----END RSA PRIVATE KEY-----
var prKeyObject = {
    n: parseBigInt(
        "8440792054978758064869897516311406885364968765682484036772649496770016298874677916537637858819623046743693275780499081114467575196675260735321172503498527",
        16,
    ),
    e: parseInt("65537", 16),
    d: parseBigInt(
        "1177823875715713909749228875088390008188697062150637296737505220683915941425564934349491530018433333961844817179868275593577546013764062491594491380696033",
        16,
    ),
    p: parseBigInt(
        "92732845073668710445924195001235079654522118761730560062285200509259817993263",
        16,
    ),
    q: parseBigInt(
        "91022679701816919667509879755596357812609561447601541582317961096419889805329",
        16,
    ),
    dmp1: parseBigInt(
        "28766326507891494626938048497415340485167686565237686895437052754219022839053",
        16,
    ),
    dmq1: parseBigInt(
        "49853656528323211795859852202986576493944187377537228361037325687107922922353",
        16,
    ),
    coeff: parseBigInt(
        "19742540944821459160648146809005642401823159477711103628233753789734220770269",
        16,
    ),
};

var pbkeys = [
    "-----BEGIN PUBLIC KEY-----\n" +
        "MCwwDQYJKoZIhvcNAQEBBQADGwAwGAIRAMfE82X6tlpNK7Bxbhg6nEECAwEAAQ==\n" +
        "-----END PUBLIC KEY-----",
    "-----BEGIN PUBLIC KEY-----\n" +
        "MDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAMLw0mRGv5KF+P0LsgNvfrM5AJdVBWqr\n" +
        "Q6Bf2gES5gwPAgMBAAE=\n" +
        "-----END PUBLIC KEY-----",
    "-----BEGIN PUBLIC KEY-----\n" +
        "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKEpu21RDTXxEly55HdkVV9SlFL3Hgpl\n" +
        "i6+IohAsnaqFnApsKi1R7fAd3tBLmeHV2tlxYIogtxpzfpcc+QBVDx8CAwEAAQ==\n" +
        "-----END PUBLIC KEY-----",
    "-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC5LO5xVlO9g4PL1xdWudnihIAP\n" +
        "bMsixr396bIbBIwKBul98UWQ3UALbqByq2bXVuoIbl48UokxOVstenGCyyo026NF\n" +
        "h3Fg6Cnvj9ptvbmqk2i3eTOBrt+e26Z1sepsnQL5OojiVIbrWwS6v1pFCXpnnLLv\n" +
        "yy6GPt/kftbhazH3oQIDAQAB\n" +
        "-----END PUBLIC KEY-----",
    "-----BEGIN PUBLIC KEY-----\n" +
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtKrsFSnzYl19m5wTwYdu\n" +
        "/r1UVZJV+zkAFud6+XTInAy8HbCR9n59H9+54P+Af/fUE6rvEPc4H09Z63vQzIGM\n" +
        "iL6GlqzMmptv/KRDIhj7Mk3MXomvEVfUsXrz5IpO0lf6NSeGhz4PGZUkHZ30VRx3\n" +
        "Jd/a0KIhgftZHxzmMsh8iB/n781B18pCP2eOPTF+5gRCaW+0fVPBlb/mBlg8MJrd\n" +
        "ScGCAReQ9NfTq8slJ0aO1NWaaRRANPQcCMljnTIK1ssyXBaSHKfoWeGx141mWMRx\n" +
        "/LxyZ13Zc3lqgmICiKFqMrQl5UeV1IUXYpj5hO9f60LGpZVHDqqo/JdF3+VAheaf\n" +
        "QwIDAQAB\n" +
        "-----END PUBLIC KEY-----",
];

var prkeys = [
    "-----BEGIN RSA PRIVATE KEY-----\n" +
        "MGMCAQACEQDHxPNl+rZaTSuwcW4YOpxBAgMBAAECEQCqk6mhsmpyv17fK1dPeD3h\n" +
        "AgkA9Lo1aGRom0sCCQDQ+JpqE6KDIwIJAKstyIfBnA3rAggOsWwqCTdkAQIIOP95\n" +
        "RV9y2iQ=\n" +
        "-----END RSA PRIVATE KEY-----\n",
    "-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIGqAgEAAiEAwvDSZEa/koX4/QuyA29+szkAl1UFaqtDoF/aARLmDA8CAwEAAQIh\n" +
        "AME2Z5Ez/hR/7PUBboKxM2U7hSaavytvocBdQjLvOUWhAhEA8HgiLHRk9KjJ2hp0\n" +
        "5q3BfQIRAM+H7dYUXRnKXjYoqiKueXsCEGnaaCirf/lXB6vzs3wMBr0CEHT2Xwzw\n" +
        "nSgT7dUIRhsVylECEFQRGFtZcKRmL8lqTBwECWI=\n" +
        "-----END RSA PRIVATE KEY-----\n",
    "-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIIBOQIBAAJBAKEpu21RDTXxEly55HdkVV9SlFL3Hgpli6+IohAsnaqFnApsKi1R\n" +
        "7fAd3tBLmeHV2tlxYIogtxpzfpcc+QBVDx8CAwEAAQJAFn0VS07JEiLelhPWfpaA\n" +
        "lzmVuvICvh6nXEormygupBGiIPSXfIsTFid26yxt9wu4JHeRF0lq+Ozo55XpBQED\n" +
        "4QIhAM0E7ikuEa2bDsR2hQJhIz3SvzzyhE5dJcqFjRtKtMQvAiEAyT0C0gUyqCdN\n" +
        "YuRON1T7FUffarMdQXR+8tgRkhoCeBECID+ZKfAoVF+QXDJhub0VOQNyntRfPt+4\n" +
        "UYLTjwRKVm0NAiBuOCtuSoiHTxd0naU1aycmbboxn67bZeoOKkfdZL+LcQIgK6Xh\n" +
        "1wb9I/sNYv9ByJEGBNJRwtUEZrk5babLEdkUq90=\n" +
        "-----END RSA PRIVATE KEY-----\n",
    "-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIICXgIBAAKBgQC5LO5xVlO9g4PL1xdWudnihIAPbMsixr396bIbBIwKBul98UWQ\n" +
        "3UALbqByq2bXVuoIbl48UokxOVstenGCyyo026NFh3Fg6Cnvj9ptvbmqk2i3eTOB\n" +
        "rt+e26Z1sepsnQL5OojiVIbrWwS6v1pFCXpnnLLvyy6GPt/kftbhazH3oQIDAQAB\n" +
        "AoGAA+EiGbPCS10e/L1D2uhH3UwDVs9jrhXV0yT7Oz+sI2WjrKTKXU+VUOf/aoeW\n" +
        "vvouKwEM7lyYTTSzaU+AY0oYVzv7HN9hWoVwi0NoPpd4V1RFfFb4+4DmXh+NZS7E\n" +
        "DX9+WY435Yc9Qj7uHoc8EoRk3QfWaZTXd69b/9tS4Yy/tnECQQDxHsSe7Qxd+6tf\n" +
        "/f4eO+bENCxIMbPU8GPWQCvq9eT9Av2I0LTTchmlhG1TSatq62zq+Unef8M/IOBs\n" +
        "j5z3issdAkEAxJpYiuAVXulViUOLdS3QX72owIQLxpFBAKQ9cPTafqc47ms4Swy2\n" +
        "FCa4MZfTJXrDX5pur+PNeP/ce6xZN5DzVQJBAJI1kgy8uU8UGKswnTNAJ4K6EFAG\n" +
        "s4Ff82orp3XmfWBeu9aGl9/PxHV1g8WJWoSPFZC2cXCWEJLrIKszun7wjpECQQCs\n" +
        "Z+mjh1RWUepHn+rozE9B1jDo+iLVc8V8CYszxhThIkWjlnTcI358d2PpYYmxAVHZ\n" +
        "QbU1G2CxbjZsYbwvJTatAkEAspmMlIyKWgrQkLJ4rbPespMJCGe6VYharl1Qc5CF\n" +
        "/2SgKSCuLfhA/Cur0nO3dxt6XJijk/r3+j+8L/m+wqud+A==\n" +
        "-----END RSA PRIVATE KEY-----\n",
    "-----BEGIN RSA PRIVATE KEY-----\n" +
        "MIIEpAIBAAKCAQEAtKrsFSnzYl19m5wTwYdu/r1UVZJV+zkAFud6+XTInAy8HbCR\n" +
        "9n59H9+54P+Af/fUE6rvEPc4H09Z63vQzIGMiL6GlqzMmptv/KRDIhj7Mk3MXomv\n" +
        "EVfUsXrz5IpO0lf6NSeGhz4PGZUkHZ30VRx3Jd/a0KIhgftZHxzmMsh8iB/n781B\n" +
        "18pCP2eOPTF+5gRCaW+0fVPBlb/mBlg8MJrdScGCAReQ9NfTq8slJ0aO1NWaaRRA\n" +
        "NPQcCMljnTIK1ssyXBaSHKfoWeGx141mWMRx/LxyZ13Zc3lqgmICiKFqMrQl5UeV\n" +
        "1IUXYpj5hO9f60LGpZVHDqqo/JdF3+VAheafQwIDAQABAoIBAQCS/++PWM7bXk5x\n" +
        "apD4ioXZZ5tS9PpYqoxUFoyMpGUF86asUZqyAUE1ygen9rxLYw5/4jkaiMx1TU9Q\n" +
        "tzGw9Eewi7Veq8LemVKJMe4dtE3PJFYBJe34IorAzdXcQlzX8RV4YmynZetLWXpF\n" +
        "Ttwa1Ept2rJjx0eURzrAgfcbot0Qs+c8bB0qnGC67PoL3DyYg8vX5PDmiiA2VZMG\n" +
        "EylVQS09toJn5ReaKCtjxJb/XFQjBeSP0xLjvZZftGDJgpwmmi7Sy/zAZoF4+7wf\n" +
        "8nihXk4ZfYC+beBj5U9pcUcs6LdNobUofWFRLSjueseRQBI0sKUslr3Ye4zhkrWM\n" +
        "CDnsSxBhAoGBANi0spS/Mc6xH1189mR7dJV9gy7KkGxheAstwCJr7WzbXqglhFm2\n" +
        "SvY9hrpE9OYWir5EqX6jM6VipSobTn0RpCsYUC/J1ISMyEA5UkPLP4jHQw6UUDN2\n" +
        "1fNAXffEyuju5ShP9Mk2unZstlUweKlFF7d1k7YAzWDIKnF6bOL06YC9AoGBANVt\n" +
        "XM4OH0zw8M97W04WwYGoa5s1Y5JYc4RMV200cr3iONVfLZgSP8thP1qPuoMM3OJg\n" +
        "Bqe6MRmo/VXhgVvpke04ZJ83LSz/SoqfVRNwxuCHqp3beJQPxrAp1d/L7Ey7f41U\n" +
        "QBE8pibFb8bbgOTUW5iyZbg7lLS8nghsn+BqYp//AoGBAJO/574o+YGOG+92wttR\n" +
        "nPRLhgSCEaQDdIBSqhwN7+v3SXtlUO6FrmhjHJelaj/yAJinYdS42v6Y2jlyMrpt\n" +
        "K7xCMHHUrzPMdL/tFRyp1+Ce0yZ+kov0Kv1V1nuWzi2wq8cndKM30Dvr9QjyKmJm\n" +
        "fDwWSyadN2oUL3P9X34CM64VAoGAbajAW1skN/tAL8r48dl9WWo4x8mZvJLX36z9\n" +
        "6q1dGzVF8FPz8EPIJW51B8n7keQlBedC5CElo0KRz/OK7LfI87La+Hd4LbuKCEmv\n" +
        "g8qZVLpALtWaUbD9bHxCWLfFVPOtqOcV+AVKdXdSZEFaK7j0yzM2Un/Ce07CgB+X\n" +
        "0c23mO8CgYAOqnUR/uPIzkvj/eIbO7pnhHoKZ4Ji2TrIBqjskzaFd0Tox9i3SWKa\n" +
        "cRdQciRIT1wkMdywnHFrJT1rwYXxcgfQXAku/vnYqAfvIzY7TyoL3pWX55O0Zrs7\n" +
        "05R9mA5TZmzUU9m/PzUrRjasOGYSKkCz4Y2qGlrKI3H0aE+p+R56kQ==\n" +
        "-----END RSA PRIVATE KEY-----\n",
];

const pkcs1pbkey =
    "-----BEGIN RSA PUBLIC KEY-----\n" +
    "MIGJAoGBALEylyQ/kf6bhtC5KG8q2B8GKOcl61f78xup8IgRIPjZbArbC8fpb4R6\n" +
    "rkkWhXXv38G4rJVHYH6VIHxkJNdeLlJu0Ttrusuk/zQ+W8rN3Izl45gCQ9ep+06f\n" +
    "tSTEmD2DCs8jzg4AR3tBe6LiSYCP5YN4LxCn+peajm7VAQZucGM7AgMBAAE=\n" +
    "-----END RSA PUBLIC KEY-----\n";

keySizes.forEach(function (keySize, index) {
    var jse = new JSEncrypt({ default_key_size: keySize });
    var openssl_public_key = pbkeys[index];
    var openssl_private_key = prkeys[index];

    describe("JSEncrypt - " + keySize + " bit", function () {
        //this.timeout(0); //Timout for test cases, zero means infinite. Needed for key sizes > 1024

        describe("#getKey()", function () {
            it("should be instance of JSEncryptRSAKey", function () {
                var key = jse.getKey();
                expect(key).to.instanceOf(JSEncryptRSAKey);
            });
            it("should be " + keySize + " bit long", function () {
                var key = jse.getKey();
                var length = key.n.bitLength();
                length = length % 2 === 0 ? length : length + 1;
                expect(length).to.equal(keySize);
            });
        });

        describe("#getKey() async", function (done) {
            it("should be " + keySize + " bit long", function () {
                jse.getKey(function () {
                    var key = jse.getKey();
                    var length = key.n.bitLength();
                    length = length % 2 === 0 ? length : length + 1;
                    expect(length).to.equal(keySize);

                    done();
                });
            });
        });

        describe("#encrypt() | #decrypt()", function () {
            //Tom Wu's RSA Object use paddingpkcs #1, type 2
            var maxLength = ((jse.getKey().n.bitLength() + 7) >> 3) - 11;
            var maxLengthBit = maxLength << 3;

            it("should encrypt/decrypt up to " + maxLengthBit + " bit", function () {
                var test = [];
                for (var i = 0; i < maxLength; i++) test.push("a");
                test = test.join("");

                var encrypted = jse.encrypt(test);
                expect(encrypted).to.be.ok();

                var decrypted = jse.decrypt(encrypted);
                expect(decrypted).to.be.equal(test);
            });

            it("should fail to encrypt more than " + maxLengthBit + " bit", function () {
                var test = [];
                for (var i = 0; i < maxLength + 1; i++) test.push("a");
                test = test.join("");

                var encrypted = jse.encrypt(test);
                expect(encrypted).to.not.be.ok();
            });
        });

        describe("#sign() | #verify()", function () {
            var maxLength = ((jse.getKey().n.bitLength() + 7) >> 3) - 11;
            var maxLengthBit = maxLength << 3;

            it("should sign/verify up to " + maxLengthBit + " bit", function () {
                var digest = function (data) {
                    return data;
                };

                var test = [];
                for (var i = 0; i < maxLength; i++) test.push("a");
                test = test.join("");

                var signature = jse.sign(test, digest, "");
                expect(signature).to.be.ok();

                var verified = jse.verify(test, signature, digest);
                expect(verified).to.be.equal(true);

                var failed = jse.verify("no", signature, digest);
                expect(failed).to.be.equal(false);
            });

            it("should fail to verify more than " + maxLengthBit + " bit", function () {
                // Create a message that's definitely too long for RSA signing with raw digest
                // A 10KB message should exceed any reasonable RSA padding constraints
                var test = "a".repeat(10000);

                var signature = jse.sign(test);
                expect(signature).to.not.be.ok();
            });
        });

        describe("#getPublicKey()", function () {
            var pkey = jse.getPublicKey();

            it("should be a non-empty string", function () {
                expect(pkey).to.be.a("string");
                expect(pkey).to.not.be.empty();
            });

            it("should contain public header and footer and be wrapped at 64 chars", function () {
                //For small bit keys, the public key may contain only one line
                var regex =
                    /-----BEGIN PUBLIC KEY-----\n((.{64}\n)+(.{1,64}\n)?)|(.{1,64}\n)-----END PUBLIC KEY-----/;
                expect(pkey).to.match(regex);
            });
        });

        describe("#getPrivateKey()", function () {
            var pkey = jse.getPrivateKey();

            it("should be a non-empty string", function () {
                expect(pkey).to.be.a("string");
                expect(pkey).to.not.be.empty();
            });

            it("should contain private header and footer and be wrapped at 64 chars", function () {
                var regex =
                    /-----BEGIN RSA PRIVATE KEY-----\n(.{64}\n)+(.{1,64}\n)?-----END RSA PRIVATE KEY-----/;
                expect(pkey).to.match(regex);
            });
        });

        describe("#getPublicKeyB64()", function () {
            var pkey = jse.getPublicKeyB64();

            it("should be a non-empty string", function () {
                expect(pkey).to.be.a("string");
                expect(pkey).to.not.be.empty();
            });

            it("should not contain public header and footer,one line, base64 encoded", function () {
                //regex to match base64 encoded string, reference:
                //http://stackoverflow.com/a/5885097/1446321
                var regex =
                    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
                expect(pkey).to.match(regex);
            });
        });

        describe("#getPrivateKeyB64()", function () {
            var pkey = jse.getPrivateKeyB64();

            it("should be a non-empty string", function () {
                expect(pkey).to.be.a("string");
                expect(pkey).to.not.be.empty();
            });

            it("should not contain private header and footer,one line, base64 encoded", function () {
                //regex to match base64 encoded string, reference:
                //http://stackoverflow.com/a/5885097/1446321
                var regex =
                    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
                expect(pkey).to.match(regex);
            });
        });

        describe("#setPrivateKey()", function () {
            var tmp = new JSEncrypt();
            tmp.setPrivateKey(openssl_private_key);

            it("should correctly set the private key parameters", function () {
                var params = ["n", "e", "d", "p", "q", "dmp1", "dmq1", "coeff"];
                expect(tmp.key).to.be.ok();
                expect(tmp.key).to.have.keys(params);
                params.forEach(function (value, index) {
                    expect(tmp.key[value]).to.be.ok();
                });
            });

            it("should both encrypt and decrypt", function () {
                var test = "test";
                var enc = tmp.encrypt(test);
                expect(enc).to.be.ok();
                var dec = tmp.decrypt(enc);
                expect(dec).to.be.equal(test);
            });
        });

        describe("#setPublicKey() X509 format", function () {
            var tmp = new JSEncrypt();
            tmp.setPublicKey(openssl_public_key);

            it("should correctly set the public key parameters", function () {
                var pub_params = ["n", "e"];
                var priv_params = ["d", "p", "q", "dmp1", "dmq1", "coeff"];
                expect(tmp.key).to.be.ok();
                expect(tmp.key).to.include.all.keys(pub_params);
                pub_params.forEach(function (value, index) {
                    expect(tmp.key[value]).to.be.ok();
                });
                priv_params.forEach(function (value, index) {
                    expect(tmp.key[value]).to.not.be.ok();
                });
            });

            it("should only encrypt", function () {
                var test = "test";
                var enc = tmp.encrypt(test);
                var dec = tmp.decrypt(enc);
                expect(enc).to.be.ok();
                expect(dec).to.not.be.ok();
            });
        });
    });
});

describe("JSEncrypt - 1024 bit", function () {
    describe("#setPublicKey() PKCS #1 format", function () {
        var tmp = new JSEncrypt();
        tmp.setPublicKey(pkcs1pbkey);

        it("should correctly set the public key parameters", function () {
            var pub_params = ["n", "e"];
            var priv_params = ["d", "p", "q", "dmp1", "dmq1", "coeff"];
            expect(tmp.key).to.be.ok();
            expect(tmp.key).to.include.all.keys(pub_params);
            pub_params.forEach(function (value, index) {
                expect(tmp.key[value]).to.be.ok();
            });
            priv_params.forEach(function (value, index) {
                expect(tmp.key[value]).to.not.be.ok();
            });
        });

        it("should only encrypt", function () {
            var test = "test";
            var enc = tmp.encrypt(test);
            var dec = tmp.decrypt(enc);
            expect(enc).to.be.ok();
            expect(dec).to.not.be.ok();
        });
    });
});

describe("#extendClass()", function () {
    var Animal = function () {
        this.hello = function () {
            console.log("Hello");
        };
        this.name = "Ani";
    };
    var Dog = function () {
        Dog.superclass.constructor.call(this);
        this.vow = function () {
            console.log("Vow wow");
        };
        this.tail = true;
    };
    extendClass(Dog, Animal);
    var childObject = new Dog();
    var parentObject = new Animal();

    it("object of child should be instance of parent", function () {
        expect(childObject).to.be.instanceOf(Animal);
    });

    it("object of child should have all keys of parent", function () {
        Object.keys(parentObject).forEach((key) => {
            expect(childObject[key]).to.be.ok();
        });
    });
});

describe("KJUR", function () {
    it("KJUR.asn1.DERAbstractString should be instance of KJUR.asn1.ASN1Object", function () {
        expect(new KJUR.asn1.DERAbstractString()).to.be.instanceOf(KJUR.asn1.ASN1Object);
    });

    it("KJUR.asn1.DERAbstractTime should be instance of KJUR.asn1.ASN1Object", function () {
        expect(new KJUR.asn1.DERAbstractTime()).to.be.instanceOf(KJUR.asn1.ASN1Object);
    });

    it("KJUR.asn1.DERAbstractStructured should be instance of KJUR.asn1.ASN1Object", function () {
        expect(new KJUR.asn1.DERAbstractStructured()).to.be.instanceOf(
            KJUR.asn1.ASN1Object,
        );
    });

    it("KJUR.asn1.DERAbstractStructDERBooleanured should be instance of KJUR.asn1.ASN1Object", function () {
        expect(new KJUR.asn1.DERBoolean()).to.be.instanceOf(KJUR.asn1.ASN1Object);
    });

    it("KJUR.asn1.DERInteger should be instance of KJUR.asn1.ASN1Object", function () {
        expect(new KJUR.asn1.DERInteger()).to.be.instanceOf(KJUR.asn1.ASN1Object);
    });

    it("KJUR.asn1.DERUTF8String should be instance of KJUR.asn1.DERAbstractString", function () {
        expect(new KJUR.asn1.DERUTF8String()).to.be.instanceOf(
            KJUR.asn1.DERAbstractString,
        );
    });

    it("KJUR.asn1.DERNumericString should be instance of KJUR.asn1.DERAbstractString", function () {
        expect(new KJUR.asn1.DERNumericString()).to.be.instanceOf(
            KJUR.asn1.DERAbstractString,
        );
    });

    it("KJUR.asn1.DERUTCTime should be instance of KJUR.asn1.DERAbstractTime", function () {
        expect(new KJUR.asn1.DERUTCTime()).to.be.instanceOf(KJUR.asn1.DERAbstractTime);
    });

    it("KJUR.asn1.DERSet should be instance of KJUR.asn1.DERAbstractStructured", function () {
        expect(new KJUR.asn1.DERSet()).to.be.instanceOf(KJUR.asn1.DERAbstractStructured);
    });
});

describe("JSEncrypt setKey Method", function () {
    let jse;
    let originalConsoleWarn;
    let originalConsoleError;

    beforeEach(() => {
        jse = new JSEncrypt();
        jse.log = true;

        originalConsoleWarn = console.warn;
        originalConsoleError = console.error;
    });

    afterEach(() => {
        console.warn = originalConsoleWarn;
        console.error = originalConsoleError;
    });

    describe("#setKey()", function () {
        it("should set the key correctly when a valid key is provided", function () {
            jse.setKey(pbkeys[0]);
            expect(jse.key).to.be.ok;
        });

        it("should log a warning if overriding an existing key", function () {
            let warningMessage;
            console.warn = (message) => {
                warningMessage = message;
            };

            jse.setKey(pbkeys[0]);
            jse.setKey(pbkeys[1]);

            expect(warningMessage).to.equal(
                "A key was already set, overriding existing.",
            );
        });

        it("should not log a warning if no key is provided", function () {
            let warningCalled = false;
            console.warn = () => {
                warningCalled = true;
            };

            jse.setKey();

            expect(warningCalled).to.be.false;
        });

        it("should override existing key and log a warning", function () {
            const key1 = pbkeys[0];
            const key2 = pbkeys[1];

            jse.setKey(key1);

            let warningMessage;
            console.warn = (message) => {
                warningMessage = message;
            };

            jse.setKey(key2);

            expect(jse.getKey()).to.be.ok;
            expect(warningMessage).to.equal(
                "A key was already set, overriding existing.",
            );
        });

        it("should log an error if no key is set and log is true", function () {
            let errorMessage;
            console.error = (message) => {
                errorMessage = message;
            };

            jse.setKey(null);

            expect(jse.getKey()).to.be.undefined;
            expect(errorMessage).to.equal("A key was not set.");
        });

        it("should not log an error if log is false", function () {
            jse.log = false;

            let errorMessage;
            console.error = (message) => {
                errorMessage = message;
            };

            jse.setKey(undefined);

            expect(jse.getKey()).to.be.undefined;
            expect(errorMessage).to.be.undefined;
        });

        it("should not log an error if key is already set", function () {
            jse.setKey(pbkeys[0]);

            let errorMessage;
            console.error = (message) => {
                errorMessage = message;
            };

            jse.setKey(undefined);

            expect(jse.getKey()).to.equal(jse.key);
            expect(errorMessage).to.be.undefined;
        });

        it("should create a key object with correct n and e values when a valid public key parameters are provided", function () {
            jse.setKey(pbKeyObject);
            const key = jse.getKey();

            expect(key.n).to.deep.equal(pbKeyObject.n);
            expect(key.e).to.equal(pbKeyObject.e);
        });

        it("should create a key object with correct n, e, and d values when a valid private key parameters are provided", function () {
            jse.setKey(prKeyObject);
            const key = jse.getKey();

            expect(key.n).to.deep.equal(prKeyObject.n);
            expect(key.e).to.equal(prKeyObject.e);
            expect(key.d).to.equal(prKeyObject.d);
        });
    });
});

describe("JSEncrypt", function () {
    describe("#constructor()", function () {
        it("should set the key correctly when provided in options", function () {
            const key = new JSEncryptRSAKey(prKeyObject);
            const jse = new JSEncrypt({ key: key });
            expect(jse.getKey()).to.equal(key);
        });

        it("should default the key to null when not provided", function () {
            const jse = new JSEncrypt();
            expect(jse.getKey()).to.be.null;
        });

        it("should set the key to null when explicitly passed as null", function () {
            const jse = new JSEncrypt({ key: null });
            expect(jse.getKey()).to.be.null;
        });
    });
});
