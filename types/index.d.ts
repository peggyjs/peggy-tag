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
declare function peg(strings: string[], ...values: any[]): (arg0: string, arg1: peggy.ParserOptions) => any;
declare namespace peg {
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
    function withOptions(opts: peggy.ParserBuildOptions | undefined): (arg0: string[], ...arg1: any[]) => (arg0: string, arg1: peggy.ParserOptions) => any;
}
export default peg;
import peggy from "peggy";
