import { Account } from "../Account.ts";
import { Widthdrawable } from "../Interface/Withdrawable.ts";

export class Savings extends Account implements Widthdrawable {
    withdraw(amount: number): number {
        if (amount > this.balance) {
            throw new Error("Insufficient funds");
        }
        this.balance -= amount;
        console.log(`
            Amount of ${amount} from Account debited from Savings account \n
            remaining ${this.balance}`
        )
        return amount
    }
}