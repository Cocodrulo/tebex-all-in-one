import { ModuleTypes } from "@/enums/ModuleTypes";
import type { Immutable } from "@/lib/Immutable";
import { BasicModule } from "@/models/Modules/BasicModule";

/**
 * Represents the data of the Giftcard Balance module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#giftcardbalancemodule
 */
export class GiftcardBalanceData {
    private _header: string;

    constructor(data: { header: string }) {
        this._header = data.header;
    }

    /**
     * The header of the module.
     */
    get header(): string {
        return this._header;
    }
}

/**
 * Represents the Giftcard Balance module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#giftcardbalancemodule
 */
export class GiftcardBalance extends BasicModule {
    private _data: GiftcardBalanceData;

    constructor(data: {
        id: number;
        startTime: string | number | Date;
        endTime?: string | number | Date;
        data: GiftcardBalanceData;
    }) {
        super({
            id: data.id,
            startTime: data.startTime,
            endTime: data.endTime,
            type: ModuleTypes.GiftcardBalance,
        });
        this._data = data.data;
    }

    /**
     * The data of the module.
     */
    get data(): Immutable<GiftcardBalanceData> {
        return this._data;
    }
}
