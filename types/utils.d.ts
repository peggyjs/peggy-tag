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
export function callLocation(depth: number, offset?: number | undefined): peggy.GrammarLocation;
/**
 * Combine the parameters from a tagged template literal into a string.
 *
 * @param {string[]} strings
 * @param {any[]} values
 * @returns {string}
 */
export function combine(strings: string[], values: any[]): string;
/**
 * If this is a grammar error, reformat the message using the associated
 * text.
 *
 * @param {any} error An error th
 * @param {any} source
 * @param {string} text
 * @returns {Error} Error with reformatted message, if possible
 */
export function formatMessage(error: any, source: any, text: string): Error;
import peggy from "peggy";
