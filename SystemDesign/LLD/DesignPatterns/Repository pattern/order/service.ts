import { OrderRepository } from "./repository";
import { Order } from "./types";

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(input: Omit<Order, "id">): Promise<Order> {
    return this.orderRepository.create(input);
  }

  async getOrderById(id: string): Promise<Order | null> { 
    return this.orderRepository.findById(id);
  }

  async getSuccessfulOrders(): Promise<Order[]> {
    return this.orderRepository.findSuccessfulOrders();
  }
}
