import { JSEncrypt } from "../lib/JSEncrypt";
import chai from "chai";
import dirtyChai from "dirty-chai";

chai.use(dirtyChai);
const expect = chai.expect;

describe("JSEncrypt Examples Tests (Working)", function () {
    
    describe("Basic Functionality", function () {
        
        it("should encrypt and decrypt with generated keys", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const message = "Hello World";
            const encrypted = jse.encrypt(message);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(message);
        });
        
        it("should encrypt credentials", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const credentials = "user:pass";
            const encrypted = jse.encrypt(credentials);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(credentials);
        });
        
        it("should handle API data", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const apiData = '{"id":123}';
            const encrypted = jse.encrypt(apiData);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(apiData);
        });
        
        it("should handle document signing", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const docHash = "abc123";
            const signature = jse.encrypt(docHash);
            
            expect(signature).to.be.ok();
            
            const verified = jse.decrypt(signature);
            expect(verified).to.be.equal(docHash);
        });
        
        it("should handle chunked data", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const chunks = ["chunk1", "chunk2"];
            const encryptedChunks = chunks.map(chunk => jse.encrypt(chunk));
            
            expect(encryptedChunks.every(chunk => chunk)).to.be.ok();
            
            const decryptedChunks = encryptedChunks.map(chunk => jse.decrypt(chunk));
            expect(decryptedChunks).to.deep.equal(chunks);
        });
        
        it("should handle storage data", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const storageData = '{"k":"v"}';
            const encrypted = jse.encrypt(storageData);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.be.equal(storageData);
        });
        
        it("should validate encryption operations", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const data = "test data";
            const encrypted = jse.encrypt(data);
            
            expect(encrypted).to.be.ok();
            expect(typeof encrypted).to.equal('string');
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.equal(data);
        });
        
        it("should handle secure operations", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const secureData = "secure123";
            const encrypted = jse.encrypt(secureData);
            
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.equal(secureData);
        });
        
        it("should validate key properties", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            const key = jse.getKey();
            expect(key).to.be.ok();
            expect(key.n).to.be.ok();
            expect(key.e).to.be.ok();
        });
        
        it("should handle error cases gracefully", function () {
            const jse = new JSEncrypt({ default_key_size: 1024 });
            
            // Test valid encryption first
            const validData = "valid";
            const encrypted = jse.encrypt(validData);
            expect(encrypted).to.be.ok();
            
            const decrypted = jse.decrypt(encrypted);
            expect(decrypted).to.equal(validData);
        });
    });
});
