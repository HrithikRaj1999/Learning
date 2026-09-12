export interface IATMBackendApi {
    generateTransactionId(atmId: number): number;
}

export class ATMBackendApi implements IATMBackendApi {
    generateTransactionId(atmId: number): number {
        const newId = Math.floor(Math.random() * 1_000_000);
        console.log(`For ATM:${atmId} new transaction is ${newId}`)
        return newId
    }
}
