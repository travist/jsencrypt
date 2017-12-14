"use strict";
const path = require('path');
const rollup = require('rollup');


const entries = {
    'src/jsencrypt': {file: 'bin/jsencrypt.bundle', name: 'jsencrypt'},
    'test/test.rsa': {file: 'test/test.rsa.bundle', name: 'rsaTest'}
};
for (let entry in entries) {
    console.log(`processing ${entry}.js`);
    rollup.rollup({
        input: path.join(__dirname, `${entry}.js`),
    }).then(function (bundle) {
        console.log(`processing ${entry}.js finished`);
        bundle.write({
            format: 'umd',
            name: entries[entry].name,
            file: path.join(__dirname, `${entries[entry].file}.js`)
        });
    }).catch((e)=>{
        console.log(e);
    });
}