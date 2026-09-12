
import { PaymentDataSource } from "./data-source";
import { Payment } from "./types";

export class PaymentRepository {
  constructor(private readonly dataSource: PaymentDataSource) {}

  async findById(id: string): Promise<Payment | null> {
    return this.dataSource.findById(id);
  }

  async findAll(): Promise<Payment[]> {
    return this.dataSource.findAll();
  }

  async find(filter: Partial<Payment>): Promise<Payment[]> {
    return this.dataSource.find(filter);
  }

  async create(payment: Omit<Payment, "id">): Promise<Payment> {
    return this.dataSource.create(payment);
  }

  async updateById(id: string, updates: Partial<Omit<Payment, "id">>): Promise<Payment | null> {
    return this.dataSource.updateById(id, updates);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.dataSource.deleteById(id);
  }

  async findSuccessfulPayments(): Promise<Payment[]> {
    return this.dataSource.findSuccessfulPayments();
  }
}
