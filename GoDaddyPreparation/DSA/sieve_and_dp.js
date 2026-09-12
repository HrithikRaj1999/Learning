/*
Sieve of Eratosthenes + DP   [Q2.8 OA pattern, Sept 2025]

  A) Sieve: all primes up to n, in O(n log log n).
  B) The OA shape: a DP that uses the sieve, e.g.
     - count primes in a range (LC 204)
     - minimum number of PRIME numbers that add up to n
     - split a number into prime factors / smallest prime factor
*/

// ============================================================
// 1) INTUITION
// ============================================================
/*
SIEVE
- Checking each number one by one costs O(n sqrt n). Instead, do
  it the other way round: take each prime and CROSS OUT all its
  multiples. Every composite gets crossed by its factors.
- Start crossing at p*p, not 2p. Anything smaller (2p, 3p ... up
  to (p-1)p) was already crossed out by a smaller prime.
- Stop the outer loop at sqrt(n): a composite always has a factor
  <= its square root, so past that point nothing new is crossed.

DP ON TOP OF THE SIEVE
- Same shape as coin change, but the "coins" are the primes:
      fewest primes summing to n
      dp[0] = 0, dp[x] = 1 + min(dp[x - p]) over primes p <= x
- Precompute the primes ONCE with the sieve, then the DP is a
  plain two-loop table.

SMALLEST PRIME FACTOR (spf)
- One modified sieve stores, for every number, its smallest prime
  factor. After that, factorising any number takes O(log n)
  divisions instead of trial division. This is the version worth
  knowing for OA questions that factorise many numbers.
*/

// ============================================================
// 2) VISUAL EXAMPLE
// ============================================================
/*
SIEVE up to 30. Start: assume everything from 2 up is prime.

   2  3  4  5  6  7  8  9 10 11 12 ... 30

  p = 2, cross 4,6,8,10,...  (start at 2*2 = 4)
   2  3  X  5  X  7  X  9  X 11  X ...
  p = 3, cross 9,12,15,...   (start at 3*3 = 9, 6 already gone)
   2  3  X  5  X  7  X  X  X 11  X ...
  p = 4 -> already crossed, skip
  p = 5, cross 25,30         (start at 25; 10,15,20 already gone)
  p = 6 -> crossed
  p > sqrt(30) = 5.47 -> STOP

  primes 2 3 5 7 11 13 17 19 23 29

WHY START AT p*p:
  for p = 5, the multiples 10, 15, 20 have factors 2 and 3, so
  they were crossed out already. 25 is the first NEW one.

DP: fewest primes summing to n, primes [2,3,5,7,...]

  n     : 0  1  2  3  4  5  6  7  8  9 10
  dp    : 0  -  1  1  2  1  2  1  2  2  2
                ^  ^  ^
                2  3  2+2

  dp[9] : 9-2=7 -> 1+dp[7]=2      <- best
          9-3=6 -> 1+dp[6]=3
          9-5=4 -> 1+dp[4]=3
          9-7=2 -> 1+dp[2]=2
  dp[1] : impossible (no prime is <= 1) -> Infinity

SMALLEST PRIME FACTOR table up to 12

  n   :  2  3  4  5  6  7  8  9 10 11 12
  spf :  2  3  2  5  2  7  2  3  2 11  2

  factorise 12: spf 2 -> 6, spf 2 -> 3, spf 3 -> 1  => 2*2*3
*/

// ============================================================
// 3) BRUTE FORCE - TEST EACH NUMBER FOR PRIMALITY
// ============================================================
/*
- Check divisors up to sqrt(x) for every x.
    Time  : O(n sqrt n)   Space : O(1)
*/
function isPrime(x) {
  if (x < 2) return false;
  if (x % 2 === 0) return x === 2;

  // only odd divisors are left, and only up to sqrt(x)
  for (let d = 3; d * d <= x; d += 2) {
    if (x % d === 0) return false;
  }

  return true;
}

function primesBrute(n) {
  const primes = [];
  for (let x = 2; x <= n; x++) {
    if (isPrime(x)) primes.push(x);
  }
  return primes;
}

// ============================================================
// 4) OPTIMAL - SIEVE OF ERATOSTHENES
// ============================================================
/*
- STEP 1: a boolean array, everything assumed prime.
- STEP 2: 0 and 1 are not prime.
- STEP 3: for p from 2 while p*p <= n, cross out p*p, p*p+p, ...
- STEP 4: collect whatever survived.
    Time  : O(n log log n)   Space : O(n)
*/
function sieve(n) {
  if (n < 2) return [];

  // isComposite[i] = true means i is NOT prime
  const isComposite = new Array(n + 1).fill(false);

  for (let p = 2; p * p <= n; p++) {
    // p was already crossed out, so its multiples were too
    if (isComposite[p]) continue;

    // start at p*p - smaller multiples had a smaller factor
    for (let multiple = p * p; multiple <= n; multiple += p) {
      isComposite[multiple] = true;
    }
  }

  const primes = [];
  for (let x = 2; x <= n; x++) {
    if (!isComposite[x]) primes.push(x);
  }

  return primes;
}

function countPrimesBelow(n) {
  // LC 204 asks for primes strictly less than n
  return sieve(n - 1).length;
}

// ============================================================
// 5) SIEVE VARIANT - SMALLEST PRIME FACTOR, FAST FACTORISATION
// ============================================================
/*
- Build : O(n log log n)
- Factorise any x <= n afterwards in O(log x) divisions.
*/
function buildSmallestPrimeFactor(n) {
  // spf[i] starts as i, meaning "no smaller factor found yet"
  const spf = new Array(n + 1).fill(0);
  for (let i = 0; i <= n; i++) spf[i] = i;

  for (let p = 2; p * p <= n; p++) {
    // p is prime only if nothing smaller marked it
    if (spf[p] !== p) continue;

    for (let multiple = p * p; multiple <= n; multiple += p) {
      // keep the FIRST (smallest) prime that reaches this number
      if (spf[multiple] === multiple) spf[multiple] = p;
    }
  }

  return spf;
}

function factorise(x, spf) {
  const factors = [];

  // peel off the smallest prime factor until nothing is left
  while (x > 1) {
    factors.push(spf[x]);
    x = x / spf[x];
  }

  return factors;
}

// ============================================================
// 6) THE OA SHAPE - DP THAT USES THE SIEVE
// ============================================================
/*
- Fewest primes that add up to n. Coin change where the coins
  are the primes up to n.
    Time  : O(n log log n) for the sieve + O(n * primes) for the DP
    Space : O(n)
- Maths note: by Goldbach, every even number >= 4 is the sum of
  two primes, so the answer is never more than 3 for n >= 2.
  The DP still shows the general method, which is what is graded.
*/
function fewestPrimesSum(n) {
  if (n < 2) return -1;

  const primes = sieve(n);

  const dp = new Array(n + 1).fill(Infinity);
  // zero needs no primes
  dp[0] = 0;

  for (let value = 2; value <= n; value++) {
    for (const prime of primes) {
      // primes are sorted, so the rest are all too big
      if (prime > value) break;
      if (dp[value - prime] === Infinity) continue;

      const candidate = dp[value - prime] + 1;
      if (candidate < dp[value]) dp[value] = candidate;
    }
  }

  return dp[n] === Infinity ? -1 : dp[n];
}

// ============================================================
// QUICK CHECK
// ============================================================
console.log(sieve(30)); // [2,3,5,7,11,13,17,19,23,29]
console.log(sieve(1)); // []
console.log(sieve(2)); // [2]
console.log(countPrimesBelow(10)); // 4  (2,3,5,7)
console.log(primesBrute(30).length); // 10
console.log(isPrime(97)); // true
console.log(isPrime(1)); // false

const spf = buildSmallestPrimeFactor(100);
console.log(factorise(12, spf)); // [2,2,3]
console.log(factorise(97, spf)); // [97]
console.log(factorise(60, spf)); // [2,2,3,5]

console.log(fewestPrimesSum(2)); // 1
console.log(fewestPrimesSum(9)); // 2   (2+7)
console.log(fewestPrimesSum(11)); // 1
console.log(fewestPrimesSum(1)); // -1

/*
============================================================
7) SAY OUT LOUD
============================================================
- COMPLEXITY:
    Trial division for all n : O(n sqrt n)
    Sieve                    : O(n log log n) time, O(n) space
    The log log n comes from summing n/p over the primes p - I
    would say "close to linear" rather than derive it.
- THE TWO SIEVE DETAILS THEY PROBE:
    1. Start crossing at p*p, because every smaller multiple has
       an already-processed smaller factor.
    2. The outer loop only needs p*p <= n, because a composite
       always has a factor at or below its square root.
- MEMORY: a boolean array of n bytes. For very large n, a bitset
  cuts it by 8x, or use a segmented sieve to handle ranges that
  do not fit in memory. Name segmented sieve if they push.
- WHEN THE DP AND THE SIEVE COMBINE:
    Precompute the primes ONCE, then treat them as coins. Any
    "minimum number of X that sum to n" is coin change; the sieve
    is just how the coin list is produced.
- SMALLEST PRIME FACTOR is the version to use when MANY numbers
  must be factorised - O(log x) each after one sieve.
- FOLLOW-UPS:
    Count primes (LC 204), ugly number 2 (LC 264), perfect
    squares (LC 279 - identical DP with square coins), prime
    factorisation, and "distinct prime factors in a range".
*/
