import { Account } from "../Account.ts";
import { Widthdrawable } from "../Interface/Withdrawable.ts";

export class Current extends Account implements Widthdrawable {
    private readonly charge: number = 100;
    constructor() {
        super(0);
    }
    withdraw(amount: number): number {
        if (amount > this.balance) {
            throw new Error("Insufficient funds");
        }

        this.balance -= amount + this.charge;
        console.log(`
            Amount of ${amount} from Account debited from Current account \n
            remaining ${this.balance} with charge of ${this.charge}`
        )
        return amount
    }
}