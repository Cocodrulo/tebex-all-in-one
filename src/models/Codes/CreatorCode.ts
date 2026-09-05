/**
 * Represents a creator code.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/creator-codes
 */
export class CreatorCode {
    private _code: string;

    constructor(code: string) {
        this._code = code;
    }

    /**
     * The code of the creator code.
     */
    get code(): string {
        return this._code;
    }
}
