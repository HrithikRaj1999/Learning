/*
Q3.5  Decimal Class from Scratch (Exact Money Math)

============================================================
1. DATA STRUCTURE NEEDED & WHY (Simple Explanation)
============================================================
- DATA STRUCTURE:
    Pair of `(unscaled: bigint, scale: number)`.
- WHY WE NEED IT:
    Floating point numbers (`0.1 + 0.2 = 0.30000000000000004`)
    lose precision because binary cannot represent decimal
    fractions exactly. Money math must NEVER drift!
    Storing integer digits + decimal count enables exact
    BigInt integer arithmetic.

============================================================
2. INTUITION (What I am thinking to tell interviewer)
============================================================
- "Floating point binary representation drifts."
- "$12.34 is stored as `unscaled = 1234n`, `scale = 2`
   ($1234 / 10^2$)."
- "Add/Subtract: Align both to max scale first, then add."
- "Multiply: Multiply unscaled BigInts, add scales."
- "Divide: Non-terminating fractions (e.g. 10/3). Caller
   gives target scale; perform BigInt division with
   Round Half-Up."
- "Immutable: Operations return a NEW Decimal instance."

============================================================
3. STEPS TO SOLVE & ALGORITHM SKELETON (In Words)
============================================================
- static of(text): Split on `"."`. `unscaled = BigInt(w+f)`,
  `scale = fraction.length`.
- add(other) / subtract(other):
    1. `targetScale = max(this.scale, other.scale)`.
    2. Align scales: `this.at(targetScale)`.
    3. Return `new Decimal(unscaledA +/- unscaledB, scale)`.
- multiply(other):
    1. Multiply digits: `this.unscaled * other.unscaled`.
    2. Add scales: `this.scale + other.scale`.
- divide(other, targetScale):
    1. Adjust top: `this.unscaled * 10^(other.scale + target)`.
    2. Adjust bottom: `other.unscaled * 10^(this.scale)`.
    3. `quotient = top / bottom`.
    4. Round Half-Up: If `(top % bottom) * 2 >= bottom`,
       `quotient++`.
- toString(): Pad left (`padStart(scale + 1, "0")`), insert
  point at `-scale`.

SHORT SYNTAX TRICKS:
  10n ** BigInt(p)              // Power of 10 in BigInt
  (top % bottom) * 2n >= bottom // Half-up integer check

============================================================
4. TIME & SPACE COMPLEXITY
============================================================
- TIME COMPLEXITY:
    - add / subtract / multiply : O(1) BigInt math.
    - divide                   : O(1) BigInt division.
- SPACE COMPLEXITY:
    - O(1) immutable instances.

============================================================
5. VISUAL DIAGRAM
============================================================
Representation & Operations:

  Value      Unscaled    Scale    Formula
  12.34      1234n       2        1234 / 10^2
  1.25       125n        2        125  / 10^2

  ADD (12.5 + 1.25):
  Align scales to 2:
  12.5  -> 1250n (scale 2)
  1.25  ->  125n (scale 2)
  Sum = 1375n at scale 2 -> "13.75"

============================================================
6. KEY GOTCHAS & THINGS TO SAY OUT LOUD
============================================================
- ALIGN SCALES BEFORE ADD/SUBTRACT: Adding 1234 (scale 2)
  and 5 (scale 1) without alignment adds cents to dimes!
- IMMUTABLE DESIGN: Class constructor is private; built
  only via `Decimal.of()`.
- EQUALS VS COMPARE: 1.50 and 1.5 have different scales
  but equal numeric value. `equals` calls `compareTo === 0`.
- DATABASE STORAGE: Use `DECIMAL(19,4)` or `BIGINT` in cents.
  NEVER `FLOAT` or `DOUBLE` in financial DB schemas.
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

