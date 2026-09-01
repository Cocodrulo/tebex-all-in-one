import type { Country } from "@/enums/CountryCodes";
import type { CurrencyCode } from "@/enums/Currencies";
import { InvalidWebstoreId, InvalidWebstoreOrBasketId } from "@/errors/InvalidIds";
import { executeApi } from "@/lib/ExecuteApi";
import { deepFreeze, type Immutable } from "@/lib/Immutable";
import type { BasketLinks } from "@/models/Basket/BasketLinks";
import { Coupon } from "@/models/Codes/Coupon";
import { CreatorCode } from "@/models/Codes/CreatorCode";
import { Giftcard } from "@/models/Codes/Giftcard";
import { BasketPackage } from "@/models/Package";
import { BasketAuth } from "./Basket/BasketAuth";

export interface BasketProps {
    id: string;
    ident: string;
    complete: boolean;
    email?: string;
    username?: string;
    coupons?: (Coupon | object)[];
    giftcards?: (Giftcard | object)[];
    creatorCode?: CreatorCode | object;
    cancelUrl?: string;
    completeUrl?: string;
    completeAutoRedirecTo?: boolean;
    country: Country;
    ip: string;
    usernameId: string;
    basePrice: string;
    salesTax: string;
    totalPrice: string;
    packages: (BasketPackage | object)[] | [];
    custom?: object;
    links: BasketLinks;
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
    private _completeAutoRedirecTo?: boolean;
    private _country: Country;
    private _ip: string;
    private _usernameId: string;
    private _basePrice: string;
    private _salesTax: string;
    private _totalPrice: string;
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
                : new CreatorCode((props.creatorCode as any).code)
            : undefined;
        this._cancelUrl = props.cancelUrl;
        this._completeUrl = props.completeUrl;
        this._completeAutoRedirecTo = Boolean(props.completeAutoRedirecTo);
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
        this._links = props.links;

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

    get completeAutoRedirecTo(): boolean | undefined {
        return this._completeAutoRedirecTo;
    }

    get country(): Country {
        return this._country;
    }

    get ip(): string {
        return this._ip;
    }

    get usernameId(): string {
        return this._usernameId;
    }

    get basePrice(): string {
        return this._basePrice;
    }

    get salesTax(): string {
        return this._salesTax;
    }

    get totalPrice(): string {
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

    async getAuthLinks(returnUrl: string) {
        if (!this._token) {
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );
        }

        const API = `/accounts/${encodeURIComponent(this._token)}/baskets/${encodeURIComponent(this._ident)}/auth?returnUrl=${encodeURIComponent(returnUrl)}`;

        const result = await executeApi<BasketAuth>(API);

        if (result.statusCode == 422) throw new InvalidWebstoreOrBasketId();
        if (!result.ok || typeof result.data !== "object") throw new Error(result.data as string);

        return new BasketAuth(result.data.name, result.data.url);
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
        if (!token) {
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );
        }

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
}
