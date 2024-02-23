# peggy-tag
Tagged template strings for Peggy grammars

## Installation

```bash
npm install peggy-tag
```

## Usage

```js
import peggy from "peggy-tag";

const parse = peggy`foo = $("f" "o"+)`;
console.log(parse("foooo")); // "foooo"

const traceGrammar = peggy.withOptions({ trace: true });
const trace = traceGrammar`num = n:$[0-9]+ { return parseInt(n, 10); }`
console.log(trace("123"));
// 8:20-8:20 rule.enter num
// 8:20-8:23 rule.match num
// 123
```

If your grammar imports rules from other grammars, you MUST use the async
functions `withImports` or `withImportsOptions`

```js
import {withImports, withImportsOptions} from "peggy-tag";

const parse = await withImports`
import Foo from './test/fixtures/foo.js'
bar = Foo`;
console.log(parse("foo")); // "foo"

const traceGrammar = await withImportsOptions({ trace: true });
const trace = traceGrammar`num = n:$[0-9]+ { return parseInt(n, 10); }`
console.log(trace("123"));
// 11:20-11:20 rule.enter num
// 11:20-11:23 rule.match num
// 123
```

## Notes:

- This currently is only tested on Node 18+, no browser version yet.
- Node 20.8+ and `--experimental-vm-modules` are required for the async
  versions that allow importing libraries.
- This is for NON-performance-sensitive code (e.g. prototypes), because the
  parser with be generated every time the template is evaluated.
- If your parse function's variable name has exactly five letters (like
  "parse" or "trace"), the column numbers will be correct.  See issue #14
  for discussion.

[![Tests](https://github.com/peggyjs/peggy-tag/actions/workflows/node.js.yml/badge.svg)](https://github.com/peggyjs/peggy-tag/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/peggyjs/peggy-tag/branch/main/graph/badge.svg?token=JCB9G04O47)](https://codecov.io/gh/peggyjs/peggy-tag)
