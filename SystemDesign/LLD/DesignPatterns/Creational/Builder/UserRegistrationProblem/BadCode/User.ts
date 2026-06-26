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
