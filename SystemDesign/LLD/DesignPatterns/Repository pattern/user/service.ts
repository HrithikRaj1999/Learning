import { User } from "./types";
import { UserRepository } from "./repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async registerUser(input: Omit<User, "id">): Promise<User> {
    return this.userRepository.create(input);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getActiveUsers(): Promise<User[]> {
    return this.userRepository.findActiveUsers();
  }

  async deactivateUser(id: string): Promise<User | null> {
    return this.userRepository.updateById(id, { active: false });
  }

  async removeUser(id: string): Promise<boolean> {
    return this.userRepository.deleteById(id);
  }
}
