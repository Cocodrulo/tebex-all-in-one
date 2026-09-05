import type { CurrencyCode } from "@/enums/Currencies";
import type { PackageMediaType, PackageType } from "@/enums/PackageMediaAndType";
import { InvalidRequest } from "@/errors/InvalidData";
import { ensureDate } from "@/lib/EnsureDate";
import { executeApi } from "@/lib/ExecuteApi";
import type { Immutable } from "@/lib/Immutable";
import { InBasketData } from "@/models/Basket/InBasketData";
import { RevenueShare } from "@/models/Basket/RevenueShare";
import { BaseCategory } from "@/models/Category";

export interface PackageProps {
    id: number;
    description: string;
    image: string;
    name: string;
    slug: string;
    type: PackageType;
    category: BaseCategory;
    basePrice: number;
    salesTax: number;
    totalPrice: number;
    currency: CurrencyCode;
    proratePrice?: number;
    discount?: number;
    disableQuantity: boolean;
    disableGifting: boolean;
    expirationDate?: string | number | Date;
    media: PackageMedia[];
    order: number;
    userLimit?: number;
    creatorMetaData?: object;
    options: readonly unknown[];
    variables: readonly unknown[];
    createdAt: string | number | Date;
    updatedAt: string | number | Date;
}

export class PackageMedia {
    private _type: PackageMediaType;
    private _name: string;
    private _url: string;
    private _featured: boolean;
    private _primary: boolean;

    constructor(props: {
        type: PackageMediaType;
        name: string;
        url: string;
        featured: boolean;
        primary: boolean;
    }) {
        this._type = props.type;
        this._name = props.name;
        this._url = props.url;
        this._featured = Boolean(props.featured);
        this._primary = Boolean(props.primary);
    }

    get type(): Immutable<PackageMediaType> {
        return this._type;
    }

    get name(): string {
        return this._name;
    }

    get url(): string {
        return this._url;
    }

    get featured(): boolean {
        return this._featured;
    }

    get primary(): boolean {
        return this._primary;
    }
}

export class BasePackage {
    private _id: number;
    private _description: string;
    private _image: string;
    private _name: string;
    private _slug: string;
    private _type: PackageType;

    constructor(props: {
        id: number;
        description: string;
        image: string;
        name: string;
        slug: string;
        type: PackageType;
    }) {
        this._id = props.id;
        this._description = props.description;
        this._image = props.image;
        this._name = props.name;
        this._slug = props.slug;
        this._type = props.type;
    }

    get id(): number {
        return this._id;
    }

    get description(): string {
        return this._description;
    }

    get image(): string {
        return this._image;
    }

    get name(): string {
        return this._name;
    }

    get slug(): string {
        return this._slug;
    }

    get type(): Immutable<PackageType> {
        return this._type;
    }
}

export class BasketPackage extends BasePackage {
    private _inBasket: InBasketData;
    private _revenueShare: RevenueShare[];

    constructor(props: {
        id: number;
        description: string;
        image: string;
        name: string;
        slug: string;
        type: PackageType;
        inBasket: object;
        revenueShare: object[];
    }) {
        super({
            id: props.id,
            description: props.description,
            image: props.image,
            name: props.name,
            slug: props.slug,
            type: props.type,
        });

        this._inBasket = new InBasketData(props.inBasket as InBasketData);
        this._revenueShare =
            props.revenueShare?.map((share: any) =>
                share instanceof RevenueShare ? share : new RevenueShare(share),
            ) || [];
    }

    get inBasket(): Immutable<InBasketData> {
        return this._inBasket;
    }

    get revenueShare(): Immutable<RevenueShare[]> {
        return Object.freeze(this._revenueShare);
    }
}

export class Package extends BasePackage {
    private _token: string;
    private _category: BaseCategory;
    private _basePrice: number;
    private _salesTax: number;
    private _totalPrice: number;
    private _currency: CurrencyCode;
    private _proratePrice?: number;
    private _discount?: number;
    private _disableQuantity: boolean;
    private _disableGifting: boolean;
    private _expirationDate?: Date;
    private _media: PackageMedia[];
    private _order: number;
    private _userLimit?: number;
    private _creatorMetaData?: object;
    private _options: readonly unknown[];
    private _variables: readonly unknown[];
    private _createdAt: Date;
    private _updatedAt: Date;

    constructor(token: string, props: PackageProps) {
        super({
            id: props.id,
            description: props.description,
            image: props.image,
            name: props.name,
            slug: props.slug,
            type: props.type,
        });

        this._token = token;

        this._category =
            props.category instanceof BaseCategory
                ? props.category
                : new BaseCategory(props.category);
        this._basePrice = props.basePrice;
        this._salesTax = props.salesTax;
        this._totalPrice = props.totalPrice;
        this._currency = props.currency;
        this._proratePrice = props.proratePrice;
        this._discount = props.discount;
        this._disableQuantity = Boolean(props.disableQuantity);
        this._disableGifting = Boolean(props.disableGifting);
        this._expirationDate = ensureDate(props.expirationDate);
        this._media =
            props.media?.map((m: any) => (m instanceof PackageMedia ? m : new PackageMedia(m))) ||
            [];
        this._order = props.order;
        this._userLimit = props.userLimit;
        this._creatorMetaData = props.creatorMetaData;
        this._options = props.options;
        this._variables = props.variables;
        this._createdAt = ensureDate(props.createdAt)!;
        this._updatedAt = ensureDate(props.updatedAt)!;
    }

    get category(): Immutable<BaseCategory> {
        return this._category;
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

    get proratePrice(): number | undefined {
        return this._proratePrice;
    }

    get discount(): number | undefined {
        return this._discount;
    }

    get disableQuantity(): boolean {
        return this._disableQuantity;
    }

    get disableGifting(): boolean {
        return this._disableGifting;
    }

    get expirationDate(): Date | undefined {
        return this._expirationDate;
    }

    get media(): Immutable<PackageMedia[]> {
        return Object.freeze(this._media);
    }

    get order(): number {
        return this._order;
    }

    get userLimit(): number | undefined {
        return this._userLimit;
    }

    get creatorMetaData(): Immutable<object> | undefined {
        return this._creatorMetaData;
    }

    get options(): Immutable<unknown[]> {
        return Object.freeze(this._options);
    }

    get variables(): Immutable<unknown[]> {
        return Object.freeze(this._variables);
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    async updateTier(tierId: number) {
        if (!this._token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        if (!this.id) throw new Error("Package ID is required to update a tier");

        const API = `/accounts/${encodeURIComponent(this._token)}/tiers/${encodeURIComponent(tierId)}`;
        const result = await executeApi<{ success: boolean; message: string }>(API, {
            method: "PATCH",
            body: JSON.stringify({
                package_id: this.id,
            }),
        });

        if (!result.ok || typeof result.data !== "object" || !result.data.success)
            throw new Error(result.data as string);

        return Package.get(this._token, this.id);
    }

    static async fetch(
        token: string,
        { ip, basketIdent }: { ip?: string; basketIdent?: string } = {},
    ) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const searchParams = new URLSearchParams();
        if (ip) searchParams.append("ip", ip);
        if (basketIdent) searchParams.append("basketIdent", basketIdent);

        const API = `/accounts/${encodeURIComponent(token)}/packages?${searchParams.toString()}`;

        const result = await executeApi<PackageProps[]>(API);

        if (!result.ok || result.statusCode == 422 || typeof result.data !== "object")
            throw new InvalidRequest(result.data as string);

        return (result.data as PackageProps[]).map((pkg) => new Package(token, pkg));
    }

    static async get(token: string, packageId: number) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(token)}/packages/${encodeURIComponent(packageId)}`;

        const result = await executeApi<PackageProps>(API);

        if (!result.ok || typeof result.data !== "object")
            throw new InvalidRequest(result.data as string);

        return new Package(token, result.data as PackageProps);
    }
}
