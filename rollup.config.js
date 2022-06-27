import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";

import pkg from "./package.json";

const config = [
  {
    input: "./src/index.ts",
    external: [
      "draft-js/lib/isSoftNewlineEvent",
      "draft-js/lib/DraftEditorBlock.react",
    ]
      .concat(Object.keys(pkg.dependencies))
      .concat(Object.keys(pkg.peerDependencies)),
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" },
    ],
    plugins: [typescript()],
  },
  {
    input: "./src/index.ts",
    output: [{ file: pkg.types, format: "es" }],
    plugins: [dts()],
  },
];

export default config;
