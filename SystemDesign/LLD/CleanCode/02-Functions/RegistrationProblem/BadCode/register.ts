// ❌ BAD FUNCTION — one mega function: validate + hash + save + email + log +
// analytics. 60+ lines of mixed abstraction levels.
export function registerUser(data: any): any {
  // validation
  if (!data.email || !data.email.includes("@")) throw new Error("bad email");
  if (!data.password || data.password.length < 8) throw new Error("weak password");
  // hashing (low level)
  let hash = "";
  for (const c of data.password) hash += c.charCodeAt(0).toString(16);
  // persistence
  console.log("INSERT INTO users ...");
  // email
  console.log("SMTP welcome -> " + data.email);
  // analytics
  console.log("track signup");
  // audit
  console.log(new Date().toISOString() + " user registered");
  return { email: data.email, hash };
}
