export class BasketLinks {
	private _payment: string;
	private _checkout: string;

	constructor(payment: string, checkout: string) {
		this._payment = payment;
		this._checkout = checkout;
	}

	get payment(): string {
		return this._payment;
	}

	get checkout(): string {
		return this._checkout;
	}
}
