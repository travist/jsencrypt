"use strict";
const resolve = require('rollup-plugin-node-resolve');
const uglify = require('rollup-plugin-uglify');
const pkg = require('./package.json');

var plugins = [
    resolve(),
    uglify({
        mangle: true,
        warnings: true,
        output: {
            beautify: false,
        },
        compress: {
            join_vars: true,
            if_return: true,
            properties: true,
            conditionals: true,
            warnings: true,
            dead_code: true,
            drop_console: true,
            drop_debugger: true,
        }
    })
];


export default [
    // {
    //     input: "./src/JSEncrypt.js",
    //     plugins: plugins,
    //     name: "JSEncrypt",
    //     output: [
    //         { file: pkg.browser, format: 'umd' },
    //     ]
    //
    // },
    {
        input: "./src/JSEncrypt.js",
        plugins: plugins,
        name: "JSEncrypt",
        output: [
            { file: pkg.main, format: 'umd' },
            // { file: pkg.module, format: 'es' }
        ]

    }
]