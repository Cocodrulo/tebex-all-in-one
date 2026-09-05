/**
 * Represents a gift card.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/gift-cards
 */
export class Giftcard {
    private _cardNumber: string;

    constructor(cardNumber: string) {
        this._cardNumber = cardNumber;
    }

    /**
     * The card number of the gift card.
     */
    get cardNumber(): string {
        return this._cardNumber;
    }
}
