import type { CategoryDisplay } from "@/enums/CategoryDisplay";
import { executeApi } from "@/lib/ExecuteApi";
import type { Immutable } from "@/lib/Immutable";
import { Package, type PackageProps } from "@/models/Package";
import type { PendingDowngradePackageData, TierStatus } from "@/interfaces/Tier";
import { CategorySchema } from "@/schemas/Category.schema";
import { Tier } from "./Tier";
import { bt64, type BasicAuth } from "@/lib/BasicAuth";

interface CategoryProps {
    id: number;
    name: string;
    slug: string;
    parent?: { id: number; name: string };
    activeTier?: {
        id: number;
        createdAt: string | number | Date;
        usernameId: string;
        package: PackageProps;
        active: boolean;
        recurringPaymentReference: string;
        nextPaymentDate: string | number | Date;
        status: TierStatus;
        pendingDowngradePackage: PendingDowngradePackageData;
    };
    description: string;
    packages: (Package | PackageProps)[];
    order: number;
    displayType: CategoryDisplay;
    imageUrl?: string;
    dynamic: boolean;
    tiered: boolean;
}

/**
 * Represents a base category in the Tebex store.
 * This class is used to represent a category without the full category data.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/categories
 */
export class BaseCategory {
    private _id: number;
    private _name: string;

    constructor(props: { id: number; name: string }) {
        this._id = props.id;
        this._name = props.name;
    }

    /**
     * The identifier of the category.
     */
    get id(): number {
        return this._id;
    }

    /**
     * The name of the category.
     */
    get name(): string {
        return this._name;
    }
}

/**
 * Represents a full category in the Tebex store.
 * This class extends the BaseCategory class and adds more information about the category.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/categories
 */
export class Category extends BaseCategory {
    private _slug: string;
    private _parent?: BaseCategory;
    private _activeTier?: Tier;
    private _description: string;
    private _packages: Package[];
    private _order: number;
    private _displayType: CategoryDisplay;
    private _imageUrl?: string;
    private _dynamic: boolean;
    private _tiered: boolean;

    constructor(token: string, props: CategoryProps) {
        super({ id: props.id, name: props.name });
        CategorySchema.parse(props);
        this._slug = props.slug;
        this._parent = props.parent
            ? props.parent instanceof BaseCategory
                ? props.parent
                : new BaseCategory(props.parent)
            : undefined;
        this._activeTier = props.activeTier
            ? props.activeTier instanceof Tier
                ? props.activeTier
                : new Tier({
                      id: props.activeTier.id,
                      createdAt: props.activeTier.createdAt,
                      usernameId: props.activeTier.usernameId,
                      pkg: new Package(token, props.activeTier.package as PackageProps),
                      active: props.activeTier.active,
                      recurringPaymentReference: props.activeTier.recurringPaymentReference,
                      nextPaymentDate: props.activeTier.nextPaymentDate,
                      status: props.activeTier.status,
                      pendingDowngradePackage: props.activeTier.pendingDowngradePackage,
                  })
            : undefined;
        this._description = props.description;
        this._packages =
            props.packages?.map((pkg: Package | PackageProps) =>
                pkg instanceof Package ? pkg : new Package(token, pkg),
            ) || [];
        this._order = props.order;
        this._displayType = props.displayType;
        this._imageUrl = props.imageUrl;
        this._dynamic = Boolean(props.dynamic);
        this._tiered = Boolean(props.tiered);
    }

    /**
     * The slug of the category.
     */
    get slug(): string {
        return this._slug;
    }

    /**
     * The parent category of the category.
     */
    get parent(): Immutable<BaseCategory | undefined> {
        return this._parent;
    }

    /**
     * The active tier of the category.
     */
    get activeTier(): Immutable<Tier> | undefined {
        return this._activeTier;
    }

    /**
     * The description of the category.
     */
    get description(): string {
        return this._description;
    }

    /**
     * The packages of the category.
     */
    get packages(): Immutable<Package[]> {
        return Object.freeze(this._packages);
    }

    /**
     * The order of the category.
     */
    get order(): Immutable<number> {
        return this._order;
    }

    /**
     * The display type of the category.
     */
    get displayType(): Immutable<CategoryDisplay> {
        return this._displayType;
    }

    /**
     * The image URL of the category.
     */
    get imageUrl(): Immutable<string | undefined> {
        return this._imageUrl;
    }

    /**
     * Whether the category is dynamic.
     */
    get dynamic(): Immutable<boolean> {
        return this._dynamic;
    }

    /**
     * Whether the category is tiered.
     */
    get tiered(): Immutable<boolean> {
        return this._tiered;
    }

    /**
     * Fetches all categories.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/categories/get-categories
     * @see https://docs.tebex.io/developers/headless-api/guides/categories/get-categories-include-packages
     *
     * @param token The Tebex public token.
     * @param options Options for fetching categories.
     * @returns A promise that resolves to an array of categories.
     */
    static async fetch(
        token: string,
        {
            includePackages = false,
            dynamicBasketIdent,
            tieredInfoUsernameId,
            basicAuth,
        }: {
            includePackages?: boolean;
            dynamicBasketIdent?: string;
            tieredInfoUsernameId?: number;
            basicAuth?: BasicAuth;
        } = {},
    ) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const shouldIncludePackages = includePackages || tieredInfoUsernameId || dynamicBasketIdent;

        const searchParams = new URLSearchParams();
        if (shouldIncludePackages) searchParams.append("includePackages", "true");
        if (tieredInfoUsernameId && basicAuth)
            searchParams.append("usernameId", String(tieredInfoUsernameId));
        if (dynamicBasketIdent) searchParams.append("basketIdent", dynamicBasketIdent);

        const API = `/accounts/${encodeURIComponent(token)}/categories?${searchParams.toString()}`;

        const result = await executeApi<CategoryProps[]>(
            API,
            basicAuth
                ? {
                      headers: {
                          Authorization: `Basic ${bt64(basicAuth)}`,
                      },
                  }
                : undefined,
        );

        if (!result.ok || typeof result.data !== "object") throw new Error(result.data as string);

        return (result.data as CategoryProps[]).map((category) => new Category(token, category));
    }

    /**
     * Fetches a specific category.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/categories/get-category
     * @see https://docs.tebex.io/developers/headless-api/guides/categories/get-category-include-packages
     *
     * @param token The Tebex public token.
     * @param categoryId The identifier of the category.
     * @param options Options for fetching the category.
     * @returns A promise that resolves to the category.
     */
    static async get(
        token: string,
        categoryId: string,
        {
            includePackages = false,
            dynamicBasketIdent,
        }: { includePackages?: boolean; dynamicBasketIdent?: string } = {},
    ) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const shouldIncludePackages = includePackages || dynamicBasketIdent;

        const searchParams = new URLSearchParams();
        if (shouldIncludePackages) searchParams.append("includePackages", "true");
        if (dynamicBasketIdent) searchParams.append("basketIdent", dynamicBasketIdent);

        const query = searchParams.toString();
        const API = `/accounts/${encodeURIComponent(token)}/categories/${encodeURIComponent(categoryId)}${query ? `?${query}` : ""}`;

        const result = await executeApi<CategoryProps>(API);

        if (!result.ok || typeof result.data !== "object") throw new Error(result.data as string);

        return new Category(token, result.data as CategoryProps);
    }
}
