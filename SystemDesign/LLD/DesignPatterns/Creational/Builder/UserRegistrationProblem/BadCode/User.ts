// =============================================================================
// WHAT IS WRONG — missing Builder pattern
// =============================================================================
// PATTERN IDEA: a Builder sets only the fields you need via named, chainable
// methods and validates at build() — instead of a constructor full of optionals.
//
// WHAT'S WRONG HERE: User's constructor has 8 params, 6 optional. To set just
// `newsletter` you must pass `undefined, undefined, undefined, undefined` first.
// The call site is "undefined soup" and the positional order is a guessing game.
//
// REAL SCENARIO: a developer miscounts the undefineds and passes the referral code
// into the phone slot — silent data corruption. There's no validation (email
// format, required password rules) at construction. Adding a field shifts every
// positional call.
//
// WHY BAD: unreadable optional-heavy call sites; easy to misplace values; no
// validation; brittle to extend.
//
// HOW TO FIX (no code): a UserBuilder requiring email()/password() and offering
// optional firstName()/phone()/newsletter()... chained, with build() validating
// required + format rules and returning an immutable User. Only relevant fields are
// set; order and undefineds disappear.
// =============================================================================
// ❌ NO BUILDER — registration with many optional fields via one mega ctor.
// Half the args are undefined at most call sites; order is a guessing game.
export class User {
  constructor(
    public email: string,
    public password: string,
    public firstName?: string,
    public lastName?: string,
    public phone?: string,
    public address?: string,
    public newsletter?: boolean,
    public referralCode?: string,
  ) {}
}
// undefined soup; what's the 6th arg again?
const u = new User("a@b.io", "pw", undefined, undefined, undefined, undefined, true);
