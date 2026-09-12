import type { CurrencyCode } from "@/enums/Currencies";
import type { PackageMediaType, PackageType } from "@/enums/PackageMediaAndType";
import { InvalidRequest } from "@/errors/InvalidData";
import { ensureDate } from "@/lib/EnsureDate";
import { executeApi } from "@/lib/ExecuteApi";
import type { Immutable } from "@/lib/Immutable";
import { InBasketData } from "@/models/Basket/InBasketData";
import { RevenueShare } from "@/models/Basket/RevenueShare";
import { BaseCategory } from "@/models/Category";
import { PackageMediaSchema, PackageSchema } from "@/schemas/Package.schema";
import { BasketPackageSchema } from "@/schemas/Basket.schema";

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

/**
 * Represents the media of a package.
 */
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
        PackageMediaSchema.parse(props);
        this._type = props.type;
        this._name = props.name;
        this._url = props.url;
        this._featured = Boolean(props.featured);
        this._primary = Boolean(props.primary);
    }

    /**
     * The type of the media.
     */
    get type(): Immutable<PackageMediaType> {
        return this._type;
    }

    /**
     * The name of the media.
     */
    get name(): string {
        return this._name;
    }

    /**
     * The URL of the media.
     */
    get url(): string {
        return this._url;
    }

    /**
     * Whether the media is featured.
     */
    get featured(): boolean {
        return this._featured;
    }

    /**
     * Whether the media is primary.
     */
    get primary(): boolean {
        return this._primary;
    }
}

/**
 * Represents the base class for a package.
 */
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

    /**
     * The identifier of the package.
     */
    get id(): number {
        return this._id;
    }

    /**
     * The description of the package.
     */
    get description(): string {
        return this._description;
    }

    /**
     * The image of the package.
     */
    get image(): string {
        return this._image;
    }

    /**
     * The name of the package.
     */
    get name(): string {
        return this._name;
    }

    /**
     * The slug of the package.
     */
    get slug(): string {
        return this._slug;
    }

    /**
     * The type of the package.
     */
    get type(): Immutable<PackageType> {
        return this._type;
    }
}

/**
 * Represents a package that is in the basket.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/baskets
 */
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
        BasketPackageSchema.parse(props);
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
            props.revenueShare?.map((share: RevenueShare | object) =>
                share instanceof RevenueShare
                    ? share
                    : new RevenueShare(share as ConstructorParameters<typeof RevenueShare>[0]),
            ) || [];
    }

    /**
     * The basket data of the package.
     */
    get inBasket(): Immutable<InBasketData> {
        return this._inBasket;
    }

    /**
     * The revenue share of the package.
     */
    get revenueShare(): Immutable<RevenueShare[]> {
        return Object.freeze(this._revenueShare);
    }
}

/**
 * Represents a full package.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/packages
 */
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
        PackageSchema.parse(props);
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
            props.media?.map((m: PackageMedia | ConstructorParameters<typeof PackageMedia>[0]) =>
                m instanceof PackageMedia ? m : new PackageMedia(m),
            ) || [];
        this._order = props.order;
        this._userLimit = props.userLimit;
        this._creatorMetaData = props.creatorMetaData;
        this._options = props.options;
        this._variables = props.variables;
        this._createdAt = ensureDate(props.createdAt)!;
        this._updatedAt = ensureDate(props.updatedAt)!;
    }

    /**
     * The category of the package.
     */
    get category(): Immutable<BaseCategory> {
        return this._category;
    }

    /**
     * The base price of the package.
     */
    get basePrice(): number {
        return this._basePrice;
    }

    /**
     * The sales tax of the package.
     */
    get salesTax(): number {
        return this._salesTax;
    }

    /**
     * The total price of the package.
     */
    get totalPrice(): number {
        return this._totalPrice;
    }

    /**
     * The currency of the package.
     */
    get currency(): Immutable<CurrencyCode> {
        return this._currency;
    }

    /**
     * The prorate price of the package.
     */
    get proratePrice(): number | undefined {
        return this._proratePrice;
    }

    /**
     * The discount of the package.
     */
    get discount(): number | undefined {
        return this._discount;
    }

    /**
     * Whether the quantity of the package is disabled.
     */
    get disableQuantity(): boolean {
        return this._disableQuantity;
    }

    /**
     * Whether the gifting of the package is disabled.
     */
    get disableGifting(): boolean {
        return this._disableGifting;
    }

    /**
     * The expiration date of the package.
     */
    get expirationDate(): Date | undefined {
        return this._expirationDate;
    }

    /**
     * The media of the package.
     */
    get media(): Immutable<PackageMedia[]> {
        return Object.freeze(this._media);
    }

    /**
     * The order of the package.
     */
    get order(): number {
        return this._order;
    }

    /**
     * The user limit of the package.
     */
    get userLimit(): number | undefined {
        return this._userLimit;
    }

    /**
     * The creator meta data of the package.
     */
    get creatorMetaData(): Immutable<object> | undefined {
        return this._creatorMetaData;
    }

    /**
     * The options of the package.
     */
    get options(): Immutable<unknown[]> {
        return Object.freeze(this._options);
    }

    /**
     * The variables of the package.
     */
    get variables(): Immutable<unknown[]> {
        return Object.freeze(this._variables);
    }

    /**
     * The date on which the package was created.
     */
    get createdAt(): Date {
        return this._createdAt;
    }

    /**
     * The date on which the package was last updated.
     */
    get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * Updates the tier of the package.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/tiers/update-tier
     * @param tierId The identifier of the tier.
     * @returns A promise that resolves to the updated package.
     */
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

    /**
     * Retrieves a list of packages.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/packages/get-packages
     * @param token The Tebex public token.
     * @param ip The IP address of the request.
     * @param basketIdent The basket identifier.
     * @returns A promise that resolves to an array of packages.
     */
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

        if (!result.ok || result.statusCode === 422 || typeof result.data !== "object")
            throw new InvalidRequest(result.data as string);

        return (result.data as PackageProps[]).map((pkg) => new Package(token, pkg));
    }

    /**
     * Retrieves a specific package.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/packages/get-package
     * @param token The Tebex public token.
     * @param packageId The identifier of the package.
     * @returns A promise that resolves to the package.
     */
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
