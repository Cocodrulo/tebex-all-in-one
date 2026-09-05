/**
 * Represents the authentication of a basket.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/baskets/authorize-a-basket
 */
export class BasketAuth {
    private _name: string;
    private _url: string;

    constructor(name: string, url: string) {
        this._name = name;
        this._url = url;
    }

    /**
     * The name associated with the authentication.
     */
    get name(): string {
        return this._name;
    }

    /**
     * The URL associated with the authentication.
     */
    get url(): string {
        return this._url;
    }
}
