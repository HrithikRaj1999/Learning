/*
Letter Combinations of a Phone Number (LC 17)

Given a string of digits 2-9, return all letter combinations the
number could spell, using the old phone keypad.

  2 -> abc   3 -> def   4 -> ghi   5 -> jkl
  6 -> mno   7 -> pqrs  8 -> tuv   9 -> wxyz

  digits = "23"
  -> ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Order does not matter, but DFS naturally gives the sorted order.
*/

// ============================================================
// 1) IDEA (What I am thinking to tell interviewer)
// ============================================================
/*
- "Every digit is one decision layer: digit 0 picks the 1st letter,
   digit 1 picks the 2nd, and so on."
- "So this is a cartesian product = n nested for-loops. But n is
   only known at runtime, so I write it as recursion instead."
- "One shared array `path` holds the half-built word. Push a letter,
   recurse, pop it back. That push/recurse/pop is backtracking."
*/

// ============================================================
// 2) STEPS TO SOLVE & WHY
// ============================================================
/*
- STEP 1: if digits is empty, return [].
    WHY: there is no word of length 0 to spell. If I skip this the
    base case fires instantly and I return [""] instead of [].

- STEP 2: build KEYPAD, a map of digit -> its letters string.
    WHY: it turns "which letters can this digit be" into an O(1)
    lookup. Note 7 and 9 carry FOUR letters, and 0/1 carry none.

- STEP 3: keep two variables - `answer` (finished words) and
  `path` (letters chosen so far).
    WHY: one shared `path` avoids allocating a new array at every
    node of the recursion tree.

- STEP 4: write backtrack(index), where index = the digit I am
  currently deciding.
    WHY: index IS the depth of the recursion. Passing it as an
    argument (never mutating a shared cursor) is what makes each
    branch independent.

- STEP 5: base case - if index === digits.length, push
  path.join("") into answer and return.
    WHY: I have decided a letter for every digit, so the word is
    done. join() creates a NEW string, so later pops cannot corrupt
    what I already saved. Pushing `path` itself would store the
    same reference every time.

- STEP 6: otherwise loop over every letter of KEYPAD[digits[index]]
  and for each one: push it, call backtrack(index + 1), then pop it.
    WHY: the for-loop answers "which letter for THIS digit", the
    recursive call answers "now handle the REST of the digits", and
    the pop resets the prefix so the next letter starts clean.

- STEP 7: call backtrack(0) and return answer.
*/

// ============================================================
// 3) TIME & SPACE COMPLEXITY
// ============================================================
/*
    Time  : O(n * 4^n) - up to 4^n leaves, and O(n) to join each word.
    Space : O(n) recursion depth + O(n) path (output not counted).

    Nothing can beat this: the OUTPUT itself has 3^n to 4^n strings,
    so generating them all is the lower bound.
*/

// ============================================================
// 4) VISUAL DIAGRAM  -  digits = "23"
// ============================================================
/*
map: 2 -> "abc", 3 -> "def"

The recursion tree (index = which digit we are deciding):

  index 0, path = []                     <- deciding digit '2'
    |
    +-- pick 'a' -> path = [a]
    |     index 1, path = [a]            <- deciding digit '3'
    |       +-- pick 'd' -> [a,d] -> index 2 == len -> SAVE "ad" -> pop d
    |       +-- pick 'e' -> [a,e] -> index 2 == len -> SAVE "ae" -> pop e
    |       +-- pick 'f' -> [a,f] -> index 2 == len -> SAVE "af" -> pop f
    |     pop 'a'   (path back to [])
    |
    +-- pick 'b' -> path = [b]
    |       'd' -> SAVE "bd" ; 'e' -> SAVE "be" ; 'f' -> SAVE "bf"
    |     pop 'b'
    |
    +-- pick 'c' -> path = [c]
            'd' -> SAVE "cd" ; 'e' -> SAVE "ce" ; 'f' -> SAVE "cf"
          pop 'c'

Watch 'path' as a stack, step by step:

  step  action              path        answer
  ----  ------------------  ----------  --------------------
   1    push a              [a]         []
   2    push d              [a,d]       []
   3    base hit            [a,d]       ["ad"]
   4    pop  d              [a]         ["ad"]
   5    push e              [a,e]       ["ad"]
   6    base hit            [a,e]       ["ad","ae"]
   7    pop  e              [a]         ["ad","ae"]
   ...
  12    pop  a              []          ["ad","ae","af"]
  13    push b              [b]         ["ad","ae","af"]

Notice rows 4 and 12: the path SHRINKS back exactly one level each
time a for-loop iteration finishes. Without the pop, step 5 would
build [a,d,e] and every word after it would be garbage.
*/

// ============================================================
// 5) SKELETON
// ============================================================
/*
    letterCombinations(digits)
        KEYPAD                       - digit -> letters string
        answer     = []              - finished words
        path       = []              - letters chosen so far
        backtrack(index)             - decide the letter for digits[index]
        return answer
*/

// digit -> the letters printed under it on a phone keypad
const KEYPAD = {
  2: "abc",
  3: "def",
  4: "ghi",
  5: "jkl",
  6: "mno",
  7: "pqrs",
  8: "tuv",
  9: "wxyz",
};

function letterCombinations(digits) {
  // no digits means no word to spell, answer is empty (not [""])
  if (digits.length === 0) return [];

  const answer = [];
  // the half-built word, used as a stack of chosen letters
  const path = [];

  // decide which letter to use for the digit sitting at 'index'
  function backtrack(index) {
    // decided a letter for every digit, so the word is complete
    if (index === digits.length) {
      // join makes a fresh string, safe from later pops
      answer.push(path.join(""));
      return;
    }

    // the letters available for the current digit
    const letters = KEYPAD[digits[index]];

    // try every letter of this digit, one at a time
    for (let i = 0; i < letters.length; i++) {
      // choose
      path.push(letters[i]);
      // explore the remaining digits with this choice locked in
      backtrack(index + 1);
      // un-choose, so the next letter starts from a clean prefix
      path.pop();
    }
  }

  backtrack(0);
  return answer;
}

// ============================================================
// ALTERNATIVE - ITERATIVE (BFS / BUILD LAYER BY LAYER)
// ============================================================
/*
IDEA:
- "Same cartesian product, but I grow the answers in WIDTH instead
   of depth, so there is no recursion stack at all."

STEPS & WHY:
- STEP 1: start with words = [""].
    WHY: the first append loop needs something to append onto. An
    empty list would stay empty forever.
- STEP 2: for each digit, build a fresh nextWords by appending
  every letter of that digit to every word already in words.
    WHY: after digit k, the list holds every prefix of length k+1.
- STEP 3: replace words with nextWords and move to the next digit.
    WHY: the old layer is fully consumed, keeping it would duplicate
    shorter words in the final answer.

TIME & SPACE:
    Time  : O(n * 4^n)  same work, just reordered.
    Space : O(4^n) because the intermediate list is the output size.

Growth for "23":
    start          -> [""]
    after digit 2  -> ["a","b","c"]
    after digit 3  -> ["ad","ae","af","bd","be","bf","cd","ce","cf"]
*/
function letterCombinationsIterative(digits) {
  if (digits.length === 0) return [];

  // seed with one empty word so the first append has something to extend
  let words = [""];

  // process the digits left to right, one layer per digit
  for (let index = 0; index < digits.length; index++) {
    const letters = KEYPAD[digits[index]];
    const nextWords = [];

    // extend every word built so far with every letter of this digit
    for (let w = 0; w < words.length; w++) {
      for (let i = 0; i < letters.length; i++) {
        nextWords.push(words[w] + letters[i]);
      }
    }

    // the new layer completely replaces the old one
    words = nextWords;
  }

  return words;
}

// ============================================================
// QUICK CHECKS
// ============================================================
console.log(letterCombinations("23"));
// ["ad","ae","af","bd","be","bf","cd","ce","cf"]

console.log(letterCombinations(""));
// []

console.log(letterCombinations("7"));
// ["p","q","r","s"]

console.log(letterCombinationsIterative("23"));
// ["ad","ae","af","bd","be","bf","cd","ce","cf"]

// ============================================================
// 6) SAY OUT LOUD
// ============================================================
/*
- "This is a cartesian product, so the output size itself is
   3^n to 4^n. No algorithm can beat that, we can only generate
   it cleanly."
- Time  O(n * 4^n), Space O(n) for the recursion (excluding output).
- Backtracking vs iterative: recursion reads closer to the decision
  tree and uses O(n) extra space; the iterative BFS avoids the call
  stack but holds a full intermediate layer, so it uses more memory.
- The three lines push / recurse / pop are the whole pattern. Same
  shape as Subsets, Permutations, Combination Sum and N-Queens.
- Follow-ups they usually ask:
  * "Filter the results against a dictionary" -> pass a Trie node
    down the recursion and prune the branch the moment the prefix
    is not in the Trie. That turns brute force into real pruning.
  * "What if digits contain 0 or 1?" -> they map to no letters, so
    either reject the input or skip them.
  * "Return them lazily" -> convert backtrack into a generator and
    yield instead of pushing, so memory stays O(n).
*/
