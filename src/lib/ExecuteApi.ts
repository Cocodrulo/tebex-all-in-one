import { UnitResponse } from "@/models/Response";
import { parseResult } from "@/lib/ResultParser";

const TEBEX_API = "https://headless.tebex.io/api";

export async function executeApi<T>(
    path: string,
    options: RequestInit = {
        method: "GET",
        headers: {
            Accept: "application/json",
        },
    },
): Promise<UnitResponse<T | string>> {
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
        if (!result.ok) return new UnitResponse<string>(await result.text(), result.status);
        const json = await result.json();

        return new UnitResponse<T>(parseResult(json), result.status, true);
    } catch (error: unknown) {
        console.error(error);
        return new UnitResponse<string>(
            error instanceof Error ? error.message : "Internal Server Error",
            500,
        );
    }
}
