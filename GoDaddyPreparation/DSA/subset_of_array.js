/*
Subsets / Power Set (LC 78)   [Q2.1.9]

Return every possible subset of a list of DISTINCT numbers.

  [1,2,3] -> [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3]
  n items -> 2^n subsets, always.

Follow-up they add: what if the input has duplicates? (LC 90)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- For each element there are exactly 2 choices: TAKE it or LEAVE it.
- n elements, 2 choices each -> 2^n subsets. That is the answer size,
  so no solution can be faster than 2^n.

- Recursion on index:
      at index i -> take nums[i], recurse i+1
                 -> leave nums[i], recurse i+1
      at i === n -> the local list is one finished subset, save a COPY.

- Take/leave must UNDO the push (pop) before trying the other branch.
  Forgetting the pop is the classic bug.

- Same idea without recursion: the binary number 0..2^n-1. Bit j on
  means "take nums[j]".
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
nums = [1,2,3], recursion tree (L = leave, T = take)

                     []
             T/               \L
           [1]                  []
        T/     \L            T/    \L
     [1,2]     [1]        [2]        []
     T/ \L     T/ \L      T/ \L      T/ \L
 [1,2,3][1,2][1,3][1]  [2,3][2]   [3]   []

8 leaves = 2^3 subsets.

BIT VIEW, same 8 answers:

  mask  binary   picked
   0     000     []
   1     001     [1]
   2     010     [2]
   3     011     [1,2]
   4     100     [3]
   5     101     [1,3]
   6     110     [2,3]
   7     111     [1,2,3]

  bit 0 -> nums[0], bit 1 -> nums[1], bit 2 -> nums[2]
*/

// ============================================================
// 3) OPTIMAL A - TAKE / LEAVE RECURSION
// ============================================================
/*
    Time  : O(n * 2^n) - 2^n subsets, each costs O(n) to copy.
    Space : O(n) recursion depth (output not counted).
*/
function subsets(nums) {
  const answer = [];

  function recurse(index, local) {
    // no elements left to decide on - local is a finished subset
    if (index === nums.length) {
      // COPY, because local keeps mutating after this line
      answer.push([...local]);
      return;
    }

    // branch 1: take nums[index]
    local.push(nums[index]);
    recurse(index + 1, local);

    // undo the take before trying the other branch
    local.pop();

    // branch 2: leave nums[index]
    recurse(index + 1, local);
  }

  recurse(0, []);
  return answer;
}

// ============================================================
// 4) OPTIMAL B - ITERATIVE, DOUBLE THE LIST EACH TIME
// ============================================================
/*
- Start with [[]]. For each number, copy every existing subset and
  add the number to the copy. The list doubles each round.
- No recursion, very easy to explain on a whiteboard.
    Time  : O(n * 2^n)   Space : output only.
*/
function subsetsIterative(nums) {
  let answer = [[]];

  for (let i = 0; i < nums.length; i++) {
    const grown = [];

    // every old subset also survives WITH the new number added
    for (let j = 0; j < answer.length; j++) {
      grown.push([...answer[j], nums[i]]);
    }

    answer = [...answer, ...grown];
  }

  return answer;
}

// ============================================================
// 5) OPTIMAL C - BITMASK (NO RECURSION, NO COPYING TRICKS)
// ============================================================
/*
- Loop mask from 0 to 2^n - 1. Bit j of the mask decides nums[j].
- Only works while n <= 31 in JS bit operations.
    Time  : O(n * 2^n)   Space : output only.
*/
function subsetsBitmask(nums) {
  const n = nums.length;
  const total = 1 << n; // 2^n
  const answer = [];

  for (let mask = 0; mask < total; mask++) {
    const local = [];

    for (let j = 0; j < n; j++) {
      // is bit j switched on in this mask?
      if ((mask & (1 << j)) !== 0) {
        local.push(nums[j]);
      }
    }

    answer.push(local);
  }

  return answer;
}

// ============================================================
// 6) FOLLOW-UP - SUBSETS WITH DUPLICATES (LC 90)
// ============================================================
/*
- Sort first, then at each level loop over the choices and skip a
  value equal to the previous one AT THE SAME LEVEL.
- Same skip idea as permutations with duplicates.
    Time  : O(n * 2^n)   Space : O(n) recursion.
*/
function subsetsWithDup(nums) {
  const sorted = [...nums].sort((a, b) => a - b);
  const answer = [];

  function recurse(start, local) {
    // every node of this tree is itself a valid subset
    answer.push([...local]);

    for (let i = start; i < sorted.length; i++) {
      // same value already tried at this level -> duplicate subset
      if (i > start && sorted[i] === sorted[i - 1]) continue;

      local.push(sorted[i]);
      recurse(i + 1, local);
      local.pop();
    }
  }

  recurse(0, []);
  return answer;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(subsets([1, 2, 3]));
// [ [1,2,3], [1,2], [1,3], [1], [2,3], [2], [3], [] ]
console.log(subsets([]).length); // 1  (just the empty subset)
console.log(subsets([1, 2]).length); // 4
console.log(subsetsIterative([1, 2, 3]).length); // 8
console.log(subsetsBitmask([1, 2, 3]).length); // 8
console.log(subsetsWithDup([1, 2, 2]));
// [ [], [1], [1,2], [1,2,2], [2], [2,2] ]

/*
============================================================
7) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Time  : O(n * 2^n). 2^n subsets and copying each costs O(n).
            Cannot beat it - the output alone is that size.
    Space : O(n) recursion depth, plus O(n * 2^n) for the output
            which I would not count against the algorithm.
- THREE WAYS, PICK ONE AND MENTION THE OTHERS:
    take/leave recursion, iterative doubling, bitmask. The bitmask
    version is the one to mention when they ask "without recursion".
- THE COPY BUG:
    push(local) instead of push([...local]) stores a REFERENCE.
    Every saved subset then ends up empty, because local is popped
    back to [] by the time the function returns.
- ORDER: no order is required, so the three versions output the
  same 2^n subsets in different sequences. Confirm that with them.
- DUPLICATES: sort, then skip `i > start && nums[i] === nums[i-1]`.
- FOLLOW-UPS:
    Combination sum (LC 39/40), combinations of size k (LC 77),
    palindrome partitioning (LC 131) - all the same take/leave
    skeleton with one extra condition.
*/
