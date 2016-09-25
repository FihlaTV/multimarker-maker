var path = require("path");
var webpack = require('webpack');

module.exports = {
  entry: {
    app: ["./app/example.js"]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    publicPath: "/assets/",
    filename: "build.js"
  },
  devServer: {
    inline: true,
    hot: true,
    host: '0.0.0.0'
    // public: true
  },
  plugins: [
    // new webpack.HotModuleReplacementPlugin(),
  ]
};
