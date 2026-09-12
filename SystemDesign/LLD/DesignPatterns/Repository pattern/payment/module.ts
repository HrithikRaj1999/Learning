import { createPaymentDataSource, PaymentDbProvider } from "./data-source";
import { PaymentRepository } from "./repository";
import { PaymentService } from "./service";

export { PaymentDbProvider };

export function buildPaymentRepository(provider: PaymentDbProvider = "inmemory"): PaymentRepository {
  return new PaymentRepository(createPaymentDataSource(provider));
}

export function buildPaymentService(provider: PaymentDbProvider = "inmemory"): PaymentService {
  return new PaymentService(buildPaymentRepository(provider));
}
