import { PaymentRepository } from "./repository";
import { Payment } from "./types";

export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async createPayment(input: Omit<Payment, "id">): Promise<Payment> {
    return this.paymentRepository.create(input);
  }

  async getPaymentById(id: string): Promise<Payment | null> {
    return this.paymentRepository.findById(id);
  }

  async getSuccessfulPayments(): Promise<Payment[]> {
    return this.paymentRepository.findSuccessfulPayments();
  }
}
