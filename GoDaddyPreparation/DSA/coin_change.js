/*
Minimum Change / Coin Change (LC 322 + LC 518)   [Q2.7.6]

A) Fewest coins that add up to the amount. -1 if impossible.
   coins [1,2,5], amount 11 -> 3   (5+5+1)
B) Follow-up: HOW MANY ways to make the amount (LC 518)
   coins [1,2,5], amount 5 -> 4    (5 / 2+2+1 / 2+1+1+1 / 1x5)

Greedy (always take the biggest coin) is WRONG - say why.
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
- GREEDY FAILS: coins [1,3,4], amount 6.
      greedy: 4 + 1 + 1 = 3 coins
      best  : 3 + 3     = 2 coins
  So every combination must be considered -> DP.

- Think of it as climbing DOWN stairs: to reach amount A, I take
  one coin c and then I still have to solve A - c. Same problem,
  smaller number.
      best(A) = 1 + min over all coins c of best(A - c)

- Base cases:
      best(0) = 0   (zero coins make zero)
      A < 0 is impossible.

- Bottom-up: an array dp of size amount+1, filled with "infinity"
  meaning unreachable. dp[0] = 0. For every amount from 1 upward,
  try every coin.

- COUNTING VERSION (part B) uses the same table but ADDS, and the
  LOOP ORDER MATTERS:
      coins outside, amount inside -> counts COMBINATIONS (correct)
      amount outside, coins inside -> counts PERMUTATIONS
        (1+2 and 2+1 counted twice)
  This loop-order sentence is the whole point of LC 518.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
A) coins [1,2,5], amount 11, dp = fewest coins for each amount

  amount : 0  1  2  3  4  5  6  7  8  9 10 11
  dp     : 0  1  1  2  2  1  2  2  3  3  2  3
                                            ^ answer 3

  how dp[11] was filled:
     use coin 1 -> 1 + dp[10] = 1 + 2 = 3
     use coin 2 -> 1 + dp[9]  = 1 + 3 = 4
     use coin 5 -> 1 + dp[6]  = 1 + 2 = 3
     min = 3

  how dp[3] was filled:
     coin 1 -> 1 + dp[2] = 2
     coin 2 -> 1 + dp[1] = 2
     coin 5 -> too big, skip
     min = 2   (1+2)

WHY GREEDY IS WRONG, coins [1,3,4], amount 6

  greedy : 4, then 1, then 1  -> 3 coins
  dp     : 3, then 3          -> 2 coins
  Greedy only works for "canonical" coin systems like Indian or
  US currency. Never assume it.

B) COUNTING, coins [1,2,5], amount 5, ways[]

  start (only the empty way)        ways: 1 0 0 0 0 0
  after coin 1                      ways: 1 1 1 1 1 1
  after coin 2                      ways: 1 1 2 2 3 3
  after coin 5                      ways: 1 1 2 2 3 4
  amount:                                 0 1 2 3 4 5
                                                    ^ answer 4

  Coin 1 processed fully before coin 2 ever starts - that is what
  makes 1+2 and 2+1 count as the SAME combination.
*/

// ============================================================
// 3) BRUTE FORCE - PLAIN RECURSION
// ============================================================
/*
- Try every coin at every step.
    Time  : O(coins^amount)   Space : O(amount) stack.
*/
function coinChangeBrute(coins, amount) {
  function recurse(remaining) {
    // exact hit - no more coins needed
    if (remaining === 0) return 0;
    // overshot - this path is invalid
    if (remaining < 0) return Infinity;

    let best = Infinity;
    for (const coin of coins) {
      // take this coin, then solve the smaller amount
      const rest = recurse(remaining - coin);
      if (rest + 1 < best) best = rest + 1;
    }

    return best;
  }

  const answer = recurse(amount);
  return answer === Infinity ? -1 : answer;
}

// ============================================================
// 4) BETTER - MEMOISED RECURSION (TOP DOWN)
// ============================================================
/*
- Only `amount` distinct states exist, so cache them.
    Time  : O(amount * coins)   Space : O(amount) + stack.
*/
function coinChangeMemo(coins, amount) {
  // -1 means "not computed", because 0 is a real answer
  const memo = new Array(amount + 1).fill(-1);

  function recurse(remaining) {
    if (remaining === 0) return 0;
    if (remaining < 0) return Infinity;
    if (memo[remaining] !== -1) return memo[remaining];

    let best = Infinity;
    for (const coin of coins) {
      const rest = recurse(remaining - coin);
      if (rest + 1 < best) best = rest + 1;
    }

    memo[remaining] = best;
    return best;
  }

  const answer = recurse(amount);
  return answer === Infinity ? -1 : answer;
}

// ============================================================
// 5) OPTIMAL - BOTTOM UP TABLE (THE ONE TO WRITE)
// ============================================================
/*
- STEP 1: dp[a] = fewest coins for amount a. Size amount+1.
- STEP 2: fill with Infinity = unreachable, then dp[0] = 0.
- STEP 3: for each amount, try each coin that is not too big.
- STEP 4: dp[amount] still Infinity -> impossible -> -1.
    Time  : O(amount * number of coins)
    Space : O(amount)
*/
function coinChange(coins, amount) {
  // Infinity marks "cannot be made"; dp[0] = 0 is the base case
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let current = 1; current <= amount; current++) {
    for (const coin of coins) {
      // a coin bigger than the amount cannot be used here
      if (coin > current) continue;
      // unreachable sub-amount, adding a coin will not help
      if (dp[current - coin] === Infinity) continue;

      const withThisCoin = dp[current - coin] + 1;
      if (withThisCoin < dp[current]) dp[current] = withThisCoin;
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// ============================================================
// 6) WHICH COINS WERE USED (THE USUAL FOLLOW-UP)
// ============================================================
/*
- Remember the coin that produced each dp value, then walk back.
    Time  : O(amount * coins)   Space : O(amount)
*/
function coinChangeWithCoins(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  const chosen = new Array(amount + 1).fill(-1);
  dp[0] = 0;

  for (let current = 1; current <= amount; current++) {
    for (const coin of coins) {
      if (coin > current) continue;
      if (dp[current - coin] === Infinity) continue;

      if (dp[current - coin] + 1 < dp[current]) {
        dp[current] = dp[current - coin] + 1;
        // remember HOW this amount was reached
        chosen[current] = coin;
      }
    }
  }

  if (dp[amount] === Infinity) return { count: -1, coins: [] };

  // walk backwards through the choices
  const used = [];
  let remaining = amount;
  while (remaining > 0) {
    used.push(chosen[remaining]);
    remaining = remaining - chosen[remaining];
  }

  return { count: dp[amount], coins: used };
}

// ============================================================
// 7) FOLLOW-UP - COUNT THE COMBINATIONS (LC 518)
// ============================================================
/*
- ADD instead of MIN, and put the COIN loop on the OUTSIDE so
  each combination is counted once.
    Time  : O(amount * coins)   Space : O(amount)
*/
function coinChangeWays(coins, amount) {
  const ways = new Array(amount + 1).fill(0);
  // exactly one way to make 0: take nothing
  ways[0] = 1;

  // coins OUTSIDE -> combinations, not permutations
  for (const coin of coins) {
    for (let current = coin; current <= amount; current++) {
      ways[current] = ways[current] + ways[current - coin];
    }
  }

  return ways[amount];
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(coinChange([1, 2, 5], 11)); // 3
console.log(coinChange([1, 3, 4], 6)); // 2   (greedy would say 3)
console.log(coinChange([2], 3)); // -1
console.log(coinChange([1], 0)); // 0
console.log(coinChange([5, 10], 3)); // -1
console.log(coinChangeMemo([1, 2, 5], 11)); // 3
console.log(coinChangeBrute([1, 3, 4], 6)); // 2

console.log(coinChangeWithCoins([1, 3, 4], 6)); // { count: 2, coins: [3,3] }
console.log(coinChangeWays([1, 2, 5], 5)); // 4
console.log(coinChangeWays([2], 3)); // 0

/*
============================================================
8) SAY OUT LOUD
============================================================
- WHY NOT GREEDY (say this before writing any code):
    coins [1,3,4], amount 6. Greedy takes 4+1+1 = 3 coins, the
    real answer is 3+3 = 2. Greedy is only correct for canonical
    systems, so I use DP.
- COMPLEXITY:
    Brute  : O(c^amount) time.
    Memo   : O(amount * c) time, O(amount) space + stack.
    Table  : O(amount * c) time, O(amount) space, no stack.
    Note this is PSEUDO-polynomial - it depends on the VALUE of
    the amount, not just the input size. Naming that scores.
- INFINITY AS THE MARKER:
    It means "unreachable". Using 0 would be wrong because 0 is a
    real answer for amount 0, and using -1 breaks the min().
- LOOP ORDER FOR THE COUNTING VERSION:
    coins outside -> combinations. amount outside -> permutations
    (1+2 and 2+1 both counted). This single line is the entire
    difference between LC 518 and LC 377.
- UNBOUNDED VS 0/1:
    Coins can be reused, so this is the unbounded knapsack. If
    each coin could be used once it becomes 0/1 knapsack and the
    inner loop must run BACKWARDS.
- FOLLOW-UPS:
    Combination sum IV (LC 377), perfect squares (LC 279 - same
    table with square coins), 0/1 knapsack, and "which coins"
    reconstruction shown above.
*/
