import type { Immutable } from '@/lib/Immutable';

export class UnitResponse<T> {
	private _data: T;
	private _statusCode: number;
	private _ok: boolean;

	constructor(data: T, statusCode: number, ok?: boolean) {
		this._data = data;
		this._statusCode = statusCode;
		this._ok = ok ?? false;
	}

	get data(): Immutable<T> {
		return this._data;
	}

	get ok(): boolean {
		return this._ok;
	}

	get statusCode(): number {
		return this._statusCode;
	}
}

export class ArrayResponse<T> extends UnitResponse<T[]> {}
