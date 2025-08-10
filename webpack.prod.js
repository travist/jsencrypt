const config = require("./webpack.config.js");
config.mode = "production";
config.output.filename = "jsencrypt.min.js";

module.exports = config;

