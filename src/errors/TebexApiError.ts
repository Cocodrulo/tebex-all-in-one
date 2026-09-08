/**
 * Represents an error from the Tebex API with rich metadata.
 *
 * Includes the HTTP status code, the endpoint that was called,
 * and the raw response body for easier debugging.
 */
export class TebexApiError extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly endpoint: string,
        public readonly body: unknown,
    ) {
        super(`Tebex API error ${statusCode} on ${endpoint}`);
        this.name = "TebexApiError";
    }
}
