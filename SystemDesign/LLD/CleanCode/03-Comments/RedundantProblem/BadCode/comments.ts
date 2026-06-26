// ❌ BAD COMMENTS — redundant, outdated, commented-out code, noise.

// This function adds two numbers
function add(a: number, b: number) {
  return a + b; // return the sum
}

// increment i by 1
let i = 0;
i = i + 1;

// TODO: fix this (added 2019, nobody knows what)
function process(data: any) {
  // const old = legacyTransform(data);  // dead code left to rot
  // if (old) return old;                // more dead code
  return data;
}

/* gets the user */
function getUser(id: string) {
  // returns user by subtracting... (comment LIES, code does lookup)
  return { id };
}
