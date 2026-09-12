import { z } from "zod";

/**
 * Zod schema for PackageMedia.
 *
 * Based on the OpenAPI `PackageMedia` schema.
 * `name` is nullable per the spec.
 */
export const PackageMediaSchema = z.object({
    type: z.enum(["video", "image"]),
    name: z.string().nullable().optional(),
    url: z.string(),
    featured: z.boolean(),
    primary: z.boolean(),
});

/**
 * Zod schema for a Package.
 *
 * Based on the OpenAPI `Package` schema.
 * Nullable fields: `image`, `prorate_price`, `expiration_date`
 */
export const PackageSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    image: z.string().nullable().optional(),
    type: z.string(),
    category: z.object({
        id: z.number(),
        name: z.string(),
    }),
    basePrice: z.number(),
    salesTax: z.number(),
    totalPrice: z.number(),
    currency: z.string(),
    proratePrice: z.number().nullable().optional(),
    discount: z.number().optional(),
    disableQuantity: z.boolean(),
    disableGifting: z.boolean(),
    expirationDate: z.union([z.string(), z.number(), z.date()]).nullable().optional(),
    media: z.array(PackageMediaSchema).optional(),
    order: z.number(),
    slug: z.string(),
    userLimit: z.number().optional(),
    creatorMetaData: z.record(z.string(), z.unknown()).optional(),
    options: z.array(z.unknown()).optional(),
    variables: z.array(z.unknown()).optional(),
    createdAt: z.union([z.string(), z.number(), z.date()]),
    updatedAt: z.union([z.string(), z.number(), z.date()]),
});
