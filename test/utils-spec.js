import { callLocation, combine } from "../lib/utils.js";
import assert from "node:assert";
import { fileURLToPath } from "node:url";
import test from "node:test";

function comb(strings, ...values) { return combine(strings, values); }

test("combine", () => {
  assert.equal(comb``, "");
  assert.equal(comb`foo`, "foo");
  assert.equal(comb`${false}`, "false");
  assert.equal(comb`${false} is ${NaN}`, "false is NaN");
});

test("callLocation", () => {
  assert.equal(callLocation(1000).source, "peggy-tag");
  assert.equal(callLocation(1).source, fileURLToPath(import.meta.url));
  assert.match(callLocation(2).source, /^node:/);
});
