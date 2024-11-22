const path = require("path");

const { ProvidePlugin, DefinePlugin } = require("webpack");

module.exports = {
    entry: "./test/test.rsa.js",
    output: {
        library: "JSEncrypt",
        libraryTarget: "umd",
        libraryExport: "default",
        globalObject: "window",
        path: path.resolve(__dirname, "test"),
        filename: "test.rsa.bundle.js",
    },
    mode: "development",
    performance: { hints: false },
    module: {
        rules: [
            {
                test: /\.m?js/,
                type: "javascript/auto",
            },
            {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    plugins: [
        new ProvidePlugin({
            process: "process/browser",
        }),
        new DefinePlugin({
            "process.env.npm_package_version": JSON.stringify(
                process.env.npm_package_version,
            ),
        }),
    ],
};
