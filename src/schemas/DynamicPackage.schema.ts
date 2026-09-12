import { z } from "zod";

/**
 * Zod schema for DynamicPackageInput.
 *
 * Based on the OpenAPI `DynamicPackageInput` schema.
 * Required: `name`, `price`, `slug`
 * Optional: `description`, `image_url`, `custom`
 */
export const DynamicPackageInputSchema = z.object({
    name: z.string(),
    price: z.number(),
    slug: z.string(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    custom: z.record(z.string(), z.string()).optional(),
});

/**
 * Zod schema for DynamicPackagesRequest.
 *
 * Based on the OpenAPI `DynamicPackagesRequest` schema.
 * Required: `username`, `categoryId`, `packages`
 */
export const DynamicPackagesRequestSchema = z.object({
    username: z.string(),
    categoryId: z.number(),
    packages: z.array(DynamicPackageInputSchema),
});
