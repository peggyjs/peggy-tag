import assert from "node:assert";
import peggy from "../lib/index.js";
import test from "node:test";

test("happy path", () => {
  const parser = peggy`foo = "foo"`;
  assert(parser("foo"), "foo");
});

test("bad grammar", () => {
  assert.throws(
    () => peggy`foo = "foo`,
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
