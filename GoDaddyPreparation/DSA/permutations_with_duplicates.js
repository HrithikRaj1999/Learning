/*
Permutations with Duplicates (LC 46 / 47)   [Q2.1.1]

Return every unique arrangement of the input.

  permute("aba") -> ["aab","aba","baa"]
  permute([1,1,2]) -> [[1,1,2],[1,2,1],[2,1,1]]

GoDaddy note: they want the FREQUENCY / used-array version, not the
swap version, and they will ask why the duplicate skip works.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- A permutation = fill n empty boxes, one item per box.
- At each box I try every item that is still free -> recursion tree.
- Take the item, go deeper, then PUT IT BACK (backtrack) and try next.
- Duplicates make the SAME branch twice. So first SORT the input.
  Now equal items sit together.
- Rule: from a group of equal items, always use the LEFT one first.
  Skip nums[i] if nums[i] === nums[i-1] and nums[i-1] is NOT used.
  "left twin not used" means I am starting a copy of an old branch.
- Answer size is n! so no algorithm can be fast. Just avoid the
  duplicate work.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
nums = [1,1,2] after sort. Call the two ones 1a and 1b.

box1 = 1a -> box2 = 1b -> box3 = 2   [1,1,2]  keep
box1 = 1a -> box2 = 2  -> box3 = 1b  [1,2,1]  keep
box1 = 1b -> ...                     SKIPPED
       ^ 1b === 1a and 1a is not used -> this whole subtree is a
         copy of the 1a subtree
box1 = 2  -> box2 = 1a -> box3 = 1b  [2,1,1]  keep

Why "1a IS used" is fine:
  box1 = 1a, box2 = 1b  -> here 1a is used, so 1b is the second
  one in the SAME arrangement, not a repeat branch. Allowed.

used array walk for [1,1,2]:
  start           used = [F,F,F]  local = []
  pick i=0        used = [T,F,F]  local = [1]
  pick i=1        used = [T,T,F]  local = [1,1]
  pick i=2        used = [T,T,T]  local = [1,1,2]  -> push
  undo i=2        used = [T,T,F]  local = [1,1]
  undo i=1        used = [T,F,F]  local = [1]
*/

// ============================================================
// 3) BRUTE FORCE - PERMUTE THEN DEDUPE WITH A SET
// ============================================================
/*
- Build every permutation ignoring duplicates, then throw the
  repeats away using a Set of joined strings.
- Works, but wastes time building copies, and interviewers here
  explicitly ask for no Set.
    Time  : O(n * n!)  Space : O(n * n!) for the set
*/
function permuteBrute(nums) {
  const seen = new Set();
  const result = [];
  const used = Array(nums.length).fill(false);
  const local = [];

  function recurse() {
    if (local.length === nums.length) {
      const key = local.join(",");
      // the Set is doing the dedupe work here
      if (!seen.has(key)) {
        seen.add(key);
        result.push([...local]);
      }
      return;
    }

    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      local.push(nums[i]);
      recurse();
      local.pop();
      used[i] = false;
    }
  }

  recurse();
  return result;
}

// ============================================================
// 4) OPTIMAL - SORT + USED ARRAY + SKIP RULE (NO SET)
// ============================================================
/*
- STEP 1: sort, so equal values are neighbours.
- STEP 2: keep a used[] flag per index.
- STEP 3: inside the loop, skip when
      nums[i] === nums[i-1] && !used[i-1]
  because the left twin is free, so this branch was already done.
- STEP 4: pick, recurse, then undo both the push and the flag.
    Time  : O(n * n!) - n! answers, each costs O(n) to copy.
    Space : O(n) recursion + used array (output not counted).
*/
function permuteUnique(nums) {
  // equal values must be neighbours for the skip rule to work
  const sorted = [...nums].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  const result = [];
  const used = Array(sorted.length).fill(false);
  const local = [];

  function recurse() {
    // all boxes filled, save a COPY (local keeps changing)
    if (local.length === sorted.length) {
      result.push([...local]);
      return;
    }

    for (let i = 0; i < sorted.length; i++) {
      // this item is already sitting in an earlier box
      if (used[i]) continue;

      // same value as my left twin, and the twin is free
      // -> that means I am repeating a branch already done
      if (i > 0 && sorted[i] === sorted[i - 1] && !used[i - 1]) continue;

      // choose
      used[i] = true;
      local.push(sorted[i]);

      recurse();

      // un-choose (backtrack) - both undos are needed
      local.pop();
      used[i] = false;
    }
  }

  recurse();
  return result;
}

// string wrapper, because the question was asked on "aba"
function permuteString(s) {
  return permuteUnique(s.split("")).map((chars) => chars.join(""));
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(permuteString("aba")); // [ 'aab', 'aba', 'baa' ]
console.log(permuteUnique([1, 1, 2])); // [ [1,1,2], [1,2,1], [2,1,1] ]
console.log(permuteUnique([1, 2, 3]).length); // 6
console.log(permuteUnique([1, 1, 1])); // [ [1,1,1] ]
console.log(permuteUnique([])); // [ [] ]
console.log(permuteBrute([1, 1, 2]).length); // 3

/*
============================================================
5) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Time  : O(n * n!). There are up to n! answers and copying each
            one costs O(n). Cannot be better - the output itself
            is that big.
    Space : O(n) for the recursion depth and used[], plus the
            output which I do not count.
- WHY NOT THE SWAP VERSION:
    Swapping breaks the sorted order mid-recursion, so the
    "left twin" rule stops being valid and you are forced back
    to a Set. Sorted + used[] keeps the invariant alive.
- WHY THE SKIP CONDITION IS !used[i-1] AND NOT used[i-1]:
    If the left twin is USED, I am deeper in the same branch and
    the two ones are simply in different boxes - that is a real
    new permutation. If the left twin is FREE, I am starting a
    fresh branch with the right twin first, which produces the
    exact same strings the left-twin branch already produced.
- SORT COST: O(n log n), invisible next to n!.
- FOLLOW-UPS:
    Subsets with duplicates (LC 90) uses the SAME skip line,
    Combination Sum 2 (LC 40), next permutation (LC 31),
    k-th permutation (LC 60) - that one is math, not recursion.
*/
