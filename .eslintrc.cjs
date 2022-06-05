"use strict";

module.exports = {
  root: true,
  extends: "@peggyjs",
  overrides: [
    {
      files: ["*.js"],
      parserOptions: {
        sourceType: "module",
        ecmaVersion: 2020,
      },
      rules: {
        "comma-dangle": ["error", {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "always-multiline",
          exports: "always-multiline",
          functions: "never",
        }],
      },
    },
  ],
};
