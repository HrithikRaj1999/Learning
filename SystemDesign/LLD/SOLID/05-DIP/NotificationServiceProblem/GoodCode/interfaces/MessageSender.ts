// Abstraction — how a message gets delivered.
// High-level policy depends on THIS, not on SMTP/SMS details.
export interface MessageSender {
  send(to: string, msg: string): void;
}
