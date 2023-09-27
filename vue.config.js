const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  devServer: {
    // "allowedHosts": "all",
    port: 8000,
  },
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
};
