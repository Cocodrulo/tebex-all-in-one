import type { Immutable } from "@/lib/Immutable";

/**
 * Represents an response.
 */
export class Response<T> {
    private _data: T;
    private _statusCode: number;
    private _ok: boolean;

    constructor(data: T, statusCode: number) {
        this._ok = statusCode >= 200 && statusCode < 300;
        if (this._ok && data && typeof data === "object" && "data" in data)
            data = (data as Record<string, unknown>).data as T;
        this._data = data;
        this._statusCode = statusCode;
    }

    /**
     * The data from the response.
     */
    get data(): Immutable<T> {
        return this._data;
    }

    /**
     * Whether the response was successful.
     */
    get ok(): boolean {
        return this._ok;
    }

    /**
     * The status code of the response.
     */
    get statusCode(): number {
        return this._statusCode;
    }
}
