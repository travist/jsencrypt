"use strict";
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const replace = require('rollup-plugin-replace');
const pkg = require('./package.json');

var plugins = [
    resolve(),
    // uglify({
    //     mangle: true,
    //     warnings: true,
    //     output: {
    //         beautify: false,
    //     },
    //     compress: {
    //         join_vars: true,
    //         if_return: true,
    //         properties: true,
    //         conditionals: true,
    //         warnings: true,
    //         dead_code: true,
    //         drop_console: true,
    //         drop_debugger: true,
    //     }
    // }),
    replace({
        'JSENCRYPT_VERSION': JSON.stringify(pkg.version)
    })

];


module.exports = {
        input: "./src/index.js",
        plugins: plugins,
        name: "JSEncrypt",
        output: {
            file: pkg.main,
            format: 'umd',
            name: "JSEncrypt",
            exports: "named"
        },
            // { file: pkg.module, format: 'es' }


    };
