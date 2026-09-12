/*
Simplify Path (LC 71)

Turn a Unix absolute path into its canonical form.
  "."   means stay here            -> ignore
  ".."  means go up one directory  -> pop
  "//"  or trailing "/"            -> collapse
The answer always starts with "/" and never ends with one (except "/").

  "/home/"          -> "/home"
  "/../"            -> "/"        (cannot go above root)
  "/home//foo/"     -> "/home/foo"
  "/a/./b/../../c/" -> "/c"
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Split the path on "/". Every piece is one of four things:
      ""    from "//" or a trailing slash   -> skip
      "."   current directory               -> skip
      ".."  go up                           -> pop the stack (if any)
      name  a real directory                -> push
- That is literally a stack of directory names. Join with "/" at the end
  and prefix a "/".
- "Go up" from an empty stack is a no-op, because root has no parent. That
  single guard is what makes "/../" return "/".
- Note ".." and "." are only special as WHOLE segments. A directory named
  "..." or "..hidden" is an ordinary name and must be pushed.

- The ladder:
    1. repeatedly regex-replace "/x/../" until nothing changes   O(n^2)
    2. split on "/", stack of names                              O(n) time,
                                                                 O(n) space
    3. one pass over the characters, no split allocation          O(n) time,
                                                                  O(n) output

- Traps:
    - "..." is a valid directory name, not two dots plus one.
    - popping an empty stack must be silently ignored, not an error.
    - the result "/" when the stack ends empty.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
STACK view, path = "/a/./b/../../c/"

  split on "/"  ->  ["", "a", ".", "b", "..", "..", "c", ""]
                     ^                                    ^
                     leading slash gives an empty piece    trailing slash too

  stack = []

  ""    empty piece      -> skip                stack = []
  "a"   real name        -> push                stack = ["a"]
  "."   current dir      -> skip                stack = ["a"]
  "b"   real name        -> push                stack = ["a","b"]
  ".."  go up            -> pop "b"             stack = ["a"]
  ".."  go up            -> pop "a"             stack = []
  "c"   real name        -> push                stack = ["c"]
  ""    empty piece      -> skip                stack = ["c"]

  join  ->  "/" + "c"  ->  "/c"

  INVARIANT: the stack always holds the directory names of the current
  location, outermost first. It can never contain "." or "..".

ROOT GUARD, path = "/../"

  split -> ["", "..", ""]

  ""    skip                     stack = []
  ".."  pop, but stack is EMPTY -> do nothing
                 ^
                 root has no parent, so this is silently ignored
  ""    skip                     stack = []

  stack is empty -> the answer is "/"

COLLAPSE SLASHES, path = "/home//foo/"

  split -> ["", "home", "", "foo", ""]
                          ^
                          the double slash produced an empty piece
  ""      skip
  "home"  push        stack = ["home"]
  ""      skip                        <- the collapse happens for free
  "foo"   push        stack = ["home","foo"]
  ""      skip

  join -> "/home/foo"

THE NAME TRAP, path = "/.../a"

  split -> ["", "...", "a"]
  "..."  is NOT ".." - it is an ordinary directory name -> push
  stack = ["...", "a"]   ->  "/.../a"

  Comparing whole segments (not counting dots) is what gets this right.
*/

// ============================================================
// 3) BRUTE FORCE - REPEATED REGEX REWRITING
// ============================================================
/*
- Keep replacing "/something/../" with "/" until the string stops changing,
  then clean up "." and duplicate slashes.
    Time  : O(n^2) in the worst case, each pass rebuilds the string
    Space : O(n)
- It works, but it is fragile and slow. Say it, then switch to the stack.
*/
function simplifyPathRewrite(path) {
  if (path.length === 0) return "/";

  let result = path;

  // collapse runs of slashes and drop "." segments first
  result = result.replace(/\/+/g, "/");
  result = result.replace(/\/\.(?=\/|$)/g, "");

  // then keep cancelling "name/.." pairs until none remain
  let previous = "";
  while (previous !== result) {
    previous = result;
    result = result.replace(/\/[^/]+\/\.\.(?=\/|$)/, "");
  }

  // any ".." left over is trying to climb above root - drop it
  result = result.replace(/^(\/\.\.)+/, "");

  // strip a trailing slash, but never turn the answer into ""
  if (result.length > 1 && result[result.length - 1] === "/") {
    result = result.slice(0, result.length - 1);
  }

  return result.length === 0 ? "/" : result;
}

// ============================================================
// 4) OPTIMAL - SPLIT AND USE A STACK (THE ONE TO WRITE)
// ============================================================
/*
- Split on "/", then push real names and pop on "..".
    Time  : O(n)   Space : O(n)
- Short, obviously correct, and every rule maps to one branch.
*/
const CURRENT_DIR = ".";
const PARENT_DIR = "..";
const SEPARATOR = "/";

function simplifyPath(path) {
  if (path.length === 0) return SEPARATOR;

  const segments = path.split(SEPARATOR);
  const stack = [];

  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];

    // "//" and a trailing slash both produce empty segments
    if (segment.length === 0 || segment === CURRENT_DIR) continue;

    if (segment === PARENT_DIR) {
      // root has no parent, so climbing from empty is a silent no-op
      if (stack.length > 0) stack.pop();
      continue;
    }

    stack.push(segment);
  }

  // an empty stack means we ended at root
  return SEPARATOR + stack.join(SEPARATOR);
}

// ============================================================
// 5) BEST - ONE PASS, NO SPLIT ALLOCATION
// ============================================================
/*
- Walk the characters, cutting out one segment at a time between slashes.
  Same stack, but no intermediate array of every segment.
    Time  : O(n)   Space : O(n) for the stack only
- Matters when the path is huge, and it shows I can parse without split().
*/
function simplifyPathScan(path) {
  if (path.length === 0) return SEPARATOR;

  const stack = [];
  let i = 0;

  while (i < path.length) {
    // step over any run of slashes
    while (i < path.length && path[i] === SEPARATOR) i++;
    if (i >= path.length) break;

    // read one whole segment
    const start = i;
    while (i < path.length && path[i] !== SEPARATOR) i++;
    const segment = path.slice(start, i);

    if (segment === CURRENT_DIR) continue;

    if (segment === PARENT_DIR) {
      if (stack.length > 0) stack.pop();
      continue;
    }

    stack.push(segment);
  }

  return SEPARATOR + stack.join(SEPARATOR);
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(simplifyPath("/home/")); // "/home"
console.log(simplifyPath("/../")); // "/"      cannot pass root
console.log(simplifyPath("/home//foo/")); // "/home/foo"
console.log(simplifyPath("/a/./b/../../c/")); // "/c"
console.log(simplifyPath("/")); // "/"
console.log(simplifyPath("/...")); // "/..."   valid name
console.log(simplifyPath("/a/../../b/../c//.//")); // "/c"
console.log(simplifyPath("/a//b////c/d//././/..")); // "/a/b/c"

console.log(simplifyPathScan("/a/./b/../../c/")); // "/c"
console.log(simplifyPathScan("/...")); // "/..."
console.log(simplifyPathScan("/../")); // "/"
console.log(simplifyPathRewrite("/a/./b/../../c/")); // "/c"
console.log(simplifyPathRewrite("/home//foo/")); // "/home/foo"

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY:
    regex rewriting  O(n^2) worst case, rebuilds the string each pass
    split + stack    O(n) time, O(n) space
    scan + stack     O(n) time, O(n) for the stack only
- WHY A STACK:
    ".." undoes the most recent directory. Most recent first is a stack by
    definition, and every other segment type is either a push or a skip.
- THE FOUR SEGMENT TYPES:
    empty (from "//" or a trailing slash) -> skip
    "."   -> skip
    ".."  -> pop if possible
    name  -> push
  Naming these four up front makes the code write itself.
- THE ROOT GUARD:
    popping an empty stack is a silent no-op, not an error. That is exactly
    what makes "/../" return "/" instead of crashing.
- THE REAL TRAP:
    "..." and "..hidden" are ordinary directory names. Comparing whole
    segments avoids this; counting dots does not.
- WHAT I WOULD ASK:
    "absolute paths only?" The problem guarantees a leading "/", which is
    why I can always prefix one on the way out. Relative paths would need
    a leading ".." to survive on the stack.
- FOLLOW-UPS:
    Valid Parentheses (LC 20), Decode String (LC 394),
    Design File System (LC 1166), Longest Absolute File Path (LC 388).
*/
