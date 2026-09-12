import { z } from "zod";

/**
 * Zod schema for TierStatus.
 *
 * Based on the OpenAPI `Tier.status` schema.
 */
export const TierStatusSchema = z.object({
    id: z.number(),
    description: z.string(),
});

/**
 * Zod schema for PendingDowngradePackage.
 *
 * Based on the OpenAPI `Tier.pending_downgrade_package` schema.
 * Nullable per the spec.
 */
export const PendingDowngradePackageSchema = z
    .object({
        id: z.number(),
        name: z.string(),
    })
    .nullable()
    .optional();

/**
 * Zod schema for a Tier.
 *
 * Based on the OpenAPI `Tier` schema.
 * All fields are required except `pending_downgrade_package` which is nullable.
 */
export const TierSchema = z.object({
    id: z.number(),
    createdAt: z.union([z.string(), z.number(), z.date()]),
    usernameId: z.string(),
    package: z.record(z.string(), z.unknown()),
    active: z.boolean(),
    recurringPaymentReference: z.string(),
    nextPaymentDate: z.union([z.string(), z.number(), z.date()]),
    status: TierStatusSchema,
    pendingDowngradePackage: PendingDowngradePackageSchema,
});
