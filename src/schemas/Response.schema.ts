import { z } from "zod";
import { WebstoreSchema } from "./Webstore.schema";
import { PageSchema } from "./Page.schema";
import { BasketSchema } from "./Basket.schema";
import { CategorySchema } from "./Category.schema";
import { PackageSchema } from "./Package.schema";
import { ModuleSchema } from "./Module.schema";

/**
 * Zod schema for the WebstoreResponse wrapper.
 */
export const WebstoreResponseSchema = z.object({
    data: WebstoreSchema,
});

/**
 * Zod schema for the CMSPagesResponse wrapper.
 */
export const CMSPagesResponseSchema = z.object({
    data: z.array(PageSchema),
});

/**
 * Zod schema for the BasketResponse wrapper.
 */
export const BasketResponseSchema = z.object({
    data: BasketSchema,
});

/**
 * Zod schema for the CategoryResponse wrapper.
 */
export const CategoryResponseSchema = z.object({
    data: z.array(CategorySchema),
});

/**
 * Zod schema for the PackageResponse wrapper.
 */
export const PackageResponseSchema = z.object({
    data: z.array(PackageSchema),
});

/**
 * Zod schema for the ModulesResponse wrapper.
 */
export const ModulesResponseSchema = z.object({
    data: z.array(ModuleSchema),
});

/**
 * Zod schema for the UpdateTierResponse.
 */
export const UpdateTierResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

/**
 * Zod schema for the DynamicPackagesResponse.
 */
export const DynamicPackagesResponseSchema = z.object({
    message: z.string(),
});
