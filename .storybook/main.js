const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const sass = require("sass");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

require("dotenv").config();

const pkg = require("../package.json");

const examplesPath = path.join(__dirname, "..", "examples");
const SVG_ICONS = fs.readFileSync(
  path.join(examplesPath, "constants", "icons.svg"),
  "utf-8",
);

// Key is hard-coded because it will be public on the demo site anyway.
// Key usage is limited to whitelisted Referrers.
const EMBEDLY_API_KEY_PROD = "d23c29a928fe4d89bda46b0291914c9c";
const EMBEDLY_API_KEY = process.env.EMBEDLY_API_KEY || EMBEDLY_API_KEY_PROD;

const SENTRY_DSN_PROD =
  "https://ab23e9a1442c46f296a2527cdbe73a0e@sentry.io/251576";

module.exports = {
  stories: ["../examples/**/*.story.*"],
  framework: "@storybook/react",
  staticDirs: ["../public"],
  webpackFinal: (config, { configType }) => {
    const isProduction = configType === "PRODUCTION";

    // See http://webpack.github.io/docs/configuration.html#devtool
    config.devtool = "source-map";

    config.module.rules.push({
      test: /\.(scss|css)$/,
      loaders: ["style-loader", "css-loader", "sass-loader"],
      include: path.resolve(__dirname, "../"),
    });

    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NODE_ENV": JSON.stringify(configType.toLowerCase()),
        EMBEDLY_API_KEY: JSON.stringify(
          isProduction ? EMBEDLY_API_KEY_PROD : EMBEDLY_API_KEY,
        ),
        PKG_VERSION: JSON.stringify(pkg.version),
        SVG_ICONS: JSON.stringify(SVG_ICONS),
        SENTRY_DSN: JSON.stringify(isProduction ? SENTRY_DSN_PROD : ""),
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
