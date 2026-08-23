import { UserRespository } from "../interfaces/UserRepository";



// Another low-level detail — Postgres-backed lookup, swaps for MySQL freely.
export class PgUserRepo implements UserRespository {
  findContact(userId: string): string {
    console.log('SELECT email FROM users WHERE id=$1 -- [' + userId + "]");
    return userId.split("_")[0]  + "@corp.io";
  }
}