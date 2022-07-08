const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const pkg = require("../package.json");

const examplesPath = path.join(__dirname, "..", "examples");
const SVG_ICONS = fs.readFileSync(
  path.join(examplesPath, "constants", "icons.svg"),
  "utf-8",
);

// Key is hard-coded because it will be public on the demo site anyway.
// Key usage is limited to allowed Referrers.
const EMBEDLY_API_KEY_PROD = "d23c29a928fe4d89bda46b0291914c9c";
const EMBEDLY_API_KEY = process.env.EMBEDLY_API_KEY || EMBEDLY_API_KEY_PROD;

module.exports = {
  stories: ["../examples/**/*.story.*"],
  // See https://github.com/storybookjs/storybook/issues/18662.
  addons: [],
  framework: "@storybook/react",
  core: {
    builder: {
      name: "webpack5",
      options: {
        lazyCompilation: true,
        fsCache: true,
      },
    },
    disableTelemetry: true,
  },
  staticDirs: ["../public"],
  webpackFinal: (config, { configType }) => {
    const isProduction = configType === "PRODUCTION";

    config.devtool = "source-map";

    config.resolve.alias = {
      ...config.resolve.alias,
      // "react-dom": path.resolve("..", "node_modules", "react-dom"),
      // "react-dom/client": path.resolve("..", "node_modules", "react-dom"),
    };

    config.module.rules.push({
      test: /\.(scss|css)$/,
      use: ["style-loader", "css-loader", "sass-loader"],
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(configType.toLowerCase()),
        EMBEDLY_API_KEY: JSON.stringify(
          isProduction ? EMBEDLY_API_KEY_PROD : EMBEDLY_API_KEY,
        ),
        PKG_VERSION: JSON.stringify(pkg.version),
        SVG_ICONS: JSON.stringify(SVG_ICONS),
      }),
    );

    config.plugins.push(
      new BundleAnalyzerPlugin({
        // Can be `server`, `static` or `disabled`.
        analyzerMode: "static",
        // Path to bundle report file that will be generated in `static` mode.
        reportFilename: path.join(
          __dirname,
          "..",
          "public",
          "webpack-stats.html",
        ),
        // Automatically open report in default browser
        openAnalyzer: false,
        logLevel: isProduction ? "info" : "warn",
      }),
    );

    return config;
  },
};
