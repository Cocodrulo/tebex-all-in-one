export class RevenueShare {
    private _walletRef: string;
    private _amount: number;
    private _gatewayFeePercent: number;

    constructor(props: { walletRef: string; amount: number; gatewayFeePercent: number }) {
        this._walletRef = props.walletRef;
        this._amount = props.amount;
        this._gatewayFeePercent = props.gatewayFeePercent;
    }

    get walletRef(): string {
        return this._walletRef;
    }

    get amount(): number {
        return this._amount;
    }

    get gatewayFeePercent(): number {
        return this._gatewayFeePercent;
    }
}
