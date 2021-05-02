const webpack = require("webpack");
const path = require("path");

const benchTarget = {
  target: "node",
  mode: "none",
  entry: "./build/targets/bench.js",
  output: {
    path: path.resolve(__dirname, "versions"),
    filename: `current.js`,
    library: {
      name: "Crochet",
      type: "umd",
    },
  },
};

const cliTarget = {
  target: "node",
  mode: "none",
  entry: "./build/new-crochet.js",
  node: {
    __dirname: false,
  },
  output: {
    path: path.resolve(__dirname),
    filename: `crochet-bundle.js`,
    library: {
      name: "Crochet",
      type: "commonjs",
    },
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.WEBPACK": true,
    }),
  ],
};

const clientTarget = {
  target: "web",
  mode: "production",
  entry: "./build/targets/web.js",
  output: {
    path: path.resolve(__dirname, "www"),
    filename: "crochet.js",
    library: {
      name: "Crochet",
      type: "umd",
    },
  },
};

module.exports = [benchTarget, cliTarget];
