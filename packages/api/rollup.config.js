import typescript from "rollup-plugin-typescript2";
export default [
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.esm.js",
      format: "esm",
    },
    plugins: [typescript()],
    external: ["zod", "@griffins-scout/game"],
  },
  {
    input: "./src/index.ts",
    output: {
      file: "./dist/index.js",
      format: "cjs",
    },
    plugins: [typescript()],
    external: ["zod", "@griffins-scout/game"],
  },
];
