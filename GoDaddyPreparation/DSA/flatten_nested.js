/*
Recursion over a Nested Data Structure   [Q2.7.4]

A) flatten a nested array
   [1,[2,[3,[4]],5]] -> [1,2,3,4,5]
   with a depth limit: depth 1 -> [1,2,[3,[4]],5]

B) flatten a nested object into dot-separated keys
   {a:{b:{c:1}}, d:2} -> {"a.b.c":1, "d":2}

Asked at Senior level, Dec 2025. They watch for the base case,
the depth limit, and whether you know the iterative version.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Recursion answers one question per item: is this item a
  CONTAINER or a LEAF?
      leaf      -> push it
      container -> recurse into it, then continue

- The base case is not an index check here, it is a TYPE check.
  That is the only thing that differs from list recursion.

- Depth limit: pass the remaining depth down and decrease it.
  depth 0 means "treat containers as leaves, do not open them".

- Iterative version = a STACK. Push the array reversed, pop items,
  push back the contents of any array you pop. Same result, no
  recursion depth limit. Worth showing after the recursive one.

- For objects, carry the key PREFIX down instead of a depth, and
  join with a dot at each level.

- Careful: in JS, typeof null === "object" and arrays are objects
  too. Check Array.isArray first, and null explicitly.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
input [1,[2,[3,[4]],5]]

  see 1        leaf       -> out [1]
  see [2,...]  container  -> go in
      see 2        leaf       -> out [1,2]
      see [3,[4]]  container  -> go in
          see 3      leaf     -> out [1,2,3]
          see [4]    container-> go in
              see 4  leaf     -> out [1,2,3,4]
          come back
      come back
      see 5        leaf       -> out [1,2,3,4,5]
  done

DEPTH LIMIT of 1, same input
  depth 1 : open the outer array only
  see 1          -> out [1]
  see [2,[3,[4]],5] -> open it, remaining depth 0
      see 2      -> out [1,2]
      see [3,[4]] -> depth is 0, so it stays a LEAF -> out ...,[3,[4]]
      see 5      -> out [1,2,[3,[4]],5]

STACK VERSION on [1,[2,3]]
  stack [ [1,[2,3]] reversed ] -> [ [2,3], 1 ]
  pop 1        leaf     -> out [1]
  pop [2,3]    array    -> push 3, push 2   stack [3,2]
  pop 2        leaf     -> out [1,2]
  pop 3        leaf     -> out [1,2,3]

OBJECT VERSION {a:{b:{c:1}}, d:2}
  prefix ""    key a -> object -> go in with prefix "a"
  prefix "a"   key b -> object -> go in with prefix "a.b"
  prefix "a.b" key c -> 1 is a leaf -> out {"a.b.c": 1}
  prefix ""    key d -> 2 is a leaf -> out {..., "d": 2}
*/

// ============================================================
// 3) A) FLATTEN AN ARRAY - RECURSIVE (THE MAIN ANSWER)
// ============================================================
/*
    Time  : O(n) where n = total number of items at every level.
    Space : O(d) recursion depth + O(n) output.
*/
function flatten(input) {
  const result = [];

  function walk(items) {
    for (const item of items) {
      if (Array.isArray(item)) {
        // container - open it and keep going
        walk(item);
      } else {
        // leaf - it belongs in the answer
        result.push(item);
      }
    }
  }

  walk(input);
  return result;
}

// ============================================================
// 4) A) WITH A DEPTH LIMIT (LIKE Array.prototype.flat)
// ============================================================
/*
- depth counts how many more levels may be opened.
    flattenDepth(x, 1)        -> one level
    flattenDepth(x, Infinity) -> everything
*/
function flattenDepth(input, depth) {
  const result = [];

  function walk(items, remaining) {
    for (const item of items) {
      // an array is only opened while depth is left
      if (Array.isArray(item) && remaining > 0) {
        walk(item, remaining - 1);
      } else {
        result.push(item);
      }
    }
  }

  walk(input, depth);
  return result;
}

// ============================================================
// 5) A) ITERATIVE - EXPLICIT STACK, NO RECURSION LIMIT
// ============================================================
/*
- The stack replaces the call stack. Push reversed so the items
  come out in the original order.
    Time  : O(n)   Space : O(n)
- This is the answer to "what if the nesting is 100000 deep?"
*/
function flattenIterative(input) {
  const result = [];
  // reversed, because a stack pops from the end
  const stack = [...input].reverse();

  while (stack.length > 0) {
    const item = stack.pop();

    if (Array.isArray(item)) {
      // put its contents back on the stack, order preserved
      for (let i = item.length - 1; i >= 0; i--) {
        stack.push(item[i]);
      }
    } else {
      result.push(item);
    }
  }

  return result;
}

// ============================================================
// 6) B) FLATTEN AN OBJECT INTO DOTTED KEYS
// ============================================================
/*
- Carry the key prefix down. A plain object is a container,
  anything else (including null and arrays) is a leaf here.
    Time  : O(n) over all keys   Space : O(d) recursion.
*/
function isPlainObject(value) {
  // typeof null is "object" and arrays are objects too - exclude both
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function flattenObject(input, prefix = "") {
  const result = {};

  for (const key of Object.keys(input)) {
    const value = input[key];
    // "a" at the top, "a.b" one level down
    const path = prefix === "" ? key : prefix + "." + key;

    if (isPlainObject(value)) {
      // merge whatever the deeper level produced
      Object.assign(result, flattenObject(value, path));
    } else {
      result[path] = value;
    }
  }

  return result;
}

// ============================================================
// 7) B) SUM ALL NUMBERS IN A NESTED STRUCTURE (SAME SHAPE)
// ============================================================
/*
- The same walk with a different action at the leaf. Once the
  shape is understood, every nested-structure question is this.
*/
function deepSum(value) {
  if (typeof value === "number") return value;

  if (Array.isArray(value)) {
    let total = 0;
    for (const item of value) total += deepSum(item);
    return total;
  }

  if (isPlainObject(value)) {
    let total = 0;
    for (const key of Object.keys(value)) total += deepSum(value[key]);
    return total;
  }

  // strings, null, booleans contribute nothing
  return 0;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(flatten([1, [2, [3, [4]], 5]])); // [1,2,3,4,5]
console.log(flatten([])); // []
console.log(flatten([[], [[]], 1])); // [1]
console.log(flattenDepth([1, [2, [3, [4]], 5]], 1)); // [1,2,[3,[4]],5]
console.log(flattenDepth([1, [2, [3, [4]], 5]], Infinity)); // [1,2,3,4,5]
console.log(flattenIterative([1, [2, [3, [4]], 5]])); // [1,2,3,4,5]

console.log(flattenObject({ a: { b: { c: 1 } }, d: 2 }));
// { 'a.b.c': 1, d: 2 }
console.log(flattenObject({ a: null, b: [1, 2] }));
// { a: null, b: [1,2] }   null and arrays are leaves here
console.log(deepSum([1, [2, { x: 3, y: [4] }], "skip", null])); // 10

/*
============================================================
8) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Time  : O(n) - every item at every level is touched once.
    Space : O(d) for the recursion depth, plus the output.
            The iterative version trades the call stack for an
            explicit stack, so deep nesting cannot crash it.
- THE BASE CASE IS A TYPE CHECK, NOT AN INDEX:
    "Is this a container?" is the whole decision. Everything else
    is bookkeeping.
- THE JS TRAPS I WOULD MENTION:
    typeof null === "object", arrays are objects, so
    Array.isArray and an explicit null check come first.
- WHY NOT JUST arr.flat(Infinity):
    In an interview the built-in is the thing being tested. I
    would name it, then write it by hand.
- CYCLES: if the structure can reference itself, add a WeakSet of
  seen containers, otherwise it recurses forever. Good thing to
  raise unprompted - it is a real production bug.
- FOLLOW-UPS:
    Flatten a nested iterator (LC 341 - the lazy version, next()
    and hasNext() with a stack), deep clone an object, deep
    equality, JSON.stringify by hand, and unflattening dotted
    keys back into a tree.
*/
