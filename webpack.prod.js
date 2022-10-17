import config from "./webpack.config.js";
config.mode = "production";
config.output.filename = "jsencrypt.min.js";

export default config;

