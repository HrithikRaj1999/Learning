// =============================================================================
// WHAT IS WRONG — missing Abstract Factory pattern
// =============================================================================
// PATTERN IDEA: an Abstract Factory builds a family of related objects guaranteed
// to be compatible (a MySQL connection WITH a MySQL command).
//
// WHAT'S WRONG HERE: setup() news up connection and command separately, and the
// demo literally pairs a MySqlConnection with a PgCommand. The two halves of one
// DB family are chosen independently, so they can mismatch.
//
// REAL SCENARIO: a Postgres command run against a MySQL connection compiles fine
// but breaks at runtime (different protocols/SQL dialects). This is a subtle bug
// that escapes the type checker and only fails when that branch executes. Adding
// transactions/result-sets multiplies the chances of mixing families.
//
// WHY BAD: family members are created independently and can be incompatible; the
// mismatch is invisible until runtime; selection logic is duplicated.
//
// HOW TO FIX (no code): define a DbFactory interface (createConnection(),
// createCommand()); MySqlFactory and PgFactory each return their own matching
// pair. setup() chooses one factory; connection and command are always the same
// family. New DB = a new factory.
// =============================================================================
// ❌ NO ABSTRACT FACTORY — connection + command + transaction created ad hoc.
// Real bug: you can pair a MySQL connection with a Postgres command object.
class MySqlConnection { open() { return "mysql open"; } }
class MySqlCommand { exec(c: unknown) { return "mysql exec"; } }
class PgConnection { open() { return "pg open"; } }
class PgCommand { exec(c: unknown) { return "pg exec"; } }

export function setup(db: string) {
  if (db === "mysql") {
    const conn = new MySqlConnection();
    const cmd = new PgCommand(); // 🐛 mismatched family! compiles, breaks at runtime
    return { conn: conn.open(), cmd: cmd.exec(conn) };
  }
  const conn = new PgConnection();
  const cmd = new MySqlCommand(); // 🐛 mismatched again
  return { conn: conn.open(), cmd: cmd.exec(conn) };
}
console.log(setup("mysql"));
