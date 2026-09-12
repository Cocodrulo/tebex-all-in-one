import { z } from "zod";

/**
 * Zod schema for the CMSPage API response.
 *
 * Based on the OpenAPI `CMSPage` schema.
 * All fields are required per the spec.
 */
export const PageSchema = z.object({
    id: z.number(),
    createdAt: z.union([z.string(), z.number(), z.date()]),
    updatedAt: z.union([z.string(), z.number(), z.date()]),
    accountId: z.number(),
    title: z.string(),
    slug: z.string(),
    private: z.boolean(),
    hidden: z.boolean(),
    disabled: z.boolean(),
    sequence: z.boolean(),
    content: z.string(),
});
