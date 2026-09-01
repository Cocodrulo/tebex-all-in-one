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

    get quantity(): number {
        return this._quantity;
    }

    get price(): number {
        return this._price;
    }

    get giftUsernameId(): string | undefined {
        return this._giftUsernameId;
    }

    get giftUsername(): string | undefined {
        return this._giftUsername;
    }
}
