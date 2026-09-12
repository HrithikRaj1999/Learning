export class Card {
    constructor(
        private cardNumber: number,
        private pin: number,
        private name: string,
        private cardType: string,
        private bankName: string
    ) { }

    getCardNumber(): number {
        return this.cardNumber;
    }

    setCardNumber(cardNumber: number): void {
        this.cardNumber = cardNumber;
    }

    getPin(): number {
        return this.pin;
    }

    setPin(pin: number): void {
        this.pin = pin;
    }

    getName(): string {
        return this.name;
    }

    setName(name: string): void {
        this.name = name;
    }

    getCardType(): string {
        return this.cardType;
    }

    setCardType(cardType: string): void {
        this.cardType = cardType;
    }

    getBankname(): string {
        return this.bankName;
    }

    setBankname(bankname: string): void {
        this.bankName = bankname;
    }
    
}