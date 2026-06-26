// ❌ BAD FUNCTIONS — one giant function doing everything, many params, boolean
// flag args, side effects + return mixed, multiple levels of abstraction.
export function checkout(
  cart: any, user: any, applyDiscount: boolean, sendEmail: boolean,
  log: boolean, currency: string, taxRate: number,
): number {
  let total = 0;
  for (const i of cart.items) total += i.price * i.qty;     // low-level math
  if (applyDiscount) {                                       // flag arg drives behavior
    if (user.vip) total *= 0.8; else total *= 0.95;
  }
  total += total * taxRate;                                  // tax mixed in
  if (log) console.log("charged " + total + currency);      // side effect
  if (sendEmail) console.log("email sent to " + user.email);// another side effect
  cart.items = [];                                           // mutates input!
  return total;
}
