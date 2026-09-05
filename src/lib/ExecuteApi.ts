import { Response } from "@/models/Response";
import { parseResult } from "@/lib/ResultParser";

const TEBEX_API = "https://headless.tebex.io/api";

/**
 * Executes an API request to the Tebex API.
 *
 * @param path The path to the API endpoint.
 * @param options The request options.
 * @returns A promise that resolves to the API response.
 */
export async function executeApi<T>(
    path: string,
    options: RequestInit = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    },
): Promise<Response<T | string>> {
    try {
        if (!options.method) options.method = "GET";

        const headers: Record<string, string> = {
            Accept: "application/json",
            ...(options.headers as Record<string, string>),
        };

        if (
            options.body &&
            (options.method === "POST" || options.method === "PUT" || options.method === "PATCH")
        ) {
            headers["Content-Type"] = "application/json";
        }

        options.headers = headers;

        const result = await fetch(`${TEBEX_API}${path}`, options);
        if (!result.ok) return new Response<string>(await result.text(), result.status);
        const json = await result.json();

        return new Response<T>(parseResult(json), result.status, true);
    } catch (error: unknown) {
        console.error(error);
        return new Response<string>(
            error instanceof Error ? error.message : "Internal Server Error",
            500,
        );
    }
}
