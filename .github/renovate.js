module.exports = {
  extends: ["config:base"],
  // https://renovatebot.com/docs/configuration-options/#commitbodytable
  commitBodyTable: true,
  // https://renovatebot.com/docs/configuration-options/#ignoredeps
  ignoreDeps: [
    // Major peerDependencies.
    "draft-js",
    "immutable",
    // Dependencies that need consideration when updating.
    "decorate-component-with-props",
    "draft-js-plugins-editor",
    // Demo dependencies that are not necessarily covered in tests.
    "draft-convert",
    "draft-js-emoji-plugin",
    "draft-js-hashtag-plugin",
    "draft-js-inline-toolbar-plugin",
    "draft-js-side-toolbar-plugin",
    "react-intl",
    "react-modal",
    "reading-time",
    "formik",
    "prismjs",
    "stats-js",
    "core-js",
  ],
  // https://renovatebot.com/docs/configuration-options/#labels
  labels: ["enhancement"],
  // https://renovatebot.com/docs/configuration-options/#prcreation
  prCreation: "not-pending",
  // https://renovatebot.com/docs/configuration-options/#semanticcommits
  semanticCommits: true,
  // Use shorter commit messages to account for long dependency names.
  // https://docs.renovatebot.com/configuration-options/#commitmessagetopic
  commitMessageTopic: "{{depName}}",
  // https://renovatebot.com/docs/configuration-options/#prbodycolumns
  prBodyColumns: ["Package", "Update", "Type", "Change"],
  node: {
    enabled: true,
    major: {
      enabled: true,
    },
    // https://renovatebot.com/docs/node/#configuring-support-policy
    supportPolicy: ["current"],
  },
  packageRules: [
    {
      packageNames: ["prettier"],
      groupName: "prettier",
      automerge: true,
    },
    {
      packageNames: ["flow-bin"],
      groupName: "flow",
      automerge: true,
    },
    {
      packageNames: ["danger"],
      groupName: "danger",
      automerge: true,
    },
    {
      packagePatterns: ["^enzyme"],
      groupName: "enzyme",
      automerge: true,
    },
    {
      packagePatterns: ["^rollup", "^@babel"],
      groupName: "rollup",
      automerge: true,
    },
    {
      packageNames: [
        "eslint",
        "eslint-plugin-compat",
        "eslint-plugin-flowtype",
        "babel-eslint",
        "@thibaudcolas/eslint-plugin-cookbook",
      ],
      groupName: "eslint",
      automerge: true,
    },
    {
      packageNames: [
        "jest",
        "jest-axe",
        "jest-environment-node",
        "jest-image-snapshot",
        "babel-jest",
      ],
      groupName: "jest",
      automerge: true,
    },
    {
      packageNames: ["coveralls"],
      groupName: "coveralls",
      automerge: true,
    },
    {
      packageNames: ["webpack-bundle-analyzer"],
      groupName: "webpack-bundle-analyzer",
      automerge: true,
    },
    {
      packageNames: ["draftjs-conductor", "draftjs-filters"],
      groupName: "draftjs-*",
      semanticCommitType: "feat",
      updateTypes: ["minor", "patch"],
      automerge: true,
    },
    {
      packageNames: ["draftjs-conductor", "draftjs-filters"],
      groupName: "draftjs-*",
      semanticCommitType: "feat",
      updateTypes: ["major"],
      automerge: false,
    },
    {
      packageNames: ["draftjs-conductor", "draftjs-filters"],
      groupName: "draftjs-*",
      updateTypes: ["pin", "digest", "lockFileMaintenance", "rollback", "bump"],
      automerge: true,
    },
    {
      packageNames: ["react", "react-dom", "react-test-renderer"],
      groupName: "react",
      automerge: true,
    },
    {
      packagePatterns: ["^storybook", "^@storybook"],
      groupName: "storybook",
      automerge: true,
    },
    {
      packageNames: ["stylelint", "@thibaudcolas/stylelint-config-cookbook"],
      groupName: "stylelint",
      automerge: true,
    },
    {
      packageNames: ["normalize.css"],
      groupName: "normalize.css",
      automerge: true,
    },
    {
      packageNames: ["@sentry/browser"],
      groupName: "@sentry/browser",
      automerge: true,
    },
    {
      packageNames: [
        "autoprefixer",
        "postcss-cli",
        "postcss-loader",
        "sass-loader",
        "style-loader",
        "sass",
      ],
      groupName: "styles build",
      automerge: true,
    },
    {
      packageNames: [
        "dotenv",
        "express",
        "markov_draftjs",
        "mkdirp",
        "puppeteer",
        "react-benchmark",
        "react-component-benchmark",
        "rimraf",
      ],
      groupName: "dev tooling",
      automerge: true,
    },
  ],
};
