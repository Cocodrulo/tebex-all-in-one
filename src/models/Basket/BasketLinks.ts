/**
 * Represents the payment and checkout URLs of a basket.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/basket-links
 */
export class BasketLinks {
    private _payment: string | undefined;
    private _checkout: string | undefined;

    constructor(payment?: string, checkout?: string) {
        this._payment = payment;
        this._checkout = checkout;
    }

    /**
     * The payment URL.
     */
    get payment(): string | undefined {
        return this._payment;
    }

    /**
     * The checkout URL.
     */
    get checkout(): string | undefined {
        return this._checkout;
    }
}
