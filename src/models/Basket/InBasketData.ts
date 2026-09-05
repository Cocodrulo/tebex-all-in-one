/**
 * Represents the data of a package in the basket.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/baskets/get-a-basket
 */
export class InBasketData {
    private _quantity: number;
    private _price: number;
    private _giftUsernameId?: string;
    private _giftUsername?: string;

    constructor(props: {
        quantity: number;
        price: number;
        giftUsername?: string;
        giftUsernameId?: string;
    }) {
        this._quantity = props.quantity;
        this._price = props.price;
        this._giftUsername = props.giftUsername;
        this._giftUsernameId = props.giftUsernameId;
    }

    /**
     * The quantity of the package in the basket.
     */
    get quantity(): number {
        return this._quantity;
    }

    /**
     * The price of the package in the basket.
     */
    get price(): number {
        return this._price;
    }

    /**
     * The ID of the user the package is being gifted to.
     */
    get giftUsernameId(): string | undefined {
        return this._giftUsernameId;
    }

    /**
     * The username of the user the package is being gifted to.
     */
    get giftUsername(): string | undefined {
        return this._giftUsername;
    }
}
