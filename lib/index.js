import { callLocation, combine, formatMessage } from "./utils.js";
import fromMem from "@peggyjs/from-mem";
import peggy from "peggy";

/**
 * @typedef {function(string, peggy.ParserOptions): any} ParseFunction
 */

/**
 * Return a function that has the given parse function wrapped with utilities
 * that set the grammarLocation and format any errors that are thrown.
 *
 * @param {ParseFunction} parse
 * @returns {ParseFunction}
 */
function curryParse(parse) {
  return function Parse(text, options = {}) {
    if (!options.grammarSource) {
      options.grammarSource = callLocation(2, 7);
    }
    try {
      return parse(text, options);
    } catch (e) {
      throw formatMessage(e, options.grammarSource, text);
    }
  };
}

/**
 * Turn a templated string into a Peggy parsing function.
 *
 * @param {peggy.ParserBuildOptions|undefined} opts Grammar generation options.
 * @param {string[]} strings The string portions of the template.
 * @param  {any[]} values The interpolated values of the template.
 * @returns {ParseFunction} The parsing function.
 */
function pegWithOptions(opts, strings, values) {
  const text = combine(strings, values);
  const grammarSource = callLocation(3);
  try {
    const { parse } = peggy.generate(text, {
      grammarSource,
      ...opts,
    });
    return curryParse(parse);
  } catch (e) {
    throw formatMessage(e, grammarSource, text);
  }
}

/**
 * Turn a templated string into a Peggy parsing function.
 *
 * @param {peggy.ParserBuildOptions|undefined} opts Grammar generation options.
 * @param {string[]} strings The string portions of the template.
 * @param  {any[]} values The interpolated values of the template.
 * @returns {Promise<ParseFunction>} The parsing function.
 */
async function importPegWithOptions(opts, strings, values) {
  const text = combine(strings, values);
  const grammarSource = callLocation(3);
  try {
    const src = /** @type {string} */ (peggy.generate(text, {
      grammarSource,
      format: "es",
      output: "source-with-inline-map",
      ...opts,
    }));
    const { parse } = /** @type {peggy.Parser} */ (await fromMem(src, {
      filename: grammarSource.source,
      format: "es",
    }));
    return curryParse(parse);
  } catch (e) {
    throw formatMessage(e, grammarSource, text);
  }
}

/**
 * Turn a templated string into a Peggy parsing function.
 *
 * @param {string[]} strings The string portions of the template.
 * @param  {...any} values The interpolated values of the template.
 * @returns {ParseFunction} The parsing function.
 * @example
 *   import peg from "peggy-tag";
 *   const parse = peg`foo = "foo"`;
 *   console.log(parse("foo"));
 */
export default function peg(strings, ...values) {
  return pegWithOptions(undefined, strings, values);
}

/**
 * Create a template string tag with non-default grammar generation options.
 *
 * @param {peggy.ParserBuildOptions|undefined} opts Grammar generation options.
 * @returns {function(string[], ...any): ParseFunction}
 * @example
 *   import { withOptions } from "peggy-tag";
 *   import myPeg = withOptions({trace: true})
 *   const parser = myPeg`foo = "foo"`;
 *   console.log(parser("foo"));
 */
export function withOptions(opts) {
  /**
   * @param {string[]} strings The string portions of the template.
   * @param  {...any} values The interpolated values of the template.
   * @returns {ParseFunction} The parsing function.
   */
  return (strings, ...values) => pegWithOptions(opts, strings, values);
}
peg.withOptions = withOptions;

/**
 * Create a parse from a string that may include import statements.
 *
 * @param {string[]} strings The string portions of the template.
 * @param  {...any} values The interpolated values of the template.
 * @returns {Promise<ParseFunction>} The parsing function.
 * @example
 *   import { withImports } from "peggy-tag";
 *   const parse = await withImports`foo = "foo"`;
 *   console.log(parse("foo"));
 */
export function withImports(strings, ...values) {
  return importPegWithOptions(undefined, strings, values);
}
peg.withImports = withImports;

/**
 * Create a template string tag with non-default grammar generation options,
 * for grammars that include imports.
 *
 * @param {peggy.ParserBuildOptions|undefined} opts Grammar generation options.
 * @returns {function(string[], ...any): Promise<ParseFunction>}
 * @example
 *   import { withImportsOptions } from "peggy-tag";
 *   import myPeg = peg.withOptions({trace: true})
 *   const parser = await myPeg`foo = "foo"`;
 *   console.log(parser("foo"));
 */
export function withImportsOptions(opts) {
  /**
   * @param {string[]} strings The string portions of the template.
   * @param  {...any} values The interpolated values of the template.
   * @returns {Promise<ParseFunction>} The parsing function.
   */
  return (strings, ...values) => importPegWithOptions(opts, strings, values);
}
peg.withImportsOptions = withImportsOptions;
