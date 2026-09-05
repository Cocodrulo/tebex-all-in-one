/**
 * Represents the revenue share of a package in the basket.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/baskets/get-a-basket
 */
export class RevenueShare {
    private _walletRef: string;
    private _amount: number;
    private _gatewayFeePercent: number;

    constructor(props: { walletRef: string; amount: number; gatewayFeePercent: number }) {
        this._walletRef = props.walletRef;
        this._amount = props.amount;
        this._gatewayFeePercent = props.gatewayFeePercent;
    }

    /**
     * The Tebex wallet reference.
     */
    get walletRef(): string {
        return this._walletRef;
    }

    /**
     * The amount to be paid to the wallet.
     */
    get amount(): number {
        return this._amount;
    }

    /**
     * The percentage of the gateway fee.
     */
    get gatewayFeePercent(): number {
        return this._gatewayFeePercent;
    }
}
