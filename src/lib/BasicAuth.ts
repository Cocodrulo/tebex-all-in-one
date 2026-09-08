declare const BasicAuthBrand: unique symbol;
export type BasicAuth = string & { readonly [BasicAuthBrand]: never };

/**
 * Creates a basic authentication string.
 * @param token The public token.
 * @param privateKey The private key.
 * @returns A basic authentication string.
 */
export function createBasicAuth(token: string, privateKey: string): BasicAuth {
    if (!token || !privateKey) throw new Error("Token and private key are required");
    return `${token}:${privateKey}` as BasicAuth;
}

/**
 * Converts a string to a base64 string.
 * @param str The string to convert.
 * @returns The base64 string.
 */
export const bt64 = (str: string): string =>
    typeof btoa === "function" ? btoa(str) : Buffer.from(str).toString("base64");
