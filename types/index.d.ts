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
export default function peg(strings: string[], ...values: any[]): (arg0: string, arg1: peggy.ParserOptions) => any;
import peggy from "peggy";
