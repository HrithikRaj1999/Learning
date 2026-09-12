import { createOrderDataSource, OrderDbProvider } from "./data-source";
import { OrderRepository } from "./repository";
import { OrderService } from "./service";

export { OrderDbProvider };

export function buildOrderRepository(provider: OrderDbProvider = "inmemory"): OrderRepository {
  return new OrderRepository(createOrderDataSource(provider));
}

export function buildOrderService(provider: OrderDbProvider = "inmemory"): OrderService {
  return new OrderService(buildOrderRepository(provider));
}
