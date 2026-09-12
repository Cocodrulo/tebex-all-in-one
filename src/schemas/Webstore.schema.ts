import { z } from "zod";

/**
 * Zod schema for the Webstore API response.
 *
 * Based on the OpenAPI `Webstore` schema.
 * `logo` is nullable per the spec.
 */
export const WebstoreSchema = z.object({
    id: z.number(),
    description: z.string(),
    name: z.string(),
    webstoreUrl: z.string(),
    currency: z.string(),
    lang: z.string(),
    logo: z.string().nullable().optional(),
    platformType: z.string(),
    platformTypeId: z.string(),
    disabled: z.boolean(),
    createdAt: z.union([z.string(), z.number(), z.date()]),
});
