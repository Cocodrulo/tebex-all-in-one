/**
 * Represents the payment and checkout URLs of a basket.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/basket-links
 */
export class BasketLinks {
    private _payment: string;
    private _checkout: string;

    constructor(payment: string, checkout: string) {
        this._payment = payment;
        this._checkout = checkout;
    }

    /**
     * The payment URL.
     */
    get payment(): string {
        return this._payment;
    }

    /**
     * The checkout URL.
     */
    get checkout(): string {
        return this._checkout;
    }
}
