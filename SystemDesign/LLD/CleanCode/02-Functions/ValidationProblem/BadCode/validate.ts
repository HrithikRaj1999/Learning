// ❌ BAD FUNCTION — boolean flag args drive different behaviors; side effects mixed.
export function save(user: any, validate: boolean, sendEmail: boolean, dryRun: boolean): any {
  if (validate) { if (!user.email) throw new Error("no email"); } // flag-controlled
  if (dryRun) return { preview: user };                          // flag-controlled
  console.log("saving..."); 
  if (sendEmail) console.log("email sent");                      // flag-controlled
  return { saved: user };
}
