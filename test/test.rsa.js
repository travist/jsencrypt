import { JSEncrypt } from "../lib/JSEncrypt";
import chai from "chai";
import dirtyChai from "dirty-chai";

chai.use(dirtyChai);

var expect = chai.expect;

var keySizes = [128, 256, 512, 1024, 2048];

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

                var signature = jse.sign(test, digest);
                expect(signature).to.be.ok();

                var verified = jse.verify(test, signature, digest);
                expect(verified).to.be.equal(true);

                var failed = jse.verify("no", signature, digest);
                expect(failed).to.be.equal(false);
            });

            it("should fail to verify more than " + maxLengthBit + " bit", function () {
                var test = [];
                for (var i = 0; i < maxLength + 1; i++) test.push("a");
                test = test.join("");

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
