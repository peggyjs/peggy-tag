import peggy from "peggy";
import url from "node:url";

/**
 *
 * @param {number} depth How deep in the callstack to go?  "2" is usually the
 *   first interesting one.
 * @returns {peggy.GrammarLocation?} Location of the grammar in the enclosing
 *   file.
 */
function callLocation(depth) {
  const old = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, s) => s;
  const stack = new Error().stack;
  Error.prepareStackTrace = old;

  // Not v8, or short-stacked vs. expectations
  if (!Array.isArray(stack) || (stack.length < depth)) {
    return null;
  }

  const callsite = stack[depth];
  const source = callsite.getFileName();
  const path = source.startsWith("file:") ? url.fileURLToPath(source) : source;
  return new peggy.GrammarLocation(
    path,
    {
      offset: callsite.getPosition() + 1, // Go past backtick
      line: callsite.getLineNumber(),
      column: callsite.getColumnNumber() + 1,  // Go past backtick
    }
  );
}

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
  const grammarSource = callLocation(3) || "peggy-tag";
  try {
    const parser = peggy.generate(text, {
      grammarSource,
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
      e.message = e.format([{ source: grammarSource, text }]);
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
