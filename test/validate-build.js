#!/usr/bin/env node

/**
 * CDN Validation Test Runner
 * 
 * This script validates that the built JSEncrypt library works correctly
 * and can be used as a UMD module in both Node.js and browser environments.
 */

const fs = require('fs');
const path = require('path');

function log(message, type = 'INFO') {
    console.log(`[${type}] ${message}`);
}

function testNodeJSCompatibility() {
    log('Testing Node.js compatibility...', 'TEST');
    
    try {
        // Test the built file
        const JSEncrypt = require('../bin/jsencrypt.js');
        
        if (typeof JSEncrypt !== 'function') {
            throw new Error(`Expected function, got ${typeof JSEncrypt}`);
        }
        
        // Test instantiation
        const crypt = new JSEncrypt();
        
        // Test key generation
        crypt.getKey();
        const privKey = crypt.getPrivateKey();
        const pubKey = crypt.getPublicKey();
        
        if (!privKey || !pubKey) {
            throw new Error('Key generation failed');
        }
        
        // Test encryption/decryption
        const testText = "Node.js test message";
        const encrypted = crypt.encrypt(testText);
        const decrypted = crypt.decrypt(encrypted);
        
        if (decrypted !== testText) {
            throw new Error(`Decryption failed. Expected: "${testText}", Got: "${decrypted}"`);
        }
        
        log('✅ Node.js compatibility test PASSED', 'PASS');
        return true;
        
    } catch (error) {
        log(`❌ Node.js compatibility test FAILED: ${error.message}`, 'FAIL');
        return false;
    }
}

function testUMDStructure() {
    log('Testing UMD structure...', 'TEST');
    
    try {
        const buildPath = path.join(__dirname, '../bin/jsencrypt.js');
        const buildContent = fs.readFileSync(buildPath, 'utf8');
        
        // Check for UMD pattern (updated for webpack 5)
        const umdPatterns = [
            /typeof exports === 'object' && typeof module === 'object'/,
            /typeof define === 'function' && define\.amd/,
            /webpackUniversalModuleDefinition/
        ];
        
        const missingPatterns = umdPatterns.filter(pattern => !pattern.test(buildContent));
        
        if (missingPatterns.length > 0) {
            throw new Error(`Missing UMD patterns: ${missingPatterns.length}/${umdPatterns.length}`);
        }
        
        // Check for library export
        if (!buildContent.includes('JSEncrypt')) {
            throw new Error('JSEncrypt library name not found in build');
        }
        
        // Check that it exports as global
        if (!buildContent.includes('root["JSEncrypt"]')) {
            throw new Error('Global export assignment not found');
        }
        
        log('✅ UMD structure test PASSED', 'PASS');
        return true;
        
    } catch (error) {
        log(`❌ UMD structure test FAILED: ${error.message}`, 'FAIL');
        return false;
    }
}

function testBuildFiles() {
    log('Testing build files existence...', 'TEST');
    
    const requiredFiles = [
        'bin/jsencrypt.js',
        'bin/jsencrypt.min.js',
        'lib/index.js',
        'lib/JSEncrypt.js'
    ];
    
    const missingFiles = requiredFiles.filter(file => {
        const fullPath = path.join(__dirname, '..', file);
        return !fs.existsSync(fullPath);
    });
    
    if (missingFiles.length > 0) {
        log(`❌ Build files test FAILED: Missing files: ${missingFiles.join(', ')}`, 'FAIL');
        return false;
    }
    
    log('✅ Build files test PASSED', 'PASS');
    return true;
}

function validatePackageJson() {
    log('Validating package.json configuration...', 'TEST');
    
    try {
        const packagePath = path.join(__dirname, '../package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        const requiredFields = {
            'main': 'bin/jsencrypt.min.js',
            'module': 'lib/index.js',
            'types': 'lib/index.d.ts'
        };
        
        const errors = [];
        
        for (const [field, expectedValue] of Object.entries(requiredFields)) {
            if (packageJson[field] !== expectedValue) {
                errors.push(`${field}: expected "${expectedValue}", got "${packageJson[field]}"`);
            }
        }
        
        if (errors.length > 0) {
            throw new Error(`Package.json validation failed:\n${errors.join('\n')}`);
        }
        
        log('✅ Package.json validation PASSED', 'PASS');
        return true;
        
    } catch (error) {
        log(`❌ Package.json validation FAILED: ${error.message}`, 'FAIL');
        return false;
    }
}

function openBrowserTest() {
    log('To test browser compatibility, open:', 'INFO');
    log('  http://localhost:4001/test/cdn-validation.html', 'INFO');
    log('  (Requires Jekyll server to be running)', 'INFO');
}

function main() {
    log('Starting JSEncrypt build validation...', 'START');
    console.log('='.repeat(50));
    
    const tests = [
        { name: 'Build Files', fn: testBuildFiles },
        { name: 'Package.json', fn: validatePackageJson },
        { name: 'UMD Structure', fn: testUMDStructure },
        { name: 'Node.js Compatibility', fn: testNodeJSCompatibility }
    ];
    
    let passCount = 0;
    let totalTests = tests.length;
    
    for (const test of tests) {
        if (test.fn()) {
            passCount++;
        }
    }
    
    console.log('='.repeat(50));
    log(`Validation Summary: ${passCount}/${totalTests} tests passed`, 'SUMMARY');
    
    if (passCount === totalTests) {
        log('🎉 All validation tests PASSED! Ready for publishing.', 'SUCCESS');
        openBrowserTest();
        process.exit(0);
    } else {
        log('💥 Some validation tests FAILED! Do not publish.', 'ERROR');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    testNodeJSCompatibility,
    testUMDStructure,
    testBuildFiles,
    validatePackageJson
};
