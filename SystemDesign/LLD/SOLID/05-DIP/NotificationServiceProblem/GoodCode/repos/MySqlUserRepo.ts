import { UserRespository } from "../interfaces/UserRepository";

// Low-level detail — MySQL-backed lookup.
export class MySqlUserRepo implements UserRespository {
  findContact(userId: string): string {
    console.log("SELECT email FROM users WHERE id=" + userId);
    return userId.split("_")[0] + "@corp.io";
  }
}