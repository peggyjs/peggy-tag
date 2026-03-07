import mod from "@peggyjs/eslint-config/module.js";
import { modern } from "@peggyjs/eslint-config/modern.js";

export default [
  {
    ignores: [
      "node_module/**",
      "**/*.d.ts",
      "test/fixtures/*.js",
    ],
  },
  ...mod,
  {
    files: [
      "test/**",
    ],
    ...modern,
  },
];
