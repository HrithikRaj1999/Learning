import { MessageSender } from "../interfaces/MessageSender";

// Low-level detail — one way to implement MessageSender.
export class EmailSender implements MessageSender {
  send(to: string, msg: string): void {
    console.log("SMTP -> " + to + ": " + msg);
  }
}