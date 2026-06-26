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
