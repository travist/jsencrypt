const TerserPlugin = require("terser-webpack-plugin");
const config = require("./webpack.config.js");
config.mode = "production";
config.output.filename = "jsencrypt.min.js";
config.optimization = {
    minimize: true,
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                format: {
                    comments: false,
                },
            },
            extractComments: false,
        }),
    ],
};

module.exports = config;
