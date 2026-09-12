/*
Ransom Note (LC 383)

Can I build the string ransomNote using only the letters in magazine?
Each letter in magazine may be used at most once.

  note = "a",  magazine = "b"    -> false
  note = "aa", magazine = "ab"   -> false  (only one 'a' available)
  note = "aa", magazine = "aab"  -> true
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- This is Valid Anagram, but ONE DIRECTIONAL. I do not need the counts to
  match; I need magazine >= note for every letter.
- So: count the magazine, then spend it letter by letter for the note.
  If any letter runs out, the answer is false.
- If the note is longer than the magazine, it is hopeless - free early exit.

- The ladder:
    1. for each note letter, scan the magazine and cross it out  O(n*m)
    2. count both, compare 26 slots                              O(n+m), O(1)
    3. count magazine only, decrement while walking the note,    O(n+m), O(1)
       bail the moment a letter hits zero

- Traps:
    - direction. countNote[i] <= countMagazine[i], never equality.
    - "cross it out" in the brute force needs a real deletion or a used[]
      array, otherwise one magazine letter gets reused.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SPEND view, note = "aa", magazine = "ab"

  count magazine:  a:1  b:1

  note 'a' -> have a = 1, 1 > 0, spend it, a = 1 - 1 = 0
  note 'a' -> have a = 0, nothing left -> return false
                       ^
                       this zero is the whole answer

TRUE case, note = "aa", magazine = "aab"

  count magazine:  a:2  b:1

  note 'a' -> a = 2 - 1 = 1
  note 'a' -> a = 1 - 1 = 0
  note finished, never went negative -> true

  INVARIANT: counts[c] is always "how many c's are still unspent".
  Leftovers (here b:1) are fine - the magazine may be bigger than the note.

FALSE-BY-LETTER case, note = "a", magazine = "b"

  count magazine:  b:1        a is 0
  note 'a' -> a = 0 -> false
*/

// ============================================================
// 3) BRUTE FORCE - SCAN AND CROSS OUT
// ============================================================
/*
- For each note letter, walk the magazine looking for an unused copy and
  mark it used.
    Time  : O(n * m)   Space : O(m) for the used flags
- Correct, and it makes the "each letter used once" rule very obvious.
*/
function canConstructBrute(ransomNote, magazine) {
  if (ransomNote.length > magazine.length) return false;

  // used[j] = true once magazine[j] has been spent
  const used = new Array(magazine.length).fill(false);

  for (let i = 0; i < ransomNote.length; i++) {
    let found = false;

    for (let j = 0; j < magazine.length; j++) {
      if (!used[j] && magazine[j] === ransomNote[i]) {
        // claim this copy so it cannot be reused
        used[j] = true;
        found = true;
        break;
      }
    }

    if (!found) return false;
  }

  return true;
}

// ============================================================
// 4) BETTER - TWO COUNT TABLES
// ============================================================
/*
- Count both strings, then check every letter satisfies note <= magazine.
    Time  : O(n + m)   Space : O(1)   (26 slots)
- Clear, but it counts the whole note even when the first letter fails.
*/
const ALPHABET_SIZE = 26;
const CODE_A = "a".charCodeAt(0);

function canConstructTwoTables(ransomNote, magazine) {
  if (ransomNote.length > magazine.length) return false;

  const noteCount = new Array(ALPHABET_SIZE).fill(0);
  const magCount = new Array(ALPHABET_SIZE).fill(0);

  for (let i = 0; i < ransomNote.length; i++) {
    noteCount[ransomNote.charCodeAt(i) - CODE_A]++;
  }
  for (let i = 0; i < magazine.length; i++) {
    magCount[magazine.charCodeAt(i) - CODE_A]++;
  }

  for (let i = 0; i < ALPHABET_SIZE; i++) {
    // the magazine must cover the note - inequality, not equality
    if (noteCount[i] > magCount[i]) return false;
  }

  return true;
}

// ============================================================
// 5) OPTIMAL - COUNT THE MAGAZINE, SPEND IT (THE ONE TO WRITE)
// ============================================================
/*
- One table. Fill it from the magazine, then decrement per note letter and
  bail the instant a letter is exhausted.
    Time  : O(n + m)   Space : O(1)
*/
function canConstruct(ransomNote, magazine) {
  if (ransomNote.length > magazine.length) return false;

  // how many of each letter are still available to spend
  const available = new Array(ALPHABET_SIZE).fill(0);

  for (let i = 0; i < magazine.length; i++) {
    available[magazine.charCodeAt(i) - CODE_A]++;
  }

  for (let i = 0; i < ransomNote.length; i++) {
    const slot = ransomNote.charCodeAt(i) - CODE_A;

    // this letter is used up, so the note can never be finished
    if (available[slot] === 0) return false;

    available[slot]--;
  }

  return true;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(canConstruct("a", "b")); // false
console.log(canConstruct("aa", "ab")); // false
console.log(canConstruct("aa", "aab")); // true
console.log(canConstruct("", "anything")); // true   empty note
console.log(canConstruct("abc", "")); // false  empty magazine

console.log(canConstructBrute("aa", "aab")); // true
console.log(canConstructBrute("aa", "ab")); // false
console.log(canConstructTwoTables("a", "b")); // false
console.log(canConstructTwoTables("aa", "aab")); // true

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER:
    scan and cross out   O(n*m) time, O(m) space
    two tables           O(n+m) time, O(1) space
    one table, spend it  O(n+m) time, O(1) space, early exit
- WHY COUNTING IS ENOUGH:
    order never matters here, only supply versus demand. That makes it a
    multiset containment test, which counts answer exactly.
- THE DIFFERENCE FROM VALID ANAGRAM:
    anagram needs counts EQUAL in both directions. Here I only need the
    magazine to cover the note - leftovers are allowed.
- THE REAL TRAP:
    the 26-slot array assumes lowercase a-z. State that assumption, and
    offer a Map if the input can be unicode.
- FOLLOW-UPS:
    Valid Anagram (LC 242), Find All Anagrams in a String (LC 438),
    Minimum Window Substring (LC 76, the same "cover the demand" idea
    inside a sliding window).
*/
