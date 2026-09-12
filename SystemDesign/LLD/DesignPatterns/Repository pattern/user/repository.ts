import { UserDataSource } from "./data-source";
import { User } from "./types";


export class UserRepository {
  constructor(private readonly dataSource: UserDataSource) {}

  async findById(id: string): Promise<User | null> {
    return this.dataSource.findById(id);
  }

  async findAll(): Promise<User[]> {
    return this.dataSource.findAll();
  }

  async find(filter: Partial<User>): Promise<User[]> {
    return this.dataSource.find(filter);
  }

  async create(user: Omit<User, "id">): Promise<User> {
    return this.dataSource.create(user);
  }

  async updateById(id: string, updates: Partial<Omit<User, "id">>): Promise<User | null> {
    return this.dataSource.updateById(id, updates);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.dataSource.deleteById(id);
  }

  async findActiveUsers(): Promise<User[]> {
    return this.dataSource.find({ active: true });
  }
}
