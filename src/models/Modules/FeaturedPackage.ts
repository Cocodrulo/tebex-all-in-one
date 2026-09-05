import { ModuleTypes } from "@/enums/ModuleTypes";
import type { Immutable } from "@/lib/Immutable";
import type { Package } from "@/models/Package";
import { BasicModule } from "@/models/Modules/BasicModule";

/**
 * Represents the data of the Featured Package module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#featuredpackagemodule
 */
export class FeaturedPackageData {
    private _header: string;
    private _package: Package;

    constructor(data: { header: string; package: Package }) {
        this._header = data.header;
        this._package = data.package;
    }

    /**
     * The header of the module.
     */
    get header(): string {
        return this._header;
    }

    /**
     * The package of the module.
     */
    get package(): Immutable<Package> {
        return this._package;
    }
}

/**
 * Represents the Featured Package module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#featuredpackagemodule
 */
export class FeaturedPackage extends BasicModule {
    private _data: FeaturedPackageData;

    constructor(data: {
        id: number;
        startTime: string | number | Date;
        endTime?: string | number | Date;
        data: FeaturedPackageData;
    }) {
        super({
            id: data.id,
            startTime: data.startTime,
            endTime: data.endTime,
            type: ModuleTypes.FeaturedPackage,
        });
        this._data = data.data;
    }

    /**
     * The data of the module.
     */
    get data(): Immutable<FeaturedPackageData> {
        return this._data;
    }
}
