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
declare function peg(strings: string[], ...values: any[]): ParseFunction;
declare namespace peg {
    export { withOptions };
    export { withImports };
    export { withImportsOptions };
}
export default peg;
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
export function withOptions(opts: peggy.ParserBuildOptions | undefined): (arg0: string[], ...args: any[]) => ParseFunction;
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
export function withImports(strings: string[], ...values: any[]): Promise<ParseFunction>;
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
export function withImportsOptions(opts: peggy.ParserBuildOptions | undefined): (arg0: string[], ...args: any[]) => Promise<ParseFunction>;
export type ParseFunction = (arg0: string, arg1: peggy.ParserOptions) => any;
import peggy from "peggy";
