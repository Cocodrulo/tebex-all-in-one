import type { HeadlessOptions } from "./interfaces/HeadlessOptions";
import { Page } from "./models/Page";
import { Webstore } from "./models/Webstore";

export class Headless {
    private _token: string;
    private static _headless: Headless | null = null;

    private constructor(options: HeadlessOptions) {
        this._token = options.token;
    }

    static async init(options: HeadlessOptions): Promise<Headless> {
        return new Headless(options);
    }

    static get headless(): Headless {
        if (Headless._headless == null)
            throw new Error(
                "Headless is not initialized. Please call Headless.init(options) first.",
            );
        return Headless._headless;
    }

    async webstore(): Promise<Webstore> {
        return await Webstore.fetch(this._token);
    }

    async pages(): Promise<Page[]> {
        return await Page.fetch(this._token);
    }
}
