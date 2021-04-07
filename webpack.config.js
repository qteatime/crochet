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
  entry: "./build/cli/crochet.js",
  output: {
    path: path.resolve(__dirname, "build/cli/"),
    filename: `crochet-bundle.js`,
    library: {
      name: "Crochet",
      type: "commonjs",
    },
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

module.exports = [benchTarget, cliTarget];
