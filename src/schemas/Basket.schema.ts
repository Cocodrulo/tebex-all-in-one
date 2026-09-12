import { z } from "zod";

/**
 * Zod schema for a Coupon.
 *
 * Based on the OpenAPI `Coupon` schema.
 */
export const CouponSchema = z.object({
    code: z.string(),
});

/**
 * Zod schema for a GiftCard.
 *
 * Based on the OpenAPI `GiftCard` schema.
 */
export const GiftcardSchema = z.object({
    cardNumber: z.string(),
});

/**
 * Zod schema for a RevenueShare entry.
 *
 * Based on the OpenAPI `RevenueShare` schema.
 * All fields are required per the spec.
 */
export const RevenueShareSchema = z.object({
    walletRef: z.string(),
    amount: z.number(),
    gatewayFeePercent: z.number(),
});

/**
 * Zod schema for the InBasketData (package-in-basket info).
 *
 * Based on the OpenAPI `BasketPackage.in_basket` schema.
 * `quantity` and `price` are required; gift fields are optional.
 */
export const InBasketDataSchema = z.object({
    quantity: z.number(),
    price: z.number(),
    giftUsernameId: z.string().optional(),
    giftUsername: z.string().optional(),
});

/**
 * Zod schema for BasketLinks.
 *
 * Based on the OpenAPI `BasketLinks` schema.
 * Both `payment` and `checkout` are conditionally returned, so both are optional.
 */
export const BasketLinksSchema = z.object({
    payment: z.string().optional(),
    checkout: z.string().optional(),
});

/**
 * Zod schema for a BasketPackage.
 *
 * Based on the OpenAPI `BasketPackage` schema.
 * All fields are required per the spec except noted nullable/optional ones.
 */
export const BasketPackageSchema = z.object({
    id: z.number(),
    description: z.string(),
    image: z.string().nullable().optional(),
    name: z.string(),
    slug: z.string(),
    type: z.string(),
    inBasket: InBasketDataSchema,
    revenueShare: z.array(RevenueShareSchema).optional(),
});

/**
 * Zod schema for the Basket API response.
 *
 * Based on the OpenAPI `Basket` schema.
 * Nullable fields: `email`, `username`, `complete_url`, `custom`
 */
export const BasketSchema = z.object({
    id: z.string(),
    ident: z.string(),
    complete: z.boolean(),
    email: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    coupons: z.array(CouponSchema).optional(),
    giftcards: z.array(GiftcardSchema).optional(),
    creatorCode: z.union([z.string(), z.object({ code: z.string() })]).optional(),
    cancelUrl: z.string().optional(),
    completeUrl: z.string().nullable().optional(),
    completeAutoRedirect: z.boolean().optional(),
    country: z.string(),
    ip: z.string(),
    usernameId: z.number(),
    basePrice: z.number(),
    salesTax: z.number(),
    totalPrice: z.number(),
    currency: z.string(),
    packages: z.array(BasketPackageSchema),
    custom: z.record(z.string(), z.unknown()).nullable().optional(),
    links: BasketLinksSchema,
});
