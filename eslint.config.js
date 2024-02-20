"use strict";

export default [
  {
    files: [
      "**/*.js", 
    ],
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
];