import peggy from "peggy";
import url from "node:url";

/**
 * Generate a GrammarLocation for one of the functions up the call stack
 * from here.  0 is not useful, it's always the callLocation function.
 * 1 is unlikely to be useful, it's the place you are calling callLocation from,
 * so you presumably know where you are.  2 is the caller of the function you
 * are in, etc.
 *
 * @param {number} depth How deep in the callstack to go?
 * @param {number} [offset=1] How many characters to add to the location to
 *   account for the calling apparatus, such as the backtick or the function
 *   name + paren.
 * @returns {peggy.GrammarLocation} Location of the grammar in the enclosing
 *   file.
 * @see https://v8.dev/docs/stack-trace-api
 */
export function callLocation(depth, offset = 1) {
  const old = Error.prepareStackTrace;
  Error.prepareStackTrace = (_, s) => s;
  const stack = /** @type {NodeJS.CallSite[]} */(
    /** @type {unknown} */(new Error().stack)
  );
  Error.prepareStackTrace = old;

  // Not v8, or short-stacked vs. expectations
  if (!Array.isArray(stack) || (stack.length < depth)) {
    return new peggy.GrammarLocation(
      "peggy-tag",
      {
        offset: 0,
        line: 0,
        column: 0,
      }
    );
  }

  const callsite = stack[depth];
  const fn = callsite.getFileName();
  const path = fn?.startsWith("file:") ? url.fileURLToPath(fn) : fn;
  return new peggy.GrammarLocation(
    path,
    {
      offset: callsite.getPosition() + offset,
      // These will be 0 if the frame selected is native code, which
      // we should never be doing in this package.
      line: callsite.getLineNumber() || 0,
      column: (callsite.getColumnNumber() || 0) + offset,
    }
  );
}

/**
 * Combine the parameters from a tagged template literal into a string.
 *
 * @param {string[]} strings
 * @param {any[]} values
 * @returns {string}
 */
export function combine(strings, values) {
  return strings.reduce((t, s, i) => t + s + String(values[i] ?? ""), "");
}

/**
 * If this is a grammar error, reformat the message using the associated
 * text.
 *
 * @param {any} error An error th
 * @param {any} source
 * @param {string} text
 * @returns {Error} Error with reformatted message, if possible
 */
export function formatMessage(error, source, text) {
  if ((typeof error === "object") && (typeof error?.format === "function")) {
    error.message = error.format([{ source, text }]);
  }
  return error;
}
