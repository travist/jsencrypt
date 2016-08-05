import {expect} from "./expect";
import {JSEncrypt} from "../src/jsencrypt";
var keySizes = [128, 256, 512, 1024];
var pbkeys = [
"-----BEGIN PUBLIC KEY-----\
MCwwDQYJKoZIhvcNAQEBBQADGwAwGAIRAMJYzPtURyEUNRX7j6bQhg8CAwEAAQ==\
-----END PUBLIC KEY-----",
"-----BEGIN PUBLIC KEY-----\
MDwwDQYJKoZIhvcNAQEBBQADKwAwKAIhAKqSOLiJmFJZ9VaqAWbUGQLPK1dzkMUM\
i/fTISSSdKxZAgMBAAE=\
-----END PUBLIC KEY-----",
"-----BEGIN PUBLIC KEY-----\
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOt7ZGR2Jb3aAe8xTWN/z9e5KL0MTn34\
gtCweIbnCc9BE+0z6WJVhnXRBgukdmB7iidrQInZDcDNxiZGFjI8ubMCAwEAAQ==\
-----END PUBLIC KEY-----",
"-----BEGIN PUBLIC KEY-----\
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCyuL7vgD69afw7jYLnJdbDPWr5\
BIlt8lmt9IfzjOYJ/YJkTrAuk/ZEEOvuPA4TVflOCuwJtT6oZlb8E8HOh82j5LVM\
XFDzkHpjzBfO9OaT66j7RPADdxRpsGUmk2pEHoLk/EXK0lTtsGv0i8OFDVSyxjuf\
SCUGerkpV/+uafgJqwIDAQAB\
-----END PUBLIC KEY-----"
];

var prkeys = [
"-----BEGIN RSA PRIVATE KEY-----\
MGQCAQACEQDCWMz7VEchFDUV+4+m0IYPAgMBAAECEBRARpPF02eZ0fSeC7z1P4EC\
CQDih/7h09mLQQIJANug/jPgzE1PAgkAxUrYa+pMT4ECCQCd460bin4VDQIJANdx\
V5Pdim/H\
-----END RSA PRIVATE KEY-----",
"-----BEGIN RSA PRIVATE KEY-----\
MIGqAgEAAiEAqpI4uImYUln1VqoBZtQZAs8rV3OQxQyL99MhJJJ0rFkCAwEAAQIg\
AMaNb3lgse8qyGwZeYg5XOIBGEstbBHGR4moDB7CfWkCEQDcWO73QkRCx4cgXyRo\
8itzAhEAxit+llKWGIBOZBSpkBKuAwIRAJwZdNE95NXaPGQ2grjGNvkCEBuQmT8X\
pcEqt7y8EwnzTzkCEEIIS4UUKS8ZDrxtOmYcgdA=\
-----END RSA PRIVATE KEY-----",
"-----BEGIN RSA PRIVATE KEY-----\
MIIBOgIBAAJBAOt7ZGR2Jb3aAe8xTWN/z9e5KL0MTn34gtCweIbnCc9BE+0z6WJV\
hnXRBgukdmB7iidrQInZDcDNxiZGFjI8ubMCAwEAAQJAONQmfjglE5QxM1BqpMCL\
oDwHINh/eNcoesSb0bKgI2vSpbehdxTfVZ6P+i+U1CVRy2xUryWBu5pyOotyEdtS\
QQIhAPldH+5H0G9klbwjJu2L85ZW1QbHWOLrtiLWK14rfwWdAiEA8b+xc/ATCSvw\
vesWWP0GwW524zRqZh7VX+XU2Xpqw48CIHtLhEI41+J8BV0ktFa34BTxkhrr7hMl\
IMVQx9ikAQYxAiEA3AWqvSlQOfW6+y8+PKm1f1FJdQpcmCsR6mDkczceenMCIApw\
Y30Gma+YVSrIkkyd6lZMv+zxSNaBAblzm2o9Abfx\
-----END RSA PRIVATE KEY-----",
"-----BEGIN RSA PRIVATE KEY-----\
MIICWwIBAAKBgQCyuL7vgD69afw7jYLnJdbDPWr5BIlt8lmt9IfzjOYJ/YJkTrAu\
k/ZEEOvuPA4TVflOCuwJtT6oZlb8E8HOh82j5LVMXFDzkHpjzBfO9OaT66j7RPAD\
dxRpsGUmk2pEHoLk/EXK0lTtsGv0i8OFDVSyxjufSCUGerkpV/+uafgJqwIDAQAB\
AoGAcwdvdO0A9J6zhoz1NNro2G6+XBosbgRu7gSWQA5uvP1aoD75LHF1LqgJgiNL\
F+zc8fsbor/x3SdJUyNQOSK1GnUtpnNXZV50XVk9mdJAWdgVWDcDUdKm7oQ2fbkv\
hjcTFZHUErXMi3zOQrWv5x5sd948Koq0Kg0ohIrOf8uhkQkCQQDX4IK8BHdfuNdz\
BohKsMFLdtQL06Lwz68qfplnFyQCKG+2zC2ALrkNAK/83x/+dFT84CiWzVDF5bFD\
TUMq+CYHAkEA0/Bfs9eXG5UnchvcMiNx6xlxtO9jT3Q5ZwVjjBly0QvdmXYRIcVi\
QF+D0pbNfi+YseNPLX/oJQDnbzYEbEK2PQJAJkQcyHk+M9CPGEujIyI70UWqBsKo\
EmmuEilIxfZbIqrKSqvcsOkXUk+54mgmwrMaUYzmhPy2Aa5agqSScG52RwJAGKK+\
XSdYV0p1NVxrsiBQo6VnhEK3Zor6CTGlKqnioM4iSi5hO224SAdSSW5iIKLjuvnT\
QFS35WU/gbvjs7nleQJAVSGtjX2HK4/yVU7dX+BCBiSrlReshr0So31l8fufydLw\
ahh8P6K19o8ysVAvZEnUECUlIR2Afpq5yabOCIkpbA==\
-----END RSA PRIVATE KEY-----"
];

keySizes.forEach(function(keySize, index){
    
    var jse = new JSEncrypt({default_key_size:keySize});
    var openssl_public_key = pbkeys[index];
    var openssl_private_key = prkeys[index];
    
    describe('JSEncrypt - '+keySize+' bit', function(){
        
        //this.timeout(0); //Timout for test cases, zero means infinite. Needed for key sizes > 1024
        
        describe('#getKey()', function(){
            
            it('should be '+keySize+' bit long', function () {
                
                var key = jse.getKey();
                var length = key.n.bitLength();
                length = length%2===0 ? length: length+1;
                expect(length).to.equal(keySize);

            });
            
        });

        describe('#encrypt() | #decrypt()', function(){
            
            //Tom Wu's RSA Object use paddingpkcs #1, type 2
            var maxLength = (((jse.getKey().n.bitLength()+7)>>3)-11);
            var maxLengthBit = maxLength << 3;
            
            it('should encrypt/decrypt up to '+maxLengthBit+' bit', function () {

                var test = [];
                for (var i=0; i<maxLength;i++)
                    test.push('a');
                test = test.join('');

                var encrypted = jse.encrypt(test);
                expect(encrypted).to.be.ok();

                var decrypted = jse.decrypt(encrypted);
                expect(decrypted).to.be(test);

            });

            it('should fail to encrypt more than '+maxLengthBit+' bit', function(){
                
                var test = [];
                for (var i=0; i<(maxLength+1);i++)
                    test.push('a');
                test = test.join('');

                var encrypted = jse.encrypt(test);
                expect(encrypted).to.not.be.ok();
                
            });

        });
        
        describe('#getPublicKey()', function(){
            
            var pkey = jse.getPublicKey();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should contain public header and footer and be wrapped at 64 chars', function(){
                //For small bit keys, the public key may contain only one line
                var regex = /-----BEGIN PUBLIC KEY-----\n((.{64}\n)+(.{1,64}\n)?)|(.{1,64}\n)-----END PUBLIC KEY-----/;
                expect(pkey).to.match(regex);

            });
            
        });
        
        describe('#getPrivateKey()', function(){
            
            var pkey = jse.getPrivateKey();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should contain private header and footer and be wrapped at 64 chars', function(){
                
                var regex = /-----BEGIN RSA PRIVATE KEY-----\n(.{64}\n)+(.{1,64}\n)?-----END RSA PRIVATE KEY-----/;
                expect(pkey).to.match(regex);
                
            });
            
        });
        
        describe('#getPublicKeyB64()', function(){
            
            var pkey = jse.getPublicKeyB64();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should not contain public header and footer,one line, base64 encoded', function(){
                
                //regex to match base64 encoded string, reference:
                //http://stackoverflow.com/a/5885097/1446321
                var regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
                expect(pkey).to.match(regex);
                
            });
            
        });
        
        describe('#getPrivateKeyB64()', function(){
            
            var pkey = jse.getPrivateKeyB64();
            
            it('should be a non-empty string', function(){
                
                expect(pkey).to.be.a('string');
                expect(pkey).to.not.be.empty();
                
            });
            
            it('should not contain private header and footer,one line, base64 encoded', function(){
                
                //regex to match base64 encoded string, reference:
                //http://stackoverflow.com/a/5885097/1446321
                var regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$/;
                expect(pkey).to.match(regex);
                
            });
            
        });
        
        describe('#setPrivateKey()', function(){
            
            var tmp = new JSEncrypt();
            tmp.setPrivateKey(openssl_private_key);
            
            it('should correctly set the private key parameters',function(){
                
                var params = ['n', 'e', 'd', 'p', 'q', 'dmp1', 'dmq1', 'coeff'];
                expect(tmp.key).to.be.ok();
                expect(tmp.key).to.have.keys(params);
                params.forEach(function(value, index){
                    expect(tmp.key[value]).to.be.ok();
                });
                
            });
            
            it('should both encrypt and decrypt',function(){
               
               var test = 'test';
               var enc = tmp.encrypt(test);
               expect(enc).to.be.ok();
               var dec = tmp.decrypt(enc);
               expect(dec).to.be(test);
                
            });
            
        });
        
        describe('#setPublicKey()', function(){
            
            var tmp = new JSEncrypt();
            tmp.setPublicKey(openssl_public_key);
            
            it('should correctly set the public key parameters',function(){
                
                var pub_params = ['n', 'e'];
                var priv_params = ['d', 'p', 'q', 'dmp1', 'dmq1', 'coeff'];
                expect(tmp.key).to.be.ok();
                expect(tmp.key).to.have.keys(pub_params);
                pub_params.forEach(function(value, index){
                    expect(tmp.key[value]).to.be.ok();
                });
                priv_params.forEach(function(value, index){
                    expect(tmp.key[value]).to.not.be.ok();
                });
                
            });
            
            it('should only encrypt',function(){
               
               var test = 'test';
               var enc = tmp.encrypt(test);
               var dec = tmp.decrypt(enc);
               expect(enc).to.be.ok();
               expect(dec).to.not.be.ok();
                
            });
            
        });
        
    });
    
});

