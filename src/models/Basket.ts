import type { Country } from "@/enums/CountryCodes";
import type { CurrencyCode } from "@/enums/Currencies";
import { InvalidRequest, InvalidWebstoreId, InvalidWebstoreOrBasketId } from "@/errors/InvalidData";
import type { DynamicPackageInput } from "@/interfaces/DynamicPackage";
import { executeApi } from "@/lib/ExecuteApi";
import { deepFreeze, type Immutable } from "@/lib/Immutable";
import { BasketLinks } from "@/models/Basket/BasketLinks";
import { Coupon } from "@/models/Codes/Coupon";
import { CreatorCode } from "@/models/Codes/CreatorCode";
import { Giftcard } from "@/models/Codes/Giftcard";
import { BasketPackage, Package } from "@/models/Package";
import { BasketSchema } from "@/schemas/Basket.schema";
import { BasketAuth } from "./Basket/BasketAuth";

export interface BasketProps {
    id: string;
    ident: string;
    complete: boolean;
    email?: string;
    username?: string;
    coupons?: (Coupon | object)[];
    giftcards?: (Giftcard | object)[];
    creatorCode?: CreatorCode | string | object;
    cancelUrl?: string;
    completeUrl?: string;
    completeAutoRedirect?: boolean;
    country: Country;
    ip: string;
    usernameId: number;
    basePrice: number;
    salesTax: number;
    totalPrice: number;
    packages: (BasketPackage | object)[] | [];
    custom?: object;
    links: BasketLinks | { payment: string; checkout: string };
    currency: CurrencyCode;
}

/**
 * Represents a basket in the Tebex store.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/baskets
 */
export class Basket {
    private _token: string;
    private _id: string;
    private _ident: string;
    private _complete: boolean;
    private _email?: string;
    private _username?: string;
    private _coupons?: Coupon[];
    private _giftcards?: Giftcard[];
    private _creatorCode?: CreatorCode;
    private _cancelUrl?: string;
    private _completeUrl?: string;
    private _completeAutoRedirect?: boolean;
    private _country: Country;
    private _ip: string;
    private _usernameId: number;
    private _basePrice: number;
    private _salesTax: number;
    private _totalPrice: number;
    private _currency: CurrencyCode;
    private _packages: BasketPackage[] | [];
    private _custom?: object;
    private _links: BasketLinks;

    private constructor(props: BasketProps, token: string) {
        BasketSchema.parse(props);
        this._id = props.id;
        this._ident = props.ident;
        this._complete = Boolean(props.complete);
        this._email = props.email;
        this._username = props.username;
        this._coupons = props.coupons?.map((coupon: Coupon | object) =>
            coupon instanceof Coupon ? coupon : new Coupon((coupon as { code: string }).code),
        );
        this._giftcards = props.giftcards?.map((giftcard: Giftcard | object) =>
            giftcard instanceof Giftcard
                ? giftcard
                : new Giftcard((giftcard as { cardNumber: string }).cardNumber),
        );
        this._creatorCode = props.creatorCode
            ? props.creatorCode instanceof CreatorCode
                ? props.creatorCode
                : typeof props.creatorCode === "string"
                  ? new CreatorCode(props.creatorCode)
                  : new CreatorCode((props.creatorCode as { code: string }).code)
            : undefined;
        this._cancelUrl = props.cancelUrl;
        this._completeUrl = props.completeUrl;
        this._completeAutoRedirect = Boolean(props.completeAutoRedirect);
        this._country = props.country;
        this._ip = props.ip;
        this._usernameId = props.usernameId;
        this._basePrice = props.basePrice;
        this._salesTax = props.salesTax;
        this._totalPrice = props.totalPrice;
        this._currency = props.currency;
        this._packages =
            props.packages?.map((pkg: BasketPackage | object) =>
                pkg instanceof BasketPackage
                    ? pkg
                    : new BasketPackage(pkg as ConstructorParameters<typeof BasketPackage>[0]),
            ) || [];
        this._custom = props.custom;
        this._links =
            props.links instanceof BasketLinks
                ? props.links
                : props.links
                  ? new BasketLinks(props.links.payment, props.links.checkout)
                  : new BasketLinks("", "");

        this._token = token;
    }

    /**
     * The identifier of the basket.
     */
    get id(): string {
        return this._id;
    }

    /**
     * The public identifier of the basket.
     */
    get ident(): string {
        return this._ident;
    }

    /**
     * Whether the basket is complete.
     */
    get complete(): boolean {
        return this._complete;
    }

    /**
     * The email of the basket.
     */
    get email(): string | undefined {
        return this._email;
    }

    /**
     * The username of the basket.
     */
    get username(): string | undefined {
        return this._username;
    }

    /**
     * The coupons of the basket.
     */
    get coupons(): Immutable<Coupon[]> | undefined {
        return this._coupons ? Object.freeze(this._coupons) : undefined;
    }

    /**
     * The gift cards of the basket.
     */
    get giftcards(): Immutable<Giftcard[]> | undefined {
        return this._giftcards ? Object.freeze(this._giftcards) : undefined;
    }

    /**
     * The creator code of the basket.
     */
    get creatorCode(): Immutable<CreatorCode> | undefined {
        return this._creatorCode ? Object.freeze(this._creatorCode) : undefined;
    }

    /**
     * The cancel URL of the basket.
     */
    get cancelUrl(): string | undefined {
        return this._cancelUrl;
    }

    /**
     * The complete URL of the basket.
     */
    get completeUrl(): string | undefined {
        return this._completeUrl;
    }

    /**
     * Whether the basket should automatically redirect to the complete URL.
     */
    get completeAutoRedirect(): boolean | undefined {
        return this._completeAutoRedirect;
    }

    /**
     * The country of the basket.
     */
    get country(): Country {
        return this._country;
    }

    /**
     * The IP address of the basket.
     */
    get ip(): string {
        return this._ip;
    }

    /**
     * The username ID of the basket.
     */
    get usernameId(): number {
        return this._usernameId;
    }

    /**
     * The base price of the basket (currency dependant).
     */
    get basePrice(): number {
        return this._basePrice;
    }

    /**
     * The sales tax of the basket.
     */
    get salesTax(): number {
        return this._salesTax;
    }

    /**
     * The total price of the basket (currency dependant).
     */
    get totalPrice(): number {
        return this._totalPrice;
    }

    /**
     * The currency of the basket.
     */
    get currency(): Immutable<CurrencyCode> {
        return this._currency;
    }

    /**
     * The packages of the basket.
     */
    get packages(): Immutable<BasketPackage[] | []> {
        return Object.freeze(this._packages);
    }

    /**
     * The custom data of the basket.
     */
    get custom(): Immutable<object> | undefined {
        return this._custom ? deepFreeze(this._custom) : undefined;
    }

    /**
     * The links of the basket.
     */
    get links(): BasketLinks {
        return this._links;
    }

    /**
     * Returns a list of authentication methods for the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/authorize-a-basket
     * @param returnUrl The URL to return to after authentication.
     * @returns A promise that resolves to a list of authentication methods.
     */
    async getAuthLinks(returnUrl: string): Promise<BasketAuth[]> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/auth?returnUrl=${encodeURIComponent(returnUrl)}`;

        const result = await executeApi<{ name: string; url: string }[]>(API);

        if (result.statusCode === 422) throw new InvalidWebstoreOrBasketId();
        if (!result.ok || !Array.isArray(result.data)) throw new Error(result.data as string);

        return (result.data as { name: string; url: string }[]).map(
            (auth) => new BasketAuth(auth.name, auth.url),
        );
    }

    /**
     * Adds a package to the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/add-package-to-basket
     * @param pkgOrId The package instance or package ID to add.
     * @param quantity The quantity of the package to add.
     * @param data Optional data to send with the request.
     * @returns A promise that resolves to the updated basket.
     */
    async addPackage(
        pkgOrId: Package | number,
        quantity: number,
        data?: {
            variableData?: Record<string, string | boolean | number>;
            custom?: Record<string, unknown>;
            isDynamic?: boolean;
        },
    ): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/baskets/${encodeURIComponent(this._ident)}/packages`;
        const packageId = typeof pkgOrId === "number" ? pkgOrId : pkgOrId.id;
        const result = await executeApi<BasketProps>(API, {
            method: "POST",
            body: JSON.stringify({
                package_id: packageId,
                quantity: quantity,
                dynamic: data?.isDynamic,
                variable_data: data?.variableData,
                custom: data?.custom,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, this._token);
    }

    /**
     * Removes a package from the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/remove-package-from-basket
     * @param pkg The package to remove.
     * @returns A promise that resolves to the updated basket.
     */
    async removePackage(pkg: BasketPackage): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/baskets/${encodeURIComponent(this._ident)}/packages/remove`;
        const result = await executeApi<BasketProps>(API, {
            method: "POST",
            body: JSON.stringify({
                package_id: pkg.id,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, this._token);
    }

    /**
     * Updates the quantity of a package in the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/update-package-quantity
     * @param pkg The package to update.
     * @param quantity The new quantity of the package.
     * @returns A promise that resolves to the updated basket.
     */
    async updatePackageQuantity(pkg: BasketPackage, quantity: number): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/baskets/${encodeURIComponent(this._ident)}/packages/${encodeURIComponent(pkg.id)}`;
        const result = await executeApi<BasketProps>(API, {
            method: "PUT",
            body: JSON.stringify({
                quantity: quantity,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, this._token);
    }

    /**
     * Creates dynamic packages for the basket.
     *
     * @param username The username of the basket.
     * @param categoryId The category ID of the basket.
     * @param packages The packages to create.
     * @returns A promise that resolves to true if the request was successful.
     */
    async createDynamicPackages(
        username: string,
        categoryId: number,
        packages: DynamicPackageInput[],
    ): Promise<boolean> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/dynamic-packages`;
        const result = await executeApi<{ message: string }>(API, {
            method: "PUT",
            body: JSON.stringify({
                username,
                category_id: categoryId,
                packages: packages.map((pkg) => ({
                    name: pkg.name,
                    price: pkg.price,
                    slug: pkg.slug,
                    description: pkg.description,
                    image_url: pkg.imageUrl,
                    custom: pkg.custom,
                })),
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok || typeof result.data !== "object") throw new Error(result.data as string);

        return true;
    }

    /**
     * Applies a coupon to the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/coupons/apply-coupon
     * @param couponOrCode The coupon instance or coupon code string to apply.
     * @returns A promise that resolves to the updated basket.
     */
    async applyCoupon(couponOrCode: Coupon | string): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const couponCode = typeof couponOrCode === "string" ? couponOrCode : couponOrCode.code;
        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/coupons`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                coupon_code: couponCode,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    /**
     * Removes a coupon from the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/coupons/remove-coupon
     * @param couponOrCode The coupon instance or coupon code string to remove.
     * @returns A promise that resolves to the updated basket.
     */
    async removeCoupon(couponOrCode: Coupon | string): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const couponCode = typeof couponOrCode === "string" ? couponOrCode : couponOrCode.code;
        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/coupons/remove`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                coupon_code: couponCode,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    /**
     * Applies a giftcard to the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/gift-cards/apply-gift-card
     * @param giftcardOrNumber The giftcard instance or card number string to apply.
     * @returns A promise that resolves to the updated basket.
     */
    async applyGiftcard(giftcardOrNumber: Giftcard | string): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const cardNumber =
            typeof giftcardOrNumber === "string" ? giftcardOrNumber : giftcardOrNumber.cardNumber;
        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/giftcards`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                card_number: cardNumber,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    /**
     * Removes a giftcard from the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/gift-cards/remove-gift-card
     * @param giftcardOrNumber The giftcard instance or card number string to remove.
     * @returns A promise that resolves to the updated basket.
     */
    async removeGiftcard(giftcardOrNumber: Giftcard | string): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const cardNumber =
            typeof giftcardOrNumber === "string" ? giftcardOrNumber : giftcardOrNumber.cardNumber;
        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/giftcards/remove`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                card_number: cardNumber,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    /**
     * Applies a creator code to the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/creator-codes/apply-creator-code
     * @param creatorCodeOrString The creator code instance or code string to apply.
     * @returns A promise that resolves to the updated basket.
     */
    async applyCreatorCode(creatorCodeOrString: CreatorCode | string): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const code =
            typeof creatorCodeOrString === "string"
                ? creatorCodeOrString
                : creatorCodeOrString.code;
        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/creator-codes`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                creator_code: code,
            }),
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    /**
     * Removes a creator code from the basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/creator-codes/remove-creator-code
     * @returns A promise that resolves to the updated basket.
     */
    async removeCreatorCode(): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/creator-codes/remove`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
        });

        if (result.statusCode === 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return Basket.get(this._token, this._ident);
    }

    /**
     * Creates a new basket.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/create-a-basket
     * @param token The Tebex token.
     * @param options The basket options.
     * @returns A promise that resolves to the new basket.
     */
    static async create(
        token: string,
        options: {
            completeUrl?: string;
            cancelUrl?: string;
            custom?: object;
            completeAutoRedirect?: boolean;
        },
    ) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(token)}/baskets`;
        const result = await executeApi<BasketProps>(API, {
            method: "POST",
            body: JSON.stringify({
                complete_url: options.completeUrl,
                cancel_url: options.cancelUrl,
                custom: options.custom,
                complete_auto_redirect: options.completeAutoRedirect,
            }),
        });

        if (result.statusCode === 422) throw new InvalidWebstoreId();
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, token);
    }

    /**
     * Retrieves a basket by its identifier.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/get-a-basket
     * @param token The Tebex token.
     * @param basketIdent The identifier of the basket.
     * @returns A promise that resolves to the basket.
     */
    static async get(token: string, basketIdent: string) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(token)}/baskets/${encodeURIComponent(basketIdent)}`;
        const result = await executeApi<BasketProps>(API);

        if (result.statusCode === 422) throw new InvalidWebstoreId();
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, token);
    }
}
