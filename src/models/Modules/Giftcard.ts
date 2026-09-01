import { ModuleTypes } from "@/enums/ModuleTypes";
import type { Immutable } from "@/lib/Immutable";
import { BasicModule } from "@/models/Modules/BasicModule";

export class GiftcardBalanceData {
    private _header: string;

    constructor(data: { header: string }) {
        this._header = data.header;
    }

    get header(): string {
        return this._header;
    }
}

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

    get data(): Immutable<GiftcardBalanceData> {
        return this._data;
    }
}
