/*
Q3.5  Decimal Class from Scratch (Exact Money Math without Floats)

================================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
================================================================
- DATA STRUCTURE: Pair of `(unscaled: bigint, scale: number)`.
- WHY: Floating point numbers (`0.1 + 0.2 = 0.30000000000000004`) lose precision because binary cannot represent decimal fractions exactly.
  Money math must NEVER drift! Storing integer digits (`unscaled`) + decimal places (`scale`) allows exact integer arithmetic.

================================================================
2. INTUITION (What I am thinking to tell to interviewer)
================================================================
- "Floating point representation drifts. Financial applications require fixed-precision integer representation."
- "E.g., $12.34 is stored as `unscaled = 1234n`, `scale = 2` ($1234 / 10^2$)."
- "Addition / Subtraction: Align both numbers to the maximum scale first, then add/subtract BigInts."
- "Multiplication: Multiply unscaled BigInts, add scales (`scale1 + scale2`)."
- "Division: Floating division non-terminating (e.g. 10/3). Caller passes target scale; perform BigInt division with Round Half-Up."
- "Immutability: Every operation returns a NEW `Decimal` instance (thread-safe, safe from side effects)."

================================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
================================================================
- static of(text): Split string on `"."`. `unscaled = BigInt(whole + fraction)`, `scale = fraction.length`.
- add(other) / subtract(other):
    1. `targetScale = max(this.scale, other.scale)`.
    2. Convert both to `targetScale` using `this.at(targetScale)`.
    3. Return `new Decimal(unscaledA +/- unscaledB, targetScale)`.
- multiply(other):
    1. Multiply digits: `this.unscaled * other.unscaled`.
    2. Add scales: `this.scale + other.scale`.
- divide(other, targetScale):
    1. Adjust numerator: `this.unscaled * 10^(other.scale + targetScale)`.
    2. Adjust denominator: `other.unscaled * 10^(this.scale)`.
    3. `quotient = top / bottom`.
    4. Round Half-Up: If `(top % bottom) * 2 >= bottom`, increment quotient by 1.
- toString(): Pad left with zeros (`padStart(scale + 1, "0")`), insert decimal point at `-scale`.

SHORT SYNTAX TRICKS:
  10n ** BigInt(power)     // Clean power of 10 in BigInt
  (top % bottom) * 2n >= bottom // Integer check for Round Half-Up (>= 0.5)

================================================================
4. TIME & SPACE COMPLEXITY
================================================================
- TIME COMPLEXITY:
    - add() / subtract() / multiply() : O(1) BigInt arithmetic.
    - divide() : O(1) BigInt division + 1 remainder check.
- SPACE COMPLEXITY: O(1) immutable instances.

================================================================
5. VISUAL DIAGRAM
================================================================
Representation & Operations:

  Value      Unscaled    Scale    Formula
  12.34      1234n       2        1234 / 10^2
  1.25       125n        2        125  / 10^2
  0.5        5n          1        5    / 10^1

  ADD (12.5 + 1.25):
  Align scales to 2:
  12.5  -> 1250n (scale 2)
  1.25  ->  125n (scale 2)
  Sum = 1375n at scale 2 -> "13.75"

  MULTIPLY (1.5 * 1.5):
  15n * 15n = 225n
  Scale = 1 + 1 = 2 -> "2.25"

================================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
================================================================
- ALIGN SCALES BEFORE ADDING/SUBTRACTING: Adding $1234$ (scale 2) and $5$ (scale 1) without alignment adds cents to dimes!
- IMMUTABLE DESIGN: Class constructor is private; instances built exclusively via `Decimal.of()`.
- EQUALS VS COMPARE: $1.50$ and $1.5$ have different scales but EQUAL numerical values. `equals()` should call `compareTo() === 0`.
- DATABASE STORAGE: In SQL DBs, store money as `DECIMAL(19,4)` or `BIGINT` in smallest unit (e.g. cents), NEVER `FLOAT` or `DOUBLE`.
*/


const abs = (v: bigint): bigint => (v < 0n ? -v : v);
// bigint has a real power operator, so no loop is needed
const pow10 = (power: number): bigint => 10n ** BigInt(power);

export class Decimal {
  // unscaled = digits with no point
  // scale    = how many of them sit after the point
  private readonly unscaled: bigint;
  private readonly scale: number;

  // private, so a Decimal is always built through of()
  private constructor(unscaled: bigint, scale: number) {
    this.unscaled = unscaled;
    this.scale = scale;
  }

  // "12.34" -> unscaled 1234, scale 2. No dot means scale 0.
  static of(text: string): Decimal {
    const [whole, fraction = ""] = text.split(".");
    return new Decimal(BigInt(whole + fraction), fraction.length);
  }

  add(other: Decimal): Decimal {
    // both sides must count in the same unit first
    const s = Math.max(this.scale, other.scale);
    return new Decimal(this.at(s) + other.at(s), s);
  }

  subtract(other: Decimal): Decimal {
    const s = Math.max(this.scale, other.scale);
    return new Decimal(this.at(s) - other.at(s), s);
  }

  // 1.5 * 1.5 = 2.25, so the scales add up: 1 + 1 = 2
  multiply(other: Decimal): Decimal {
    const digits = this.unscaled * other.unscaled;
    return new Decimal(digits, this.scale + other.scale);
  }

  // no exact answer in general, so the caller picks the places
  divide(other: Decimal, scale: number): Decimal {
    if (other.unscaled === 0n) throw new Error("Divide by zero");
    const numerator = this.unscaled * pow10(other.scale + scale);
    const denominator = other.unscaled * pow10(this.scale);
    // round on positives, then put the sign back
    const isNegative = (numerator < 0n) !== (denominator < 0n);
    const top = abs(numerator);
    const bottom = abs(denominator);
    let quotient = top / bottom; // bigint division drops the rest
    // half up: half a step or more bumps the last digit
    if ((top % bottom) * 2n >= bottom) quotient++;
    return new Decimal(isNegative ? -quotient : quotient, scale);
  }

  compareTo(other: Decimal): number {
    const s = Math.max(this.scale, other.scale);
    const difference = this.at(s) - other.at(s);
    return difference < 0n ? -1 : difference > 0n ? 1 : 0;
  }

  // 1.50 and 1.5 are the same amount, so compare values
  equals(other: Decimal): boolean {
    return this.compareTo(other) === 0;
  }

  toString(): string {
    if (this.scale === 0) return `${this.unscaled}`;
    const sign = this.unscaled < 0n ? "-" : "";
    // padStart keeps a digit before the point: 5 -> "005"
    const all = abs(this.unscaled).toString();
    const digits = all.padStart(this.scale + 1, "0");
    const whole = digits.slice(0, -this.scale);
    return `${sign}${whole}.${digits.slice(-this.scale)}`;
  }

  // the same amount at a bigger scale: 1.5 at scale 3 = 1500
  private at(scale: number): bigint {
    return this.unscaled * pow10(scale - this.scale);
  }
}

// quick check
const d = Decimal.of;
console.log(0.1 + 0.2);                       // 0.30000000000000004
console.log(d("0.1").add(d("0.2")).toString());     // 0.3
console.log(d("12.34").multiply(d("3")).toString()); // 37.02
console.log(d("10").divide(d("3"), 4).toString());   // 3.3333
console.log(d("1.005").divide(d("1"), 2).toString()); // 1.01
console.log(d("1.50").equals(d("1.5")));             // true

/*
================================================================
5. SAY OUT LOUD
================================================================
- "Floats are binary fractions, so money must never be a
   float or a double. Store the smallest unit as an integer,
   paise or cents, or use BigDecimal."
- "Immutable by design. Every operation returns a new
   Decimal, so a shared amount cannot change under you."
- "Rounding has to be an explicit choice. I used HALF_UP.
   Finance often wants HALF_EVEN, banker's rounding, because
   HALF_UP leans upward over millions of rows. The rounding
   mode is a business rule, not a coding taste."
- "bigint keeps precision past 2^53. A number loses it."
- "In the database: DECIMAL(19,4), never FLOAT. And keep the
   currency next to the amount."
*/
