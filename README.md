# peggy-tag
Tagged template strings for Peggy grammars

## Installation

```bash
npm install peggy-tag
```

## Usage

```js
import peggy from "../lib/index.js";

const parse = peggy`foo = $("f" "o"+)`;
console.log(parse("foooo")); // "foooo"

const trace = peggy.withOptions({ trace: true });
const traceParse = trace`num = n:$[0-9]+ { return parseInt(n, 10); }`
console.log(traceParse("123"));
// 1:1-1:1 rule.enter num
// 1:1-1:4 rule.match num
// 123
```

## Notes:

- This currently is only tested on Node 18+, no browser version yet.
- Can't be used with `require`.
- This is for non-performance-sensitive code (e.g. prototypes), because the
  parser with be generated every time the template is evaluated.

[![Tests](https://github.com/peggyjs/peggy-tag/actions/workflows/node.js.yml/badge.svg)](https://github.com/peggyjs/peggy-tag/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/peggyjs/peggy-tag/branch/main/graph/badge.svg?token=JCB9G04O47)](https://codecov.io/gh/peggyjs/peggy-tag)
