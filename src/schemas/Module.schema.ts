import { z } from "zod";
import { PackageSchema } from "./Package.schema";

/**
 * Zod schema for ModuleBase.
 *
 * Based on the OpenAPI `ModuleBase` schema.
 * Required: `id`, `type`, `start_time`, `data`
 * `end_time` is nullable.
 */
export const ModuleBaseSchema = z.object({
    id: z.number(),
    type: z.string(),
    startTime: z.union([z.string(), z.number(), z.date()]),
    endTime: z.union([z.string(), z.number(), z.date()]).nullable().optional(),
    data: z.record(z.string(), z.unknown()),
});

// ─── TopCustomer ────────────────────────────────────────────────────

/**
 * Zod schema for TopCustomerData.
 *
 * Required: `header`, `username`, `username_id`
 * Optional: `total`
 */
export const TopCustomerDataSchema = z.object({
    header: z.string(),
    username: z.string(),
    usernameId: z.string(),
    total: z.number().optional(),
});

export const TopCustomerModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("top_customer"),
    data: TopCustomerDataSchema,
});

// ─── Textbox ────────────────────────────────────────────────────────

/**
 * Zod schema for TextboxData.
 *
 * Required: `header`, `text`
 */
export const TextboxDataSchema = z.object({
    header: z.string(),
    text: z.string(),
});

export const TextboxModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("textbox"),
    data: TextboxDataSchema,
});

// ─── RecentPayments ─────────────────────────────────────────────────

/**
 * Zod schema for a RecentPayment entry.
 *
 * Required: `username`, `username_id`, `package`
 * Optional/nullable: `created_at`, `price`, `currency`
 */
export const RecentPaymentSchema = z.object({
    username: z.string(),
    usernameId: z.string(),
    package: z.object({
        name: z.string(),
    }),
    createdAt: z.union([z.string(), z.number(), z.date()]).nullable().optional(),
    price: z.number().nullable().optional(),
    currency: z.string().nullable().optional(),
});

/**
 * Zod schema for RecentPaymentsData.
 *
 * Required: `header`, `payments`
 */
export const RecentPaymentsDataSchema = z.object({
    header: z.string(),
    payments: z.array(RecentPaymentSchema),
});

export const RecentPaymentsModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("recent_payments"),
    data: RecentPaymentsDataSchema,
});

// ─── FeaturedPackage ────────────────────────────────────────────────

/**
 * Zod schema for FeaturedPackageData.
 *
 * Required: `header`, `package`
 */
export const FeaturedPackageDataSchema = z.object({
    header: z.string(),
    package: PackageSchema,
});

export const FeaturedPackageModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("featured_package"),
    data: FeaturedPackageDataSchema,
});

// ─── GiftcardBalance ────────────────────────────────────────────────

/**
 * Zod schema for GiftcardBalanceData.
 *
 * Required: `header`
 */
export const GiftcardBalanceDataSchema = z.object({
    header: z.string(),
});

export const GiftcardBalanceModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("giftcard_balance"),
    data: GiftcardBalanceDataSchema,
});

// ─── ServerStatus ───────────────────────────────────────────────────

/**
 * Zod schema for Players.
 *
 * Required: `online`, `max`
 */
export const PlayersSchema = z.object({
    online: z.number(),
    max: z.number(),
});

/**
 * Zod schema for ServerStatusData.
 *
 * Required: `header`, `hostname`, `port`, `online`, `players`
 * `players` is nullable (null when server is offline).
 */
export const ServerStatusDataSchema = z.object({
    header: z.string(),
    hostname: z.string(),
    port: z.number(),
    online: z.boolean(),
    players: PlayersSchema.nullable(),
});

export const ServerStatusModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("server_status"),
    data: ServerStatusDataSchema,
});

// ─── PaymentGoal ────────────────────────────────────────────────────

/**
 * Zod schema for PaymentGoalData.
 *
 * Required: `header`, `percentage`, `bar_style`, `bar_animated`
 * Optional/nullable: `total`, `target`
 */
export const PaymentGoalDataSchema = z.object({
    header: z.string(),
    percentage: z.number().min(0).max(100),
    barStyle: z.enum(["normal", "striped"]),
    barAnimated: z.boolean(),
    total: z.number().nullable().optional(),
    target: z.number().nullable().optional(),
});

export const PaymentGoalModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("payment_goal"),
    data: PaymentGoalDataSchema,
});

// ─── CommunityGoal ──────────────────────────────────────────────────

/**
 * Zod schema for CommunityGoalData.
 *
 * Required: `header`, `bar_style`, `bar_animated`, `percentage`
 * Optional/nullable: `total_payments`, `target`, `times_achieved`
 */
export const CommunityGoalDataSchema = z.object({
    header: z.string(),
    barStyle: z.enum(["normal", "striped"]),
    barAnimated: z.boolean(),
    percentage: z.number().min(0).max(100),
    totalPayments: z.number().nullable().optional(),
    target: z.number().nullable().optional(),
    timesAchieved: z.number().nullable().optional(),
});

export const CommunityGoalModuleSchema = ModuleBaseSchema.extend({
    type: z.literal("community_goal"),
    data: CommunityGoalDataSchema,
});

// ─── Discriminated Union ────────────────────────────────────────────

/**
 * Discriminated union of all module schemas, keyed by `type`.
 */
export const ModuleSchema = z.discriminatedUnion("type", [
    TopCustomerModuleSchema,
    TextboxModuleSchema,
    RecentPaymentsModuleSchema,
    FeaturedPackageModuleSchema,
    GiftcardBalanceModuleSchema,
    ServerStatusModuleSchema,
    PaymentGoalModuleSchema,
    CommunityGoalModuleSchema,
]);
