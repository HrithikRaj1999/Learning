/*
Count Votes   [Q2.7.3]  (HackerRank screen)

Given a list of votes (names), return the winner, and also the
full tally sorted by count descending, name ascending on a tie.

  ["ram","shyam","ram","gita","ram","shyam"]
  tally  -> [ ["ram",3], ["shyam",2], ["gita",1] ]
  winner -> "ram"

Tie rule they usually add: if two names have the same count, the
alphabetically SMALLER name wins. Ask, do not assume.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- Three plain steps, nothing clever:
      1. COUNT   - Map name -> votes, one pass
      2. SORT    - by count descending; on a tie, name ascending
      3. ANSWER  - first entry is the winner

- Map, not a plain object: a Map keeps any key safely (a voter
  named "constructor" or "__proto__" breaks a plain object) and
  it keeps insertion order.

- The comparator is the part they actually grade:
      b.count - a.count        -> bigger count first
      if equal, a.name < b.name -> alphabetical
  Returning a boolean from a comparator is the classic bug -
  it must return a NUMBER.

- If ONLY the winner is needed, skip the sort: one pass over the
  counts keeping the best so far. O(n) instead of O(n log n).
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
votes = ["ram","shyam","ram","gita","ram","shyam"]

STEP 1 - count
   ram    | | |     3
   shyam  | |       2
   gita   |         1

  Map { ram -> 3, shyam -> 2, gita -> 1 }

STEP 2 - to pairs, then sort
  [ ["ram",3], ["shyam",2], ["gita",1] ]   already in order here

TIE EXAMPLE, votes = ["b","a","b","a"]
  counts  a -> 2 , b -> 2
  sort by count : equal
  tie break by name ascending : "a" before "b"
  winner "a"

  WRONG comparator (count only) would leave insertion order and
  hand back "b". This is exactly the case they test.

STEP 3 - winner = pairs[0][0]
*/

// ============================================================
// 3) BRUTE FORCE - COUNT EACH NAME BY RESCANNING
// ============================================================
/*
- For every distinct name, walk the whole list again.
    Time  : O(n^2)   Space : O(k)
*/
function countVotesBrute(votes) {
  const names = [];
  for (const vote of votes) {
    if (!names.includes(vote)) names.push(vote);
  }

  const tally = [];
  for (const name of names) {
    let count = 0;
    for (const vote of votes) {
      if (vote === name) count++;
    }
    tally.push([name, count]);
  }

  return tally;
}

// ============================================================
// 4) OPTIMAL - MAP + ONE SORT
// ============================================================
/*
- STEP 1: one pass to count.       O(n)
- STEP 2: sort the k distinct names. O(k log k)
    Time  : O(n + k log k)   Space : O(k)
*/
function tallyVotes(votes) {
  const counts = new Map();

  // STEP 1 - count every vote
  for (const vote of votes) {
    counts.set(vote, (counts.get(vote) || 0) + 1);
  }

  // STEP 2 - Map -> array of [name, count] pairs so it can be sorted
  const pairs = [...counts.entries()];

  pairs.sort((a, b) => {
    // most votes first
    if (b[1] !== a[1]) return b[1] - a[1];
    // same count -> alphabetical, and the comparator must return
    // a NUMBER, never a boolean
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  });

  return pairs;
}

function findWinner(votes) {
  const pairs = tallyVotes(votes);
  // empty election has no winner
  return pairs.length > 0 ? pairs[0][0] : null;
}

// ============================================================
// 5) WINNER ONLY - NO SORT NEEDED, O(n)
// ============================================================
/*
- Track the best as I go. Cheaper when the full ranking is not
  asked for.
    Time  : O(n)   Space : O(k)
*/
function findWinnerNoSort(votes) {
  const counts = new Map();
  for (const vote of votes) {
    counts.set(vote, (counts.get(vote) || 0) + 1);
  }

  let bestName = null;
  let bestCount = 0;

  for (const [name, count] of counts) {
    // strictly more votes wins outright
    if (count > bestCount) {
      bestName = name;
      bestCount = count;
      continue;
    }

    // same votes -> the alphabetically smaller name wins
    if (count === bestCount && bestName !== null && name < bestName) {
      bestName = name;
    }
  }

  return bestName;
}

// ============================================================
// 6) VARIANT - TOP N CANDIDATES
// ============================================================
/*
- Same tally, just slice. If n is small and k is huge, a size-n
  heap would be O(k log n) instead of O(k log k) - mention it.
*/
function topCandidates(votes, n) {
  return tallyVotes(votes).slice(0, n);
}

// ============================================================
// QUICK CHECK
// ============================================================
const votes = ["ram", "shyam", "ram", "gita", "ram", "shyam"];

console.log(tallyVotes(votes));
// [ ['ram',3], ['shyam',2], ['gita',1] ]
console.log(findWinner(votes)); // 'ram'
console.log(findWinner(["b", "a", "b", "a"])); // 'a'   (tie -> alphabetical)
console.log(findWinnerNoSort(["b", "a", "b", "a"])); // 'a'
console.log(findWinner([])); // null
console.log(findWinner(["solo"])); // 'solo'
console.log(topCandidates(votes, 2)); // [ ['ram',3], ['shyam',2] ]
console.log(countVotesBrute(["a", "b", "a"])); // [ ['a',2], ['b',1] ]

/*
============================================================
7) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Count : O(n) time, O(k) space, k = distinct candidates.
    Sort  : O(k log k). Total O(n + k log k).
    Winner only : O(n), no sort at all.
- ASK ABOUT THE TIE RULE FIRST:
    alphabetical? earliest vote? declare a draw? Each gives a
    different comparator, and the auto-graded tests always include
    a tie.
- COMPARATOR BUGS THEY LOOK FOR:
    returning true/false instead of a number, and sorting by count
    only (which silently leaves ties in hash order).
- WHY Map OVER A PLAIN OBJECT:
    keys like "constructor" or "__proto__" collide with Object
    prototype properties. A Map also preserves insertion order
    and takes non-string keys.
- SCALE FOLLOW-UP (they like this one):
    Millions of votes across many machines -> map-reduce: each
    node counts its shard, then merge the partial count maps.
    For the top N only, keep a size-N min heap per shard and
    merge the heaps. Mention streaming algorithms like
    Count-Min Sketch if they push on memory.
- FOLLOW-UPS:
    Top k frequent elements (LC 347), sort characters by
    frequency (LC 451), majority element (LC 169 - Boyer-Moore
    voting, O(1) space, a genuinely different trick).
*/
