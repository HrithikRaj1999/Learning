# Bit — Power & Arithmetic

| LC# | Diff | Question | Pattern | Companies |
|---|---|---|---|---|
| 231 | Easy | Power of Two | `x > 0 && (x & (x-1)) == 0` | Amazon, Google |
| 342 | Easy | Power of Four | Power of two + bit-position mask | Amazon |
| 201 | Medium | Bitwise AND of Numbers Range | Common prefix of range | Amazon, Google |
| 1009 | Easy | Complement of Base 10 Integer | Flip within bit length | Amazon |
| 371 | Medium | Sum of Two Integers | XOR sum + carry (`&<<1`) | Amazon, Google, Microsoft |

**Key skill**: add without `+` — `sum = a ^ b`, `carry = (a & b) << 1`, repeat until carry is 0 (LC 371).
