// ❌ MUTATION — functions mutate their arguments and shared state, causing
// spooky action at a distance.
export function addItem(cart: { items: string[] }, item: string) {
  cart.items.push(item); // mutates caller's object
  return cart;
}
export function applyDiscount(prices: number[], pct: number) {
  for (let i = 0; i < prices.length; i++) prices[i] *= 1 - pct; // mutates input array
  return prices;
}
const myCart = { items: ["a"] };
const other = addItem(myCart, "b");
console.log(myCart.items, other.items); // BOTH show ["a","b"] — same object!

const original = [100, 200];
applyDiscount(original, 0.1);
console.log(original); // original silently changed -> bug source
