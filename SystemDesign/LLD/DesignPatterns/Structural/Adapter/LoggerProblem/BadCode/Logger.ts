// =============================================================================
// WHAT IS WRONG — missing Adapter pattern
// =============================================================================
// PATTERN IDEA: an Adapter wraps an incompatible third-party API behind YOUR own
// interface, so app code talks to a stable interface and the vendor's quirks live
// in one place.
//
// WHAT'S WRONG HERE: UserService calls WinstonLike.writeLog(level, payload)
// directly, so every log call must know the vendor's level numbers and payload
// shape. The third-party API leaks into business code.
//
// REAL SCENARIO: you switch from this logger to pino or console — now you edit
// EVERY log call site across the codebase, because they're all coupled to the
// vendor's signature. The "level 2 = info" knowledge is duplicated and easy to get
// wrong.
//
// WHY BAD: vendor API leaks everywhere; swapping libraries touches every call site;
// quirky mapping is duplicated.
//
// HOW TO FIX (no code): define your own Logger interface (info()/warn()/error()).
// A LoggerAdapter implements it by translating to the vendor's writeLog(). App code
// depends only on your interface; swapping vendors = one new adapter, no call-site
// edits.
// =============================================================================
// ❌ NO ADAPTER — app code calls a 3rd-party logger's odd API directly. Swapping
// logging libs means editing every log call across the codebase.
class WinstonLike { writeLog(level: number, payload: { msg: string }) { return `[${level}] ${payload.msg}`; } }

export class UserService {
  private log = new WinstonLike();
  createUser(name: string) {
    // every call must know level numbers + payload shape -> leaky + repeated
    this.log.writeLog(2, { msg: "creating " + name });
    return { name };
  }
}
console.log(new UserService().createUser("Ada"));
