const register = require("@babel/register").default;

register({
    extensions: [".ts", ".js"],
    presets: ["@babel/preset-env", "@babel/preset-typescript"],
});
