import type { CategoryDisplay } from "@/enums/CategoryDisplay";
import { executeApi } from "@/lib/ExecuteApi";
import type { Immutable } from "@/lib/Immutable";
import { Package, type PackageProps } from "@/models/Package";
import type { PendingDowngradePackageData, TierStatus } from "@/interfaces/Tier";
import { Tier } from "./Tier";
import type { BasicAuth } from "@/interfaces/BasicAuth";

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

export class BaseCategory {
    private _id: number;
    private _name: string;

    constructor(props: { id: number; name: string }) {
        this._id = props.id;
        this._name = props.name;
    }

    get id(): number {
        return this._id;
    }

    get name(): string {
        return this._name;
    }
}

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
            props.packages?.map((pkg: any) =>
                pkg instanceof Package ? pkg : new Package(token, pkg),
            ) || [];
        this._order = props.order;
        this._displayType = props.displayType;
        this._imageUrl = props.imageUrl;
        this._dynamic = Boolean(props.dynamic);
        this._tiered = Boolean(props.tiered);
    }

    get slug(): string {
        return this._slug;
    }

    get parent(): Immutable<BaseCategory | undefined> {
        return this._parent;
    }

    get activeTier(): Immutable<Tier> | undefined {
        return this._activeTier;
    }

    get description(): string {
        return this._description;
    }

    get packages(): Immutable<Package[]> {
        return Object.freeze(this._packages);
    }

    get order(): Immutable<number> {
        return this._order;
    }

    get displayType(): Immutable<CategoryDisplay> {
        return this._displayType;
    }

    get imageUrl(): Immutable<string | undefined> {
        return this._imageUrl;
    }

    get dynamic(): Immutable<boolean> {
        return this._dynamic;
    }

    get tiered(): Immutable<boolean> {
        return this._tiered;
    }

    static async fetch(
        token: string,
        {
            includePackages = false,
            dynamicBasketIdent,
            tieredInfoUsername,
            basicAuth,
        }: {
            includePackages?: boolean;
            dynamicBasketIdent?: string;
            tieredInfoUsername?: number;
            basicAuth?: BasicAuth;
        } = {},
    ) {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const shouldIncludePackages = includePackages || tieredInfoUsername || dynamicBasketIdent;

        const searchParams = new URLSearchParams();
        if (shouldIncludePackages) searchParams.append("includePackages", "true");
        if (tieredInfoUsername && basicAuth)
            searchParams.append("usernameId", String(tieredInfoUsername));
        if (dynamicBasketIdent) searchParams.append("basketIdent", dynamicBasketIdent);

        const API = `/accounts/${encodeURIComponent(token)}/categories?${searchParams.toString()}`;

        const result = await executeApi<CategoryProps[]>(
            API,
            basicAuth
                ? {
                      headers: {
                          Authorization: `Basic ${btoa(basicAuth)}`,
                      },
                  }
                : undefined,
        );

        if (!result.ok || typeof result.data !== "object") throw new Error(result.data as string);

        return (result.data as CategoryProps[]).map((category) => new Category(token, category));
    }

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

        const API = `/accounts/${encodeURIComponent(token)}/categories/${encodeURIComponent(categoryId)}${shouldIncludePackages ? "?includePackages=true" : ""}${dynamicBasketIdent ? `&basketIdent=${dynamicBasketIdent}` : ""}`;

        const result = await executeApi<CategoryProps>(API);

        if (!result.ok || typeof result.data !== "object") throw new Error(result.data as string);

        return new Category(token, result.data as CategoryProps);
    }
}
