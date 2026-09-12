// Abstraction — where a user's contact address comes from.
// Storage engine (MySQL, Postgres, in-memory) is a detail behind this.
export interface UserRespository {
  findContact(userId: string): string;
}
