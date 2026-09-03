/*
Group Anagrams (LC 49)

Put strings that are anagrams of each other into the same group.
Return the list of groups, any order.

  ["eat","tea","tan","ate","nat","bat"]
    -> [["eat","tea","ate"], ["tan","nat"], ["bat"]]
  [""]   -> [[""]]
  ["a"]  -> [["a"]]
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Grouping means "same key goes in the same bucket". So the whole problem
  is: invent a KEY that is identical for anagrams and different otherwise.
- Two keys work:
    sorted string       "eat" -> "aet",  "tea" -> "aet"   same key
    letter count tuple  "eat" -> 1#0#0#...#1#...#1        same key
- Once I have the key, a Map does all the grouping in one pass.

- The ladder:
    1. compare every pair with an anagram check   O(n^2 * k)
    2. sorted-string key + Map                    O(n * k log k)
    3. count-tuple key + Map                      O(n * k)
       (k = length of the longest word)

- Traps:
    - the empty string is a valid group of its own, key "".
    - the count key must have separators, otherwise 1,11 and 11,1 collide.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SORTED KEY view, words = ["eat","tea","tan","ate","nat","bat"]

  "eat" -> sort -> "aet"   groups = { aet: ["eat"] }
  "tea" -> sort -> "aet"   groups = { aet: ["eat","tea"] }
  "tan" -> sort -> "ant"   groups = { aet: ["eat","tea"], ant: ["tan"] }
  "ate" -> sort -> "aet"   groups = { aet: ["eat","tea","ate"], ant: ["tan"] }
  "nat" -> sort -> "ant"   groups = { aet: [...3], ant: ["tan","nat"] }
  "bat" -> sort -> "abt"   groups = { aet: [...3], ant: [...2], abt: ["bat"] }

  answer = [["eat","tea","ate"], ["tan","nat"], ["bat"]]

  INVARIANT: the key is a CANONICAL FORM - every anagram collapses to the
  exact same string, so equality of keys IS the anagram test.

COUNT KEY view, "tan" and "nat"   (26 slots, showing only a,n,t)

  "tan":  a=1 n=1 t=1  -> key "1#0#0#...#1(n)...#1(t)#..."
  "nat":  a=1 n=1 t=1  -> same key

  Why the # separator matters:
    counts [1,11] joined with no separator -> "111"
    counts [11,1] joined with no separator -> "111"   COLLISION
    with #:  "1#11"  vs  "11#1"            -> different, safe
*/

// ============================================================
// 3) BRUTE FORCE - COMPARE EVERY PAIR
// ============================================================
/*
- For each word, look through the groups made so far and join the first
  group whose representative is an anagram of it.
    Time  : O(n^2 * k)   Space : O(n * k)
- Slow, but it shows I understand what "same group" means.
*/
function groupAnagramsBrute(strs) {
  if (strs.length === 0) return [];

  const groups = [];

  for (let i = 0; i < strs.length; i++) {
    let placed = false;

    for (let g = 0; g < groups.length; g++) {
      // one representative is enough - anagram is transitive
      if (isAnagram(groups[g][0], strs[i])) {
        groups[g].push(strs[i]);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([strs[i]]);
  }

  return groups;
}

function isAnagram(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = a.split("").sort().join("");
  const sortedB = b.split("").sort().join("");
  return sortedA === sortedB;
}

// ============================================================
// 4) BETTER - SORTED STRING AS THE MAP KEY
// ============================================================
/*
- One pass. Sorting each word gives its canonical form; the Map buckets it.
    Time  : O(n * k log k)   Space : O(n * k)
- This is the version most people write, and it is accepted.
*/
function groupAnagramsSorted(strs) {
  if (strs.length === 0) return [];

  // canonical key -> the words that share it
  const groups = new Map();

  for (let i = 0; i < strs.length; i++) {
    const key = strs[i].split("").sort().join("");

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(strs[i]);
  }

  return Array.from(groups.values());
}

// ============================================================
// 5) OPTIMAL - LETTER COUNT TUPLE AS THE KEY (THE ONE TO WRITE)
// ============================================================
/*
- Counting a word is O(k); sorting it is O(k log k). Same key power,
  cheaper to build.
    Time  : O(n * k)   Space : O(n * k)
*/
const ALPHABET_SIZE = 26;
const CODE_A = "a".charCodeAt(0);

function groupAnagrams(strs) {
  if (strs.length === 0) return [];

  const groups = new Map();

  for (let i = 0; i < strs.length; i++) {
    const counts = new Array(ALPHABET_SIZE).fill(0);

    for (let j = 0; j < strs[i].length; j++) {
      counts[strs[i].charCodeAt(j) - CODE_A]++;
    }

    // "#" keeps multi-digit counts from running together
    const key = counts.join("#");

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(strs[i]);
  }

  return Array.from(groups.values());
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]));
// [["eat","tea","ate"],["tan","nat"],["bat"]]
console.log(groupAnagrams([""])); // [[""]]
console.log(groupAnagrams(["a"])); // [["a"]]
console.log(groupAnagrams([])); // []   empty

console.log(groupAnagramsSorted(["eat", "tea", "tan", "ate", "nat", "bat"]));
console.log(groupAnagramsBrute(["eat", "tea", "tan"]));
// [["eat","tea"],["tan"]]

/*
============================================================
SAY OUT LOUD
============================================================
- COMPLEXITY LADDER (n words, longest length k):
    pairwise compare   O(n^2 * k) time, O(n*k) space
    sorted key         O(n * k log k) time, O(n*k) space
    count key          O(n * k) time, O(n*k) space
- WHY A CANONICAL KEY WORKS:
    anagram is an equivalence relation. A canonical form gives every class
    one name, so grouping becomes plain Map insertion - no comparisons.
- WHY COUNTING BEATS SORTING:
    sorting pays a log k factor per word for information I do not need -
    I only need the multiset, and counting reads it directly.
- THE REAL TRAP:
    the separator in the count key. Without it, [1,11] and [11,1] both
    become "111" and two different groups merge.
- FOLLOW-UPS:
    Valid Anagram (LC 242, the key test for two strings),
    Find All Anagrams in a String (LC 438, count key in a sliding window),
    Group Shifted Strings (LC 249, a different canonical key).
*/
