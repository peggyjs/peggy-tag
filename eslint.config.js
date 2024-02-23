import mod from "@peggyjs/eslint-config/flat/module.js";
import modern from "@peggyjs/eslint-config/flat/modern.js";
import peggyjs from "@peggyjs/eslint-plugin/lib/flat/recommended.js";

export default [
  {
    ignores: [
      "node_module/**",
      "**/*.d.ts",
      "test/fixtures/*.js",
    ],
  },
  mod,
  peggyjs,
  {
    files: [
      "test/**",
    ],
    modern,
  },
];
