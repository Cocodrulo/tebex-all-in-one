const snakeToCamel = (str: string) => str.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());

export function parseResult<T>(obj: unknown): T {
    if (Array.isArray(obj)) return obj.map(parseResult) as T;
    if (obj && typeof obj === "object") {
        const result: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj)) {
            result[snakeToCamel(key)] = parseResult(value);
        }
        return result as T;
    }
    return obj as T;
}
