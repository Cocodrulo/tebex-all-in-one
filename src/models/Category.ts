import type { CategoryDisplay } from "@/enums/CategoryDisplay";
import type { Immutable } from "@/lib/Immutable";
import type { Package } from "@/models/Package";

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
    private _activeTier: number;
    private _description: string;
    private _packages: Package[];
    private _orders: number;
    private _displayType: CategoryDisplay;
    private _imageUrl?: string;
    private _dynamic: boolean;

    constructor(props: {
        id: number;
        name: string;
        slug: string;
        parent?: BaseCategory;
        activeTier: number;
        description: string;
        packages: Package[];
        orders: number;
        displayType: CategoryDisplay;
        imageUrl?: string;
        dynamic: boolean;
    }) {
        super({ id: props.id, name: props.name });
        this._slug = props.slug;
        this._parent = props.parent;
        this._activeTier = props.activeTier;
        this._description = props.description;
        this._packages = props.packages;
        this._orders = props.orders;
        this._displayType = props.displayType;
        this._imageUrl = props.imageUrl;
        this._dynamic = Boolean(props.dynamic);
    }

    get slug(): string {
        return this._slug;
    }

    get parent(): Immutable<BaseCategory | undefined> {
        return this._parent;
    }

    get activeTier(): Immutable<number> {
        return this._activeTier;
    }

    get description(): string {
        return this._description;
    }

    get packages(): Immutable<Package[]> {
        return Object.freeze(this._packages);
    }

    get orders(): Immutable<number> {
        return this._orders;
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
}
