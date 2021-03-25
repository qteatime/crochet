const path = require("path");
const pkg = require("./package.json");

const benchTarget = {
  target: "node",
  mode: "none",
  entry: "./build/targets/bench.js",
  output: {
    path: path.resolve(__dirname, "versions"),
    filename: `crochet-v${pkg.version}.js`,
    library: {
      name: "Crochet",
      type: "umd"
    }
  },
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

module.exports = [benchTarget, clientTarget];
