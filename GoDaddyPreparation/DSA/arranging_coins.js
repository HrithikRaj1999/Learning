/*
Arranging Coins (LC 441)   [Q2.6.6]

n coins, build a staircase: row 1 has 1 coin, row 2 has 2, row k
has k. Return how many rows are COMPLETE.

  n = 5  -> 2   (rows 1 and 2 are full, 2 coins left over)
  n = 8  -> 3   (1+2+3 = 6, 2 left over)
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- k complete rows need 1+2+...+k coins = k(k+1)/2. Nothing else.
- So the question is: what is the biggest k with k(k+1)/2 <= n?

- Three ways, and they are exactly the "brute -> better -> best"
  ladder the interviewer wants:
      1. subtract 1, then 2, then 3... until you run out   O(sqrt n)
      2. binary search k between 1 and n                   O(log n)
      3. solve the quadratic directly                      O(1)
         k(k+1)/2 <= n  ->  k = floor((-1 + sqrt(1 + 8n)) / 2)

- Careful with overflow: 8*n and k*(k+1) blow past 32-bit ints in
  Java/C++. Use long. In JS numbers are safe up to 2^53.
- Careful with sqrt: floating point can be off by one, so verify
  the answer and step back if needed.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
n = 8

  row 1   O            uses 1, total 1, left 7
  row 2   O O          uses 2, total 3, left 5
  row 3   O O O        uses 3, total 6, left 2
  row 4   O O O ?      needs 4, only 2 left -> INCOMPLETE

  answer 3

BINARY SEARCH view, n = 8. Test k, cost = k(k+1)/2:

  k     1  2  3  4  5
  cost  1  3  6 10 15
        ^--------^
        fits      too big

  low=1 high=8   mid=4 cost 10 > 8 -> high = 3
  low=1 high=3   mid=2 cost  3 <= 8 -> answer 2, low = 3
  low=3 high=3   mid=3 cost  6 <= 8 -> answer 3, low = 4
  low > high -> stop, answer 3

  The pattern "true true true false false" is what makes binary
  search legal here - it is monotonic.

FORMULA view:
  k(k+1)/2 <= n
  k^2 + k - 2n <= 0
  k = (-1 + sqrt(1 + 8n)) / 2 , floored
  n = 8 -> sqrt(65) = 8.06 -> (8.06 - 1)/2 = 3.53 -> 3  ✓
*/

// ============================================================
// 3) BRUTE FORCE - SUBTRACT ROW BY ROW
// ============================================================
/*
- Keep paying for the next row while you can afford it.
    Time  : O(sqrt n) - because rows grow, k is about sqrt(2n).
    Space : O(1)
- Perfectly fine to write first, then improve.
*/
function arrangeCoinsBrute(n) {
  let row = 1;
  let remaining = n;

  // can I still pay for a full row of `row` coins?
  while (remaining >= row) {
    remaining = remaining - row;
    row++;
  }

  // row is the first one we could NOT complete
  return row - 1;
}

// ============================================================
// 4) BETTER - BINARY SEARCH ON THE ANSWER
// ============================================================
/*
- The predicate "k rows fit" is monotonic: true, true, ..., false.
  That is exactly what binary search needs.
    Time  : O(log n)   Space : O(1)
*/
function arrangeCoinsBinary(n) {
  if (n === 0) return 0;

  let low = 1;
  let high = n;
  let answer = 0;

  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    // coins needed for `mid` complete rows
    const cost = (mid * (mid + 1)) / 2;

    if (cost <= n) {
      // mid rows fit - remember it and try for more
      answer = mid;
      low = mid + 1;
    } else {
      // too expensive, shrink
      high = mid - 1;
    }
  }

  return answer;
}

// ============================================================
// 5) OPTIMAL - THE QUADRATIC FORMULA, O(1)
// ============================================================
/*
- k = floor((-1 + sqrt(1 + 8n)) / 2)
- Then VERIFY, because Math.sqrt on a huge n can land just under
  the true value and cost one row.
    Time  : O(1)   Space : O(1)
*/
function arrangeCoins(n) {
  if (n === 0) return 0;

  let k = Math.floor((Math.sqrt(1 + 8 * n) - 1) / 2);

  // floating point safety net: step up if k+1 actually fits...
  while ((k + 1) * (k + 2) / 2 <= n) k++;
  // ...and step down if k itself does not
  while (k > 0 && (k * (k + 1)) / 2 > n) k--;

  return k;
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(arrangeCoins(5)); // 2
console.log(arrangeCoins(8)); // 3
console.log(arrangeCoins(1)); // 1
console.log(arrangeCoins(0)); // 0
console.log(arrangeCoins(6)); // 3   exactly full
console.log(arrangeCoins(1804289383)); // 60070

console.log(arrangeCoinsBrute(8)); // 3
console.log(arrangeCoinsBinary(8)); // 3
console.log(arrangeCoinsBinary(1804289383)); // 60070
console.log(arrangeCoinsBrute(6)); // 3

/*
============================================================
6) SAY OUT LOUD
============================================================
- COMPLEXITY LADDER (say all three):
    subtract loop   O(sqrt n) time, O(1) space
    binary search   O(log n)  time, O(1) space
    formula         O(1)      time, O(1) space
- WHY THE LOOP IS O(sqrt n), NOT O(n):
    k rows cost k(k+1)/2 coins, so k is about sqrt(2n). The loop
    runs k times, not n times. Interviewers like this observation.
- WHY BINARY SEARCH IS ALLOWED:
    "k rows fit" is monotonic - once it turns false it stays false.
    This is the "binary search on the answer" pattern, the same one
    behind Koko eating bananas and split array largest sum.
- OVERFLOW (the real trap in Java/C++):
    mid * (mid + 1) overflows int when n is near 2^31. Use long,
    or rewrite the test as mid <= (n / mid) style division.
- WHY I VERIFY THE SQRT:
    Math.sqrt is a double. For large n it can be a hair low and
    give k-1. The two small while loops cost nothing and make the
    answer exact - I would say I prefer binary search in an
    interview for exactly this reason.
- FOLLOW-UPS:
    sqrt(x) without the built-in (LC 69 - same binary search),
    valid perfect square (LC 367), and any "binary search the
    answer" question.
*/
