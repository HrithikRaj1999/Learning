// ❌ MUTATION — a shared singleton state object mutated from many places; no
// trace of who changed what.
export const appState = { user: null as any, cart: [] as string[], theme: "light" };

export function login(name: string) { appState.user = name; }       // mutates global
export function addToCart(item: string) { appState.cart.push(item); } // mutates global array
export function reset() { appState.user = null; appState.cart.length = 0; } // in-place
login("Ada"); addToCart("book");
console.log(appState); // any module could have changed this; no history
