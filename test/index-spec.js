import assert from "node:assert";
import peggy from "../lib/index.js";
import test from "node:test";

// Don't syntax-highlight the intentionally-invalid code.
const bad = peggy;

test("happy path", () => {
  const parser = peggy`foo = "foo"`;
  assert(parser("foo"), "foo");
});

test("bad grammar", () => {
  assert.throws(
    () => bad`foo = "foo`,
    "1 | foo"
  );
});

test("bad input", () => {
  const parser = peggy`foo = "foo"`;
  assert.throws(
    () => parser("bar"),
    "1 | bar"
  );
});

test("with options", () => {
  const peg = peggy.withOptions({ trace: true });
  const parser = peg`foo = "3"`;
  const events = [];
  parser("3", {
    tracer: {
      trace(ev) {
        events.push(ev);
      },
    },
  });
  assert(events.length > 0);
});
