export class Account {
    constructor(protected balance: number) { }
    getBalance(): number {
        console.log(`Balance for your account was viewed which is: ${this.balance}`)
        return this.balance;
    }
    deposit(amount: number) {
        console.log(`Amount ${amount} got deposited in account`)
        this.balance += amount;
    }
}