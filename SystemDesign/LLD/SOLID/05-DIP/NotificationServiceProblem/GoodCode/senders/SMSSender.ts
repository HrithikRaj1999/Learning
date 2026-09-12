import { MessageSender } from "../interfaces/MessageSender";

// Low-level detail — one way to implement MessageSender.
export class SMSSender implements MessageSender {
  send(to: string, msg: string): void {
    console.log("SMS JIO SIM -> " + to + ": " + msg);
  }
}