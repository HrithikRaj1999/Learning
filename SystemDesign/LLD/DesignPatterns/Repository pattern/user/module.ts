import { createUserDataSource, UserDbProvider } from "./data-source";
import { UserRepository } from "./repository";
import { UserService } from "./service";

export { UserDbProvider };

export function buildUserRepository(provider: UserDbProvider): UserRepository {
  return new UserRepository(createUserDataSource(provider));
}

export function buildUserService(provider: UserDbProvider): UserService {
  return new UserService(buildUserRepository(provider));
}
