export class Transaction {
  private status: "STARTED" | "CANCELLED" | "COMPLETED" = "STARTED";

  constructor(
    private readonly id: number,
    private readonly atmId: number
  ) {}

  getId(): number {
    return this.id;
  }

  getAtmId(): number {
    return this.atmId;
  }

  getStatus(): "STARTED" | "CANCELLED" | "COMPLETED" {
    return this.status;
  }

  cancel(): void {
    this.status = "CANCELLED";
  }

  complete(): void {
    this.status = "COMPLETED";
  }
}
