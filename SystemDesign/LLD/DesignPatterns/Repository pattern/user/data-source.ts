import { DataTypes, Model, Sequelize, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { User } from "./types";

export type UserDbProvider = "mongo" | "postgres" | "mysql";

export interface UserDataSource {
  findById(id: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  find(filter: Partial<User>): Promise<User[]>;
  create(user: Omit<User, "id">): Promise<User>;
  updateById(id: string, updates: Partial<Omit<User, "id">>): Promise<User | null>;
  deleteById(id: string): Promise<boolean>;
}

class MongoUserDataSource implements UserDataSource {
  

  async findById(id: string): Promise<User | null> {
    const user = MongoUserDataSource.users.find((item) => item._id === id) ?? null;
    return user ? this.toDomain(user) : null;
  }

  async findAll(): Promise<User[]> {
    return MongoUserDataSource.users.map((item) => this.toDomain(item));
  }

  async find(filter: Partial<User>): Promise<User[]> {
    const entries = Object.entries(filter) as Array<[keyof User, User[keyof User]]>;
    return MongoUserDataSource.users
      .filter((item) =>
        entries.every(([key, value]) => {
          if (key === "id") {
            return item._id === value;
          }
          return item[key] === value;
        }),
      )
      .map((item) => this.toDomain(item));
  }

  async create(user: Omit<User, "id">): Promise<User> {
    const created = { _id: `u${MongoUserDataSource.users.length + 1}`, ...user };
    MongoUserDataSource.users.push(created);
    return this.toDomain(created);
  }

  async updateById(id: string, updates: Partial<Omit<User, "id">>): Promise<User | null> {
    const index = MongoUserDataSource.users.findIndex((item) => item._id === id);
    if (index === -1) {
      return null;
    }
    MongoUserDataSource.users[index] = { ...MongoUserDataSource.users[index], ...updates };
    return this.toDomain(MongoUserDataSource.users[index]);
  }

  async deleteById(id: string): Promise<boolean> {
    const index = MongoUserDataSource.users.findIndex((item) => item._id === id);
    if (index === -1) {
      return false;
    }
    MongoUserDataSource.users.splice(index, 1);
    return true;
  }

  private toDomain(user: { _id: string; name: string; age: string; active: boolean }): User {
    return { id: user._id, name: user.name, age: user.age, active: user.active };
  }
}

class PgUserEntity extends Model<InferAttributes<PgUserEntity>, InferCreationAttributes<PgUserEntity>> {
  declare id: string;
  declare name: string;
  declare age: string;
  declare active: boolean;
}

class PgUserDataSource implements UserDataSource {
  private readonly sequelize = new Sequelize({
    dialect: "postgres",
    host: "localhost",
    port: 5432,
    database: "lld",
    username: "postgres",
    password: "postgres",
    logging: false,
  });

  private initialized = false;

  private async ensureInit(): Promise<void> {
    if (this.initialized) {
      return;
    }

    PgUserEntity.init(
      {
        id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        age: { type: DataTypes.STRING, allowNull: false },
        active: { type: DataTypes.BOOLEAN, allowNull: false },
      },
      { sequelize: this.sequelize, tableName: "users", timestamps: false },
    );

    await this.sequelize.authenticate();
    await PgUserEntity.sync();
    this.initialized = true;
  }

  async findById(id: string): Promise<User | null> {
    await this.ensureInit();
    const user = await PgUserEntity.findByPk(id);
    return user ? (user.toJSON() as User) : null;
  }

  async findAll(): Promise<User[]> {
    await this.ensureInit();
    const users = await PgUserEntity.findAll();
    return users.map((user) => user.toJSON() as User);
  }

  async find(filter: Partial<User>): Promise<User[]> {
    await this.ensureInit();
    const users = await PgUserEntity.findAll({ where: filter });
    return users.map((user) => user.toJSON() as User);
  }

  async create(user: Omit<User, "id">): Promise<User> {
    await this.ensureInit();
    const created = await PgUserEntity.create({ id: `u${Date.now()}`, ...user });
    return created.toJSON() as User;
  }

  async updateById(id: string, updates: Partial<Omit<User, "id">>): Promise<User | null> {
    await this.ensureInit();
    const user = await PgUserEntity.findByPk(id);
    if (!user) {
      return null;
    }
    await user.update(updates);
    return user.toJSON() as User;
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureInit();
    const deleted = await PgUserEntity.destroy({ where: { id } });
    return deleted > 0;
  }
}

class MySqlUserEntity extends Model<InferAttributes<MySqlUserEntity>, InferCreationAttributes<MySqlUserEntity>> {
  declare id: string;
  declare name: string;
  declare age: string;
  declare active: boolean;
}

class MySqlUserDataSource implements UserDataSource {
  private readonly sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    port: 3306,
    database: "lld",
    username: "root",
    password: "root",
    logging: false,
  });

  private initialized = false;

  private async ensureInit(): Promise<void> {
    if (this.initialized) {
      return;
    }

    MySqlUserEntity.init(
      {
        id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        name: { type: DataTypes.STRING, allowNull: false },
        age: { type: DataTypes.STRING, allowNull: false },
        active: { type: DataTypes.BOOLEAN, allowNull: false },
      },
      { sequelize: this.sequelize, tableName: "users", timestamps: false },
    );

    await this.sequelize.authenticate();
    await MySqlUserEntity.sync();
    this.initialized = true;
  }

  async findById(id: string): Promise<User | null> {
    await this.ensureInit();
    const user = await MySqlUserEntity.findByPk(id);
    return user ? (user.toJSON() as User) : null;
  }

  async findAll(): Promise<User[]> {
    await this.ensureInit();
    const users = await MySqlUserEntity.findAll();
    return users.map((user) => user.toJSON() as User);
  }

  async find(filter: Partial<User>): Promise<User[]> {
    await this.ensureInit();
    const users = await MySqlUserEntity.findAll({ where: filter });
    return users.map((user) => user.toJSON() as User);
  }

  async create(user: Omit<User, "id">): Promise<User> {
    await this.ensureInit();
    const created = await MySqlUserEntity.create({ id: `u${Date.now()}`, ...user });
    return created.toJSON() as User;
  }

  async updateById(id: string, updates: Partial<Omit<User, "id">>): Promise<User | null> {
    await this.ensureInit();
    const user = await MySqlUserEntity.findByPk(id);
    if (!user) {
      return null;
    }
    await user.update(updates);
    return user.toJSON() as User;
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureInit();
    const deleted = await MySqlUserEntity.destroy({ where: { id } });
    return deleted > 0;
  }
}

export function createUserDataSource(provider: UserDbProvider): UserDataSource {
  switch (provider) {
    case "mongo":
      return new MongoUserDataSource();
    case "postgres":
      return new PgUserDataSource();
    case "mysql":
      return new MySqlUserDataSource();
    default:
      throw new Error(`Unsupported user provider: ${provider}`);
  }
}
