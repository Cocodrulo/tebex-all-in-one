import { z } from "zod";

/**
 * Zod schema for the Category API response.
 *
 * Based on the OpenAPI `Category` schema.
 * Nullable fields: `slug`, `parent`, `active_tier`, `packages`, `image_url`
 */
export const CategorySchema = z.object({
    id: z.number(),
    name: z.string(),
    slug: z.string().nullable().optional(),
    parent: z
        .object({
            id: z.number(),
            name: z.string(),
        })
        .nullable()
        .optional(),
    tiered: z.boolean(),
    activeTier: z.record(z.string(), z.unknown()).nullable().optional(),
    description: z.string(),
    packages: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
    order: z.number(),
    displayType: z.enum(["list", "grid"]),
    imageUrl: z.string().nullable().optional(),
    dynamic: z.boolean(),
});
