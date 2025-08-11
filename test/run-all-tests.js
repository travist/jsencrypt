#!/usr/bin/env node

/**
 * Comprehensive test runner for JSEncrypt
 * This script runs both the original Mocha tests and the examples tests
 */

const { spawn } = require('child_process');
const path = require('path');

function runCommand(command, args, description) {
    return new Promise((resolve, reject) => {
        console.log(`\n📋 ${description}`);
        console.log(`Running: ${command} ${args.join(' ')}\n`);
        
        const child = spawn(command, args, {
            stdio: 'inherit',
            cwd: process.cwd()
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ ${description} - PASSED\n`);
                resolve();
            } else {
                console.log(`❌ ${description} - FAILED (exit code: ${code})\n`);
                reject(new Error(`${description} failed with exit code ${code}`));
            }
        });
        
        child.on('error', (error) => {
            console.log(`❌ ${description} - ERROR: ${error.message}\n`);
            reject(error);
        });
    });
}

async function runAllTests() {
    console.log('🚀 Running JSEncrypt Complete Test Suite');
    console.log('==========================================\n');
    
    const startTime = Date.now();
    let mochaTests = false;
    let examplesTests = false;
    
    try {
        // Run original Mocha tests
        await runCommand('npx', ['ts-mocha', 'test/index.js'], 'Original JSEncrypt Library Tests (Mocha)');
        mochaTests = true;
    } catch (error) {
        console.log('⚠️  Mocha tests failed, but continuing with examples tests...\n');
    }
    
    try {
        // Run examples tests
        await runCommand('node', ['test/run-examples-tests.js'], 'JSEncrypt Examples Tests (Custom)');
        examplesTests = true;
    } catch (error) {
        console.log('⚠️  Examples tests failed\n');
    }
    
    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log('==========================================');
    console.log('🏁 Test Suite Summary');
    console.log('==========================================');
    console.log(`⏱️  Total time: ${duration}s`);
    console.log(`📊 Original Library Tests: ${mochaTests ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`📊 Examples Tests: ${examplesTests ? '✅ PASSED' : '❌ FAILED'}`);
    
    if (mochaTests && examplesTests) {
        console.log('\n🎉 ALL TESTS PASSED! JSEncrypt is working perfectly.');
        console.log('✅ Core library functionality validated');
        console.log('✅ Documentation examples validated');
        process.exit(0);
    } else if (examplesTests) {
        console.log('\n⚠️  Examples tests passed, but some core tests failed.');
        console.log('✅ Documentation examples are valid');
        console.log('❌ Some core library tests need attention');
        process.exit(1);
    } else if (mochaTests) {
        console.log('\n⚠️  Core tests passed, but examples tests failed.');
        console.log('✅ Core library functionality is working');
        console.log('❌ Some documentation examples need attention');
        process.exit(1);
    } else {
        console.log('\n❌ BOTH TEST SUITES FAILED!');
        console.log('❌ Core library tests failed');
        console.log('❌ Examples tests failed');
        process.exit(1);
    }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
    console.log('\n\n⏹️  Test execution interrupted by user');
    process.exit(130);
});

process.on('SIGTERM', () => {
    console.log('\n\n⏹️  Test execution terminated');
    process.exit(143);
});

// Run the tests
runAllTests().catch((error) => {
    console.error('\n💥 Unexpected error running tests:', error.message);
    process.exit(1);
});
