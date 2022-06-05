import peggy from "peggy";

/**
 * Turn a templated string into a Peggy parsing function.
 *
 * @param {string[]} strings The string portions of the template.
 * @param  {...any} values The interpolated values of the template.
 * @returns {peggy.Parser.parse}
 * @example
 *   import peg from "peggy-tag";
 *   const parser = peg`foo = "foo"`;
 *   console.log(parser("foo"));
 */
export default function peg(strings, ...values) {
  let text = "";
  strings.forEach((string, i) => {
    text += string + (values[i] || "");
  });
  try {
    const parser = peggy.generate(text, {
      grammarSource: "peggy-tag",
    }).parse;
    return (text, options = {}) => {
      if (!options.grammarSource) {
        options.grammarSource = "peggy-tag-parser";
      }
      try {
        return parser(text, options);
      } catch (e) {
        if (typeof e.format === "function") {
          e.message = e.format([{ source: "peggy-tag-parser", text }]);
        }
        throw e;
      }
    };
  } catch (e) {
    if (typeof e.format === "function") {
      e.message = e.format([{ source: "peggy-tag", text }]);
    }
    throw e;
  }
}
