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
        this._id = props.id;
        this._ident = props.ident;
        this._complete = Boolean(props.complete);
        this._email = props.email;
        this._username = props.username;
        this._coupons = props.coupons?.map((coupon: any) =>
            coupon instanceof Coupon ? coupon : new Coupon(coupon.code),
        );
        this._giftcards = props.giftcards?.map((giftcard: any) =>
            giftcard instanceof Giftcard ? giftcard : new Giftcard(giftcard.cardNumber),
        );
        this._creatorCode = props.creatorCode
            ? props.creatorCode instanceof CreatorCode
                ? props.creatorCode
                : typeof props.creatorCode === "string"
                  ? new CreatorCode(props.creatorCode)
                  : new CreatorCode((props.creatorCode as any).code)
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
            props.packages?.map((pkg: any) =>
                pkg instanceof BasketPackage ? pkg : new BasketPackage(pkg),
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

    get id(): string {
        return this._id;
    }

    get ident(): string {
        return this._ident;
    }

    get complete(): boolean {
        return this._complete;
    }

    get email(): string | undefined {
        return this._email;
    }

    get username(): string | undefined {
        return this._username;
    }

    get coupons(): Immutable<Coupon[]> | undefined {
        return this._coupons ? Object.freeze(this._coupons) : undefined;
    }

    get giftcards(): Immutable<Giftcard[]> | undefined {
        return this._giftcards ? Object.freeze(this._giftcards) : undefined;
    }

    get creatorCode(): Immutable<CreatorCode> | undefined {
        return this._creatorCode ? Object.freeze(this._creatorCode) : undefined;
    }

    get cancelUrl(): string | undefined {
        return this._cancelUrl;
    }

    get completeUrl(): string | undefined {
        return this._completeUrl;
    }

    get completeAutoRedirect(): boolean | undefined {
        return this._completeAutoRedirect;
    }

    get country(): Country {
        return this._country;
    }

    get ip(): string {
        return this._ip;
    }

    get usernameId(): number {
        return this._usernameId;
    }

    get basePrice(): number {
        return this._basePrice;
    }

    get salesTax(): number {
        return this._salesTax;
    }

    get totalPrice(): number {
        return this._totalPrice;
    }

    get currency(): Immutable<CurrencyCode> {
        return this._currency;
    }

    get packages(): Immutable<BasketPackage[] | []> {
        return Object.freeze(this._packages);
    }

    get custom(): Immutable<object> | undefined {
        return this._custom ? deepFreeze(this._custom) : undefined;
    }

    get links(): BasketLinks {
        return this._links;
    }

    async getAuthLinks(returnUrl: string): Promise<BasketAuth[]> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/auth?returnUrl=${encodeURIComponent(returnUrl)}`;

        const result = await executeApi<{ name: string; url: string }[]>(API);

        if (result.statusCode == 422) throw new InvalidWebstoreOrBasketId();
        if (!result.ok || !Array.isArray(result.data)) throw new Error(result.data as string);

        return (result.data as { name: string; url: string }[]).map(
            (auth) => new BasketAuth(auth.name, auth.url),
        );
    }

    async addPackage(pkg: Package, quantity: number, isDynamic?: boolean): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/baskets/${encodeURIComponent(this._ident)}/packages`;
        const result = await executeApi<BasketProps>(API, {
            method: "POST",
            body: JSON.stringify({
                package_id: pkg.id,
                quantity: quantity,
                dynamic: isDynamic,
            }),
        });

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, this._token);
    }

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

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, this._token);
    }

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

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, this._token);
    }

    async createDynamicPackages(
        username: string,
        categoryId: number,
        packages: DynamicPackageInput[],
    ): Promise<{ message: string }> {
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

        return result.data as { message: string };
    }

    async applyCoupon(coupon: Coupon): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/coupons`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                coupon_code: coupon.code,
            }),
        });

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    async removeCoupon(coupon: Coupon): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/coupons/remove`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                coupon_code: coupon.code,
            }),
        });

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    async applyGiftcard(giftcard: Giftcard): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/giftcards`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                card_number: giftcard.cardNumber,
            }),
        });

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    async removeGiftcard(giftcard: Giftcard): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/giftcards/remove`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                card_number: giftcard.cardNumber,
            }),
        });

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    async applyCreatorCode(creatorCode: CreatorCode): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/creator-codes`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
            body: JSON.stringify({
                creator_code: creatorCode.code,
            }),
        });

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);
        if (typeof result.data !== "object") throw new Error(result.data as string);
        if (!result.data.success) throw new Error(result.data.message);

        return Basket.get(this._token, this._ident);
    }

    async removeCreatorCode(): Promise<Basket> {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/creator-codes/remove`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "POST",
        });

        if (result.statusCode == 422) throw new InvalidRequest(result.data as string);
        if (!result.ok) throw new Error(result.data as string);

        return Basket.get(this._token, this._ident);
    }

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

        if (result.statusCode == 422) throw new InvalidWebstoreId();
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, token);
    }

    static async get(token: string, basketIdent: string) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(token)}/baskets/${encodeURIComponent(basketIdent)}`;
        const result = await executeApi<BasketProps>(API);

        if (result.statusCode == 422) throw new InvalidWebstoreId();
        if (!result.ok) throw new Error(result.data as string);

        return new Basket(result.data as BasketProps, token);
    }
}
