import { DataTypes, Model, Sequelize, type InferAttributes, type InferCreationAttributes } from "sequelize";
import { Payment } from "./types";

export type PaymentDbProvider = "inmemory" | "mongo" | "postgres" | "mysql";

export interface PaymentDataSource {
  findById(id: string): Promise<Payment | null>;
  findAll(): Promise<Payment[]>;
  find(filter: Partial<Payment>): Promise<Payment[]>;
  create(payment: Omit<Payment, "id">): Promise<Payment>;
  updateById(id: string, updates: Partial<Omit<Payment, "id">>): Promise<Payment | null>;
  deleteById(id: string): Promise<boolean>;
  findSuccessfulPayments(): Promise<Payment[]>;
}

class InMemoryPaymentDataSource implements PaymentDataSource {
  private static payments: Payment[] = [
    { id: "pay1", orderId: "o1", paymentDate: new Date("2026-01-10T10:00:00.000Z"), status: true },
    { id: "pay2", orderId: "o2", paymentDate: new Date("2026-01-14T14:30:00.000Z"), status: false },
  ];

  async findById(id: string): Promise<Payment | null> {
    return InMemoryPaymentDataSource.payments.find((item) => item.id === id) ?? null;
  }

  async findAll(): Promise<Payment[]> {
    return [...InMemoryPaymentDataSource.payments];
  }

  async find(filter: Partial<Payment>): Promise<Payment[]> {
    const entries = Object.entries(filter) as Array<[keyof Payment, Payment[keyof Payment]]>;
    return InMemoryPaymentDataSource.payments.filter((item) => entries.every(([key, value]) => item[key] === value));
  }

  async create(payment: Omit<Payment, "id">): Promise<Payment> {
    const created: Payment = { id: `pay${InMemoryPaymentDataSource.payments.length + 1}`, ...payment };
    InMemoryPaymentDataSource.payments.push(created);
    return created;
  }

  async updateById(id: string, updates: Partial<Omit<Payment, "id">>): Promise<Payment | null> {
    const index = InMemoryPaymentDataSource.payments.findIndex((item) => item.id === id);
    if (index === -1) {
      return null;
    }

    InMemoryPaymentDataSource.payments[index] = { ...InMemoryPaymentDataSource.payments[index], ...updates };
    return InMemoryPaymentDataSource.payments[index];
  }

  async deleteById(id: string): Promise<boolean> {
    const index = InMemoryPaymentDataSource.payments.findIndex((item) => item.id === id);
    if (index === -1) {
      return false;
    }

    InMemoryPaymentDataSource.payments.splice(index, 1);
    return true;
  }

  async findSuccessfulPayments(): Promise<Payment[]> {
    return this.find({ status: true });
  }
}

class MongoPaymentDataSource extends InMemoryPaymentDataSource {}

class PgPaymentEntity extends Model<InferAttributes<PgPaymentEntity>, InferCreationAttributes<PgPaymentEntity>> {
  declare id: string;
  declare orderId: string;
  declare paymentDate: Date;
  declare status: boolean;
}

class PgPaymentDataSource implements PaymentDataSource {
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

    PgPaymentEntity.init(
      {
        id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        orderId: { type: DataTypes.STRING, allowNull: false },
        paymentDate: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
      },
      { sequelize: this.sequelize, tableName: "payments", timestamps: false },
    );

    await this.sequelize.authenticate();
    await PgPaymentEntity.sync();
    this.initialized = true;
  }

  async findById(id: string): Promise<Payment | null> {
    await this.ensureInit();
    const payment = await PgPaymentEntity.findByPk(id);
    return payment ? (payment.toJSON() as Payment) : null;
  }

  async findAll(): Promise<Payment[]> {
    await this.ensureInit();
    const payments = await PgPaymentEntity.findAll();
    return payments.map((payment) => payment.toJSON() as Payment);
  }

  async find(filter: Partial<Payment>): Promise<Payment[]> {
    await this.ensureInit();
    const payments = await PgPaymentEntity.findAll({ where: filter });
    return payments.map((payment) => payment.toJSON() as Payment);
  }

  async create(payment: Omit<Payment, "id">): Promise<Payment> {
    await this.ensureInit();
    const created = await PgPaymentEntity.create({ id: `pay${Date.now()}`, ...payment });
    return created.toJSON() as Payment;
  }

  async updateById(id: string, updates: Partial<Omit<Payment, "id">>): Promise<Payment | null> {
    await this.ensureInit();
    const payment = await PgPaymentEntity.findByPk(id);
    if (!payment) {
      return null;
    }
    await payment.update(updates);
    return payment.toJSON() as Payment;
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureInit();
    const deleted = await PgPaymentEntity.destroy({ where: { id } });
    return deleted > 0;
  }

  async findSuccessfulPayments(): Promise<Payment[]> {
    return this.find({ status: true });
  }
}

class MySqlPaymentEntity extends Model<InferAttributes<MySqlPaymentEntity>, InferCreationAttributes<MySqlPaymentEntity>> {
  declare id: string;
  declare orderId: string;
  declare paymentDate: Date;
  declare status: boolean;
}

class MySqlPaymentDataSource implements PaymentDataSource {
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

    MySqlPaymentEntity.init(
      {
        id: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
        orderId: { type: DataTypes.STRING, allowNull: false },
        paymentDate: { type: DataTypes.DATE, allowNull: false },
        status: { type: DataTypes.BOOLEAN, allowNull: false },
      },
      { sequelize: this.sequelize, tableName: "payments", timestamps: false },
    );

    await this.sequelize.authenticate();
    await MySqlPaymentEntity.sync();
    this.initialized = true;
  }

  async findById(id: string): Promise<Payment | null> {
    await this.ensureInit();
    const payment = await MySqlPaymentEntity.findByPk(id);
    return payment ? (payment.toJSON() as Payment) : null;
  }

  async findAll(): Promise<Payment[]> {
    await this.ensureInit();
    const payments = await MySqlPaymentEntity.findAll();
    return payments.map((payment) => payment.toJSON() as Payment);
  }

  async find(filter: Partial<Payment>): Promise<Payment[]> {
    await this.ensureInit();
    const payments = await MySqlPaymentEntity.findAll({ where: filter });
    return payments.map((payment) => payment.toJSON() as Payment);
  }

  async create(payment: Omit<Payment, "id">): Promise<Payment> {
    await this.ensureInit();
    const created = await MySqlPaymentEntity.create({ id: `pay${Date.now()}`, ...payment });
    return created.toJSON() as Payment;
  }

  async updateById(id: string, updates: Partial<Omit<Payment, "id">>): Promise<Payment | null> {
    await this.ensureInit();
    const payment = await MySqlPaymentEntity.findByPk(id);
    if (!payment) {
      return null;
    }
    await payment.update(updates);
    return payment.toJSON() as Payment;
  }

  async deleteById(id: string): Promise<boolean> {
    await this.ensureInit();
    const deleted = await MySqlPaymentEntity.destroy({ where: { id } });
    return deleted > 0;
  }

  async findSuccessfulPayments(): Promise<Payment[]> {
    return this.find({ status: true });
  }
}

export function createPaymentDataSource(provider: PaymentDbProvider): PaymentDataSource {
  switch (provider) {
    case "inmemory":
      return new InMemoryPaymentDataSource();
    case "mongo":
      return new MongoPaymentDataSource();
    case "postgres":
      return new PgPaymentDataSource();
    case "mysql":
      return new MySqlPaymentDataSource();
    default:
      throw new Error(`Unsupported payment provider: ${provider}`);
  }
}
