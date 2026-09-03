/*
Word Pattern (LC 290)

Does the string s follow the pattern? Each pattern letter must stand for
exactly one word, and each word for exactly one letter.

  pattern = "abba", s = "dog cat cat dog" -> true
  pattern = "abba", s = "dog cat cat fish"-> false  (a means dog, not fish)
  pattern = "aaaa", s = "dog cat cat dog" -> false  (a would mean 2 words)
  pattern = "abba", s = "dog dog dog dog" -> false  (a and b share dog)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- This is Isomorphic Strings (LC 205) with words on one side instead of
  characters. The rule is identical: the mapping must be a BIJECTION.
- So I need both directions:
    letter -> word   (a always means dog)
    word -> letter   (dog is always spoken by a)
- First split s on spaces. If the word count differs from the pattern
  length, it is already false.

- The ladder:
    1. one map, letter -> word only    O(n) but WRONG (misses "abba"/"dog dog dog dog")
    2. two maps, both directions       O(n) time, O(n) space
    3. two "last seen index" maps      O(n) time, O(n) space, integers only

- Traps:
    - length mismatch check must come first.
    - a single trailing space makes an empty word; split carefully.
    - do not mix letters and words in one map - "a" the letter and "a" the
      word would collide.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
TWO MAP view, pattern = "abba", s = "dog cat cat dog"

  words = ["dog","cat","cat","dog"]   length 4 == pattern length 4  OK

  i=0  a <-> dog   letterToWord = { a:dog }        wordToLetter = { dog:a }
  i=1  b <-> cat   letterToWord = { a:dog, b:cat } wordToLetter = { dog:a, cat:b }
  i=2  b <-> cat   letterToWord[b] = cat, matches "cat"   OK
                   wordToLetter[cat] = b, matches 'b'     OK
  i=3  a <-> dog   letterToWord[a] = dog, matches "dog"   OK
                   wordToLetter[dog] = a, matches 'a'     OK
  -> true

FALSE by forward map, pattern = "abba", s = "dog cat cat fish"

  i=3  a <-> fish  letterToWord[a] = dog, but the word here is "fish"
                                    dog != fish  -> false

FALSE by backward map, pattern = "abba", s = "dog dog dog dog"

  i=0  a <-> dog   letterToWord = { a:dog }   wordToLetter = { dog:a }
  i=1  b <-> dog   letterToWord has b? no.
                   wordToLetter has dog? YES -> 'a', but this letter is 'b'
                   two letters want the same word -> false
                           ^
                           a single forward map would happily allow this

FALSE by length, pattern = "aaaa", s = "dog cat cat dog"
  i=1  a <-> cat   letterToWord[a] = dog != cat -> false

  INVARIANT: after index i, the two maps are exact inverses of each other.
  Any step that would break that symmetry is rejected on the spot.
*/

// ============================================================
// 3) BRUTE FORCE - ONE MAP ONLY (AND WHY IT IS WRONG)
// ============================================================
/*
- Track letter -> word and nothing else.
    Time  : O(n)   Space : O(n)
- INCORRECT. Kept so I can name the counter example out loud.
*/
function wordPatternOneMapWrong(pattern, s) {
  const words = s.split(" ");
  if (pattern.length !== words.length) return false;

  const letterToWord = new Map();

  for (let i = 0; i < pattern.length; i++) {
    if (letterToWord.has(pattern[i])) {
      if (letterToWord.get(pattern[i]) !== words[i]) return false;
    } else {
      // nothing stops a second letter claiming the same word
      letterToWord.set(pattern[i], words[i]);
    }
  }

  return true;
}

// ============================================================
// 4) BETTER - TWO MAPS, BOTH DIRECTIONS (THE ONE TO WRITE)
// ============================================================
/*
- Forward makes it a function, backward makes it one-to-one.
    Time  : O(n) over total characters   Space : O(n)
*/
function wordPattern(pattern, s) {
  const words = s.split(" ");
  if (pattern.length !== words.length) return false;

  const letterToWord = new Map();
  const wordToLetter = new Map();

  for (let i = 0; i < pattern.length; i++) {
    const letter = pattern[i];
    const word = words[i];

    // this letter already means a different word
    if (letterToWord.has(letter) && letterToWord.get(letter) !== word) return false;

    // this word is already spoken by a different letter
    if (wordToLetter.has(word) && wordToLetter.get(word) !== letter) return false;

    letterToWord.set(letter, word);
    wordToLetter.set(word, letter);
  }

  return true;
}

// ============================================================
// 5) OPTIMAL - LAST SEEN POSITIONS, ONE COMPARISON PER STEP
// ============================================================
/*
- Same shape trick as LC 205: a bijection preserves the repeat rhythm, so
  the letter and the word must have been last seen at the same index.
    Time  : O(n)   Space : O(n)
- Not asymptotically faster, but it is one check instead of two and it
  generalises to any pair of sequences.
*/
function wordPatternShape(pattern, s) {
  const words = s.split(" ");
  if (pattern.length !== words.length) return false;

  // store position + 1 so that "missing" (undefined -> 0) is unambiguous
  const lastLetter = new Map();
  const lastWord = new Map();

  for (let i = 0; i < pattern.length; i++) {
    const seenLetterAt = lastLetter.get(pattern[i]) || 0;
    const seenWordAt = lastWord.get(words[i]) || 0;

    // the two sides must repeat at exactly the same rhythm
    if (seenLetterAt !== seenWordAt) return false;

    lastLetter.set(pattern[i], i + 1);
    lastWord.set(words[i], i + 1);
  }

  return true;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(wordPattern("abba", "dog cat cat dog")); // true
console.log(wordPattern("abba", "dog cat cat fish")); // false
console.log(wordPattern("aaaa", "dog cat cat dog")); // false
console.log(wordPattern("abba", "dog dog dog dog")); // false  backward trap
console.log(wordPattern("a", "dog")); // true   single
console.log(wordPattern("ab", "dog")); // false  length guard

console.log(wordPatternShape("abba", "dog cat cat dog")); // true
console.log(wordPatternShape("abba", "dog dog dog dog")); // false
console.log(wordPatternOneMapWrong("abba", "dog dog dog dog")); // true <- bug

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER (n = pattern length, total input size m):
    one map (wrong)   O(m) time, O(m) space
    two maps          O(m) time, O(m) space
    last-seen maps    O(m) time, O(m) space, one comparison per step
- WHY TWO DIRECTIONS:
    the pattern is a bijection, not just a function. "abba" against
    "dog dog dog dog" is the counter example that kills a single map.
- WHY THIS IS LC 205 IN DISGUISE:
    swap words for characters and the algorithm is unchanged. Saying that
    out loud shows pattern recognition, which is the point of the round.
- THE REAL TRAP:
    the length guard. Splitting first and comparing counts also protects
    against extra spaces producing empty words.
- FOLLOW-UPS:
    Isomorphic Strings (LC 205), Word Pattern II (LC 291, backtracking
    because the split is unknown), Find and Replace Pattern (LC 890).
*/
