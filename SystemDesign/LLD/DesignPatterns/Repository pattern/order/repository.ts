
import { OrderDataSource } from "./data-source";
import { Order } from "./types";

export class OrderRepository {
  constructor(private readonly dataSource: OrderDataSource) {}

  async findById(id: string): Promise<Order | null> {
    return this.dataSource.findById(id);
  }

  async findAll(): Promise<Order[]> {
    return this.dataSource.findAll();
  }

  async find(filter: Partial<Order>): Promise<Order[]> {
    return this.dataSource.find(filter);
  }

  async create(order: Omit<Order, "id">): Promise<Order> {
    return this.dataSource.create(order);
  }

  async updateById(id: string, updates: Partial<Omit<Order, "id">>): Promise<Order | null> {
    return this.dataSource.updateById(id, updates);
  }

  async deleteById(id: string): Promise<boolean> {
    return this.dataSource.deleteById(id);
  }

  async findSuccessfulOrders(): Promise<Order[]> {
    return this.dataSource.findSuccessfulOrders();
  }
}
