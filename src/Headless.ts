import { createBasicAuth } from "./lib/BasicAuth";
import type { HeadlessOptions } from "./interfaces/HeadlessOptions";
import { Basket } from "./models/Basket";
import { Category } from "./models/Category";
import { BasicModule, type Module } from "./models/Modules/BasicModule";
import { Package } from "./models/Package";
import { Page } from "./models/Page";
import { Tier } from "./models/Tier";
import { Webstore } from "./models/Webstore";

/**
 * Represents the Headless tebex API.
 *
 * @warning This class uses a static singleton pattern that is **NOT safe for SSR/multi-tenant** environments.
 * In server-side rendering or multi-tenant setups, the singleton is shared across all requests,
 * which can cause data leakage between users/sessions. For those scenarios, instantiate directly
 * or use a per-request context.
 *
 * @see https://docs.tebex.io/developers/headless-api/
 */
export class Headless {
    private _token: string;
    private _privateKey: string | null;
    private static _headless: Headless | null = null;

    private constructor(options: HeadlessOptions) {
        this._token = options.token;
        this._privateKey = options.privateKey ?? null;

        if (this._privateKey && typeof window !== "undefined") {
            console.warn(
                "[tebex-all-in-one] WARNING: A privateKey was provided in a browser environment. " +
                    "The privateKey will be exposed in the client bundle. " +
                    "Operations requiring privateKey (e.g. tiers) should only be executed from a server environment (Node.js, edge functions, etc.).",
            );
        }
    }

    /**
     * Initializes the Headless class with the given options.
     *
     * @param options The options for the Headless class. Private key is only needed for managing tiers.
     * @returns The initialized Headless class.
     */
    static init(options: HeadlessOptions): Headless {
        Headless._headless = new Headless(options);
        return Headless._headless;
    }

    /**
     * Destroys the current instance of the Headless class.
     */
    static destroy(): void {
        Headless._headless = null;
    }

    /**
     * Gets the current instance of the Headless class.
     *
     * @returns The current instance of the Headless class.
     * @throws Error if the Headless class is not initialized.
     */
    static get headless(): Headless {
        if (Headless._headless === null)
            throw new Error(
                "Headless is not initialized. Please call Headless.init(options) first.",
            );
        return Headless._headless;
    }

    /**
     * Gets the webstore data associated with the store.
     *
     * @see https://docs.tebex.io/developers/headless-api/endpoints#get
     * @returns A promise that resolves to the webstore.
     */
    async webstore(): Promise<Webstore> {
        return await Webstore.fetch(this._token);
    }

    /**
     * Gets all pages associated with the given token.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/pages/get-custom-pages
     * @returns A promise that resolves to an array of pages.
     */
    async pages(): Promise<Page[]> {
        return await Page.fetch(this._token);
    }

    /**
     * Creates a new basket for the given token.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/create-a-basket
     * @param options The options for creating the basket.
     * @returns A promise that resolves to a new basket.
     */
    async createBasket(options: {
        completeUrl?: string;
        cancelUrl?: string;
        custom?: object;
        completeAutoRedirect?: boolean;
    }): Promise<Basket> {
        return await Basket.create(this._token, options);
    }

    /**
     * Gets a basket by its identifier.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/baskets/get-a-basket
     * @param ident The identifier of the basket.
     * @returns A promise that resolves to the basket.
     */
    async getBasketById(ident: string): Promise<Basket> {
        return await Basket.get(this._token, ident);
    }

    /**
     * Gets all categories for the given token.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/categories/get-categories
     * @param options The options for getting the categories.
     * @returns A promise that resolves to an array of categories.
     */
    async categories(options?: {
        includePackages?: boolean;
        tieredInfoUsernameId?: number;
        dynamicBasketIdent?: string;
    }): Promise<Category[]> {
        return await Category.fetch(this._token, options);
    }

    /**
     * Gets a category by its identifier.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/categories/get-category
     * @param categoryId The identifier of the category.
     * @param options The options for getting the category.
     * @returns A promise that resolves to the category.
     */
    async getCategoryById(
        categoryId: string,
        options?: {
            includePackages?: boolean;
            dynamicBasketIdent?: string;
        },
    ): Promise<Category> {
        return await Category.get(this._token, categoryId, options);
    }

    /**
     * Gets all packages for the given token.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/packages/get-packages
     * @param options The options for getting the packages.
     * @returns A promise that resolves to an array of packages.
     */
    async packages(options?: { ip?: string; basketIdent?: string }): Promise<Package[]> {
        return await Package.fetch(this._token, options);
    }

    /**
     * Gets a package by its identifier.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/packages/get-package
     * @param packageId The identifier of the package.
     * @returns A promise that resolves to the package.
     */
    async getPackageById(packageId: number): Promise<Package> {
        return await Package.get(this._token, packageId);
    }

    /**
     * Gets all modules for the given token.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules
     * @returns A promise that resolves to an array of modules.
     */
    async modules(): Promise<Module[]> {
        return await BasicModule.fetch(this._token);
    }

    /**
     * Updates a tier.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/tiers/update-a-tier
     * @param tierId The identifier of the tier.
     * @param packageId The identifier of the package to update to.
     * @returns A promise that resolves to whether the tier was updated.
     */
    async updateTier(tierId: string, packageId?: number): Promise<boolean> {
        if (!this._privateKey) throw new Error("Private key is required for updating tiers.");
        return await Tier.updateTier(
            tierId,
            createBasicAuth(this._token, this._privateKey),
            packageId,
        );
    }
}
