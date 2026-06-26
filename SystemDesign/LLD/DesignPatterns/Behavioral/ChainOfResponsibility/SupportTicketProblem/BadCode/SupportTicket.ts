// ❌ NO CHAIN OF RESPONSIBILITY — one giant if/else decides who handles a
// request. Adding a tier edits this method; ordering logic is hardcoded.

export function handleTicket(level: number, issue: string): string {
  if (level <= 1) {
    return "Bot handled: " + issue;
  } else if (level === 2) {
    return "Junior agent handled: " + issue;
  } else if (level === 3) {
    return "Senior agent handled: " + issue;
  } else if (level === 4) {
    return "Manager handled: " + issue;
  } else {
    return "Unhandled: " + issue; // grows with every new tier
  }
}
console.log(handleTicket(3, "refund dispute"));
