/**
 * Represents a coupon.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/coupons
 */
export class Coupon {
    private _code: string;

    constructor(code: string) {
        this._code = code;
    }

    /**
     * The code of the coupon.
     */
    get code(): string {
        return this._code;
    }
}
