import { DataTypes, Model, Sequelize, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { Order } from "./types";

export type OrderDbProvider = "inmemory" | "mongo" | "postgres" | "mysql";

export interface OrderDataSource {
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  find(filter: Partial<Order>): Promise<Order[]>;
  create(order: Omit<Order, "id">): Promise<Order>;
  updateById(id: string, updates: Partial<Omit<Order, "id">>): Promise<Order | null>;
  deleteById(id: string): Promise<boolean>;
  findSuccessfulOrders(): Promise<Order[]>;
}

class InMemoryOrderDataSource implements OrderDataSource {
  private static orders: Order[] = [
    { id: "o1", orderDate: "2026-01-10", quantity: "2", productId: "p1", paymentId: "pay1", successful: true },
    { id: "o2", orderDate: "2026-01-14", quantity: "1", productId: "p2", paymentId: "pay2", successful: false },
  ];

  async findById(id: string): Promise<Order | null> {
    return InMemoryOrderDataSource.orders.find((item) => item.id === id) ?? null;
  }

  async findAll(): Promise<Order[]> {
    return [...InMemoryOrderDataSource.orders];
  }

  async find(filter: Partial<Order>): Promise<Order[]> {
    const entries = Object.entries(filter) as Array<[keyof Order, Order[keyof Order]]>;
    return InMemoryOrderDataSource.orders.filter((item) => entries.every(([key, value]) => item[key] === value));
  }

  async create(order: Omit<Order, "id">): Promise<Order> {
    const created: Order = { id: `o${InMemoryOrderDataSource.orders.length + 1}`, ...order };
    InMemoryOrderDataSource.orders.push(created);
    return created;
  }

  async updateById(id: string, updates: Partial<Omit<Order, "id">>): Promise<Order | null> {
    const index = InMemoryOrderDataSource.orders.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    InMemoryOrderDataSource.orders[index] = { ...InMemoryOrderDataSource.orders[index], ...updates };
    return InMemoryOrderDataSource.orders[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const index = InMemoryOrderDataSource.orders.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    InMemoryOrderDataSource.orders.splice(index, 1);
    return true;
  }

  async findSuccessfulOrders(): Promise<Order[]> {
    return this.find({ successful: true });
  }
}

class MongoOrderDataSource extends InMemoryOrderDataSource {}

class PgOrderEntity extends Model<InferAttributes<PgOrderEntity>, InferCreationAttributes<PgOrderEntity>> {
  declare id: string;
  declare orderDate: string;
  declare quantity: string;
  declare productId: string;
  declare paymentId: string;
  declare successful: boolean;
}

class PgOrderDataSource implements OrderDataSource {
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

    PgOrderEntity.init(
      {
        id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        orderDate: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.STRING, allowNull: false },
        productId: { type: DataTypes.STRING, allowNull: false },
        paymentId: { type: DataTypes.STRING, allowNull: false },
        successful: { type: DataTypes.BOOLEAN, allowNull: false },
      },
      { sequelize: this.sequelize, tableName: "orders", timestamps: false },
    );

    await this.sequelize.authenticate();
    await PgOrderEntity.sync();
    this.initialized = true;
  }

  async findById(id: string): Promise<Order | null> {
    await this.ensureInit();
    const order = await PgOrderEntity.findByPk(id);
    return order ? (order.toJSON() as Order) : null;
  }

  async findAll(): Promise<Order[]> {
    await this.ensureInit();
    const orders = await PgOrderEntity.findAll();
    return orders.map((order) => order.toJSON() as Order);
  }

  async find(filter: Partial<Order>): Promise<Order[]> {
    await this.ensureInit();
    const orders = await PgOrderEntity.findAll({ where: filter });
    return orders.map((order) => order.toJSON() as Order);
  }

  async create(order: Omit<Order, "id">): Promise<Order> {
    await this.ensureInit();
    const created = await PgOrderEntity.create({ id: `o${Date.now()}`, ...order });
    return created.toJSON() as Order;
  }

  async updateById(id: string, updates: Partial<Omit<Order, "id">>): Promise<Order | null> {
    await this.ensureInit();
    const order = await PgOrderEntity.findByPk(id);
    if (!order) {
      return null;
    }
    await order.update(updates);
    return order.toJSON() as Order;
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureInit();
    const deleted = await PgOrderEntity.destroy({ where: { id } });
    return deleted > 0;
  }

  async findSuccessfulOrders(): Promise<Order[]> {
    return this.find({ successful: true });
  }
}

class MySqlOrderEntity extends Model<InferAttributes<MySqlOrderEntity>, InferCreationAttributes<MySqlOrderEntity>> {
  declare id: string;
  declare orderDate: string;
  declare quantity: string;
  declare productId: string;
  declare paymentId: string;
  declare successful: boolean;
}

class MySqlOrderDataSource implements OrderDataSource {
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

    MySqlOrderEntity.init(
      {
        id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        orderDate: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.STRING, allowNull: false },
        productId: { type: DataTypes.STRING, allowNull: false },
        paymentId: { type: DataTypes.STRING, allowNull: false },
        successful: { type: DataTypes.BOOLEAN, allowNull: false },
      },
      { sequelize: this.sequelize, tableName: "orders", timestamps: false },
    );

    await this.sequelize.authenticate();
    await MySqlOrderEntity.sync();
    this.initialized = true;
  }

  async findById(id: string): Promise<Order | null> {
    await this.ensureInit();
    const order = await MySqlOrderEntity.findByPk(id);
    return order ? (order.toJSON() as Order) : null;
  }

  async findAll(): Promise<Order[]> {
    await this.ensureInit();
    const orders = await MySqlOrderEntity.findAll();
    return orders.map((order) => order.toJSON() as Order);
  }

  async find(filter: Partial<Order>): Promise<Order[]> {
    await this.ensureInit();
    const orders = await MySqlOrderEntity.findAll({ where: filter });
    return orders.map((order) => order.toJSON() as Order);
  }

  async create(order: Omit<Order, "id">): Promise<Order> {
    await this.ensureInit();
    const created = await MySqlOrderEntity.create({ id: `o${Date.now()}`, ...order });
    return created.toJSON() as Order;
  }

  async updateById(id: string, updates: Partial<Omit<Order, "id">>): Promise<Order | null> {
    await this.ensureInit();
    const order = await MySqlOrderEntity.findByPk(id);
    if (!order) {
      return null;
    }
    await order.update(updates);
    return order.toJSON() as Order;
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureInit();
    const deleted = await MySqlOrderEntity.destroy({ where: { id } });
    return deleted > 0;
  }

  async findSuccessfulOrders(): Promise<Order[]> {
    return this.find({ successful: true });
  }
}

export function createOrderDataSource(provider: OrderDbProvider): OrderDataSource {
  switch (provider) {
    case "inmemory":
      return new InMemoryOrderDataSource();
    case "mongo":
      return new MongoOrderDataSource();
    case "postgres":
      return new PgOrderDataSource();
    case "mysql":
      return new MySqlOrderDataSource();
    default:
      throw new Error(`Unsupported order provider: ${provider}`);
  }
}
