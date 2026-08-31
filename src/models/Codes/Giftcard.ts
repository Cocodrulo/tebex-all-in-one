export class Giftcard {
    private _cardNumber: string;

    constructor(cardNumber: string) {
        this._cardNumber = cardNumber;
    }

    get cardNumber(): string {
        return this._cardNumber;
    }
}
