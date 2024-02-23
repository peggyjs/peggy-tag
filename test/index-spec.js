import { default as peggy, withImports } from "../lib/index.js";
import assert from "node:assert";
import semver from "semver";
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
    // The position of the dquote in the line above.  This will change
    // if the line above moves in the file.
    /index-spec\.js:16:21\n   \|\n16 \| foo = "foo\n   \|       \^/
  );
});

test("bad input", () => {
  const parser = peggy`foo = "foo"`;
  assert.throws(
    () => parser("bar"), // This is line 26
    /^26 \| bar/m
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

test("with library", async t => {
  if (!semver.satisfies(process.version, ">=20.8")) {
    t.skip("Requires node 20.8+");
    return;
  }

  const parser = await withImports`
    import Foo from "./fixtures/foo.js"
    Bar = Foo`;

  assert.equal(parser("foo"), "foo");
});

test("with library, errors", async t => {
  if (!semver.satisfies(process.version, ">=20.8")) {
    t.skip("Requires node 20.8+");
    return;
  }

  await assert.rejects(() => withImports`
    import Boo from "./fixtures/foo.js"
    Bar = Foo`);
});

test("with library and options", async t => {
  if (!semver.satisfies(process.version, ">=20.8")) {
    t.skip("Requires node 20.8+");
    return;
  }

  const peg = peggy.withImportsOptions({ trace: true });
  const parser = await peg`
    import Foo from "./fixtures/foo.js"
    Bar = Foo`;
  const events = [];
  parser("foo", {
    tracer: {
      trace(ev) {
        events.push(ev);
      },
    },
  });
  assert(events.length > 0);
});
