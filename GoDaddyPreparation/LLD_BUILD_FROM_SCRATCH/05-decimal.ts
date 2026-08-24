/*
Q3.5  Decimal class, no wrapper classes

================================================================
1. INTUITION
================================================================
WHAT
  A money type that never drifts.

WHY NOT A FLOAT
  0.1 + 0.2 gives 0.30000000000000004.
  A float stores numbers in binary. 0.1 has no exact binary
  form, the same way 1/3 has no exact decimal form.
  Every step drifts a little. Money cannot drift.

HOW IT WORKS
  Money has a fixed number of decimal places. So I store a
  whole number of the smallest unit, plus how far the point
  moved.
      12.34  ->  unscaled 1234, scale 2
  Now + and - are plain integer maths. Nothing drifts.
  multiply : multiply the digits, add the scales.
  divide   : 10 / 3 never ends, so the caller gives me a
             scale and I round half up.

WHY BIGINT
  A plain number loses precision past 2^53. bigint does not.
  Also every method returns a NEW Decimal, so an amount can
  never be changed behind someone's back.

COST
  add / subtract / multiply : O(1) on the digits
  divide                    : O(1), plus one rounding check

================================================================
2. VISUAL EXAMPLE
================================================================
  value    unscaled  scale     meaning
  12.34      1234      2       1234 / 10^2
  0.05          5      2          5 / 10^2
  -1.5        -15      1        -15 / 10^1
  100         100      0        100 / 10^0

ADD 12.5 + 1.25
  scales differ, so line them up on the bigger one
  12.5  -> 125 at scale 1 -> 1250 at scale 2
  1.25  -> 125 at scale 2 ->  125
  1250 + 125 = 1375 at scale 2  ->  13.75

MULTIPLY 1.5 * 1.5
  15 * 15 = 225, and 1 + 1 = 2  ->  2.25

DIVIDE 10 / 3 at scale 4
  top    = 10 * 10^4 = 100000
  bottom = 3
  100000 / 3 = 33333, remainder 1
  round? 1 * 2 = 2 >= 3 ? no  ->  33333  ->  3.3333

ROUND HALF UP, 1.005 / 1 at scale 2
  top = 100500, bottom = 1000
  quotient 100, remainder 500
  round? 500 * 2 = 1000 >= 1000 ? yes -> 101 -> 1.01

================================================================
3. SKELETON
================================================================
  of(text)         "12.34" -> unscaled 1234, scale 2
  add / subtract   line up the scales, then integer + or -
  multiply         multiply digits, add scales
  divide(o, s)     caller gives the scale, round half up
  compareTo        compare at a common scale
  equals           compareTo === 0
  toString         put the point back in
  at(scale)        the same amount at a bigger scale

  SHORT SYNTAX
    10n ** BigInt(n)     powers of ten, no loop
    text.split(".")      with [whole, fraction = ""]
    padStart(s + 1,"0")  keeps a digit before the point
    a < 0n !== b < 0n    sign of a division, no branching

================================================================
4. GOTCHAS
================================================================
- LINE UP THE SCALES BEFORE ADDING, or you add paise to
  rupees.
- DIVIDE MUST TAKE A SCALE. 10 / 3 never ends, so there is
  no safe default.
- ROUND ON POSITIVE NUMBERS and put the sign back after, or
  negative values round the wrong way.
- toString MUST PAD. Unscaled 5 at scale 2 is "0.05", not
  "5.00" and not ".5".
- equals COMPARES VALUE, so 1.50 equals 1.5. In Java,
  BigDecimal.equals does NOT do that. It checks scale too,
  so you need compareTo. Nice detail to drop.
- THE CONSTRUCTOR IS PRIVATE, so a Decimal is built only
  through of() and is always valid.
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
