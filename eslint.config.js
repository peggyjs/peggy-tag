import mod from "@peggyjs/eslint-config/flat/module.js";

export default [
  {
    ignores: [
      "node_module/**",
      "**/*.d.ts",
    ],
  },
  mod,
];
