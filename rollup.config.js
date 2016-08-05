"use strict";
const path = require('path');
const rollup = require('rollup');


const entries = {
    'src/jsencrypt': {dst: 'bin/jsencrypt.bundle', name: 'jsencrypt'},
    'test/test.rsa': {dst: 'test/test.rsa.bundle', name: 'rsaTest'}
};
for (let entry in entries) {
    console.log(`processing ${entry}.js`);
    rollup.rollup({
        entry: path.join(__dirname, `${entry}.js`),
    }).then(function (bundle) {
        console.log(`processing ${entry}.js finished`);
        bundle.write({
            format: 'umd',
            moduleName: entries[entry].name,
            dest: path.join(__dirname, `${entries[entry].dst}.js`)
        });
    }).catch((e)=>{
        console.log(e);
    });
}