import peggy from "peggy";

/**
 * Turn a templated string into a Peggy parsing function.
 *
 * @param {peggy.ParserBuildOptions|undefined} opts Grammar generation options.
 * @param {string[]} strings The string portions of the template.
 * @param  {...any} values The interpolated values of the template.
 * @returns {function(string, peggy.ParserOptions): any} The parsing function.
 */
function pegWithOptions(opts, strings, ...values) {
  let text = "";
  strings.forEach((string, i) => {
    text += string + (values[i] || "");
  });
  try {
    const parser = peggy.generate(text, {
      grammarSource: "peggy-tag",
      ...opts,
    }).parse;
    return (text, options = {}) => {
      if (!options.grammarSource) {
        options.grammarSource = "peggy-tag-parser";
      }
      try {
        return parser(text, options);
      } catch (e) {
        // @ts-ignore
        if (typeof e?.format === "function") {
          // @ts-ignore
          e.message = e.format([{ source: options.grammarSource, text }]);
        }
        throw e;
      }
    };
  } catch (e) {
    // @ts-ignore
    if (typeof e?.format === "function") {
      // @ts-ignore
      e.message = e.format([{ source: "peggy-tag", text }]);
    }
    throw e;
  }
}

/**
 * Turn a templated string into a Peggy parsing function.
 *
 * @param {string[]} strings The string portions of the template.
 * @param  {...any} values The interpolated values of the template.
 * @returns {function(string, peggy.ParserOptions): any} The parsing function.
 * @example
 *   import peg from "peggy-tag";
 *   const parser = peg`foo = "foo"`;
 *   console.log(parser("foo"));
 */
export default function peg(strings, ...values) {
  return pegWithOptions(undefined, strings, ...values);
}

/**
 * Create a template string tag with non-default grammar generation options.
 *
 * @param {peggy.ParserBuildOptions|undefined} opts Grammar generation options.
 * @returns {function(string[], ...any): function(string, peggy.ParserOptions): any}
 * @example
 *   import peg from "peggy-tag";
 *   import myPeg = peg.withOptions({trace: true})
 *   const parser = myPeg`foo = "foo"`;
 *   console.log(parser("foo"));
 */
peg.withOptions = opts => (
  /**
   *
   * @param {string[]} strings The string portions of the template.
   * @param  {...any} values The interpolated values of the template.
   * @returns {function(string, peggy.ParserOptions): any} The parsing function.
   */
  (strings, ...values) => pegWithOptions(opts, strings, ...values)
);
