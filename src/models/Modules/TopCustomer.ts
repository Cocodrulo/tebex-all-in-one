import { ModuleTypes } from "@/enums/ModuleTypes";
import { BasicModule } from "@/models/Modules/BasicModule";

export class TopCustomerData {
    private _header: string;
    private _username: string;
    private _usernameId: string;
    private _total?: number;

    constructor(data: TopCustomerData) {
        this._header = data.header;
        this._username = data.username;
        this._usernameId = data.usernameId;
        this._total = data.total;
    }

    get header(): string {
        return this._header;
    }

    get username(): string {
        return this._username;
    }

    get usernameId(): string {
        return this._usernameId;
    }

    get total(): number | undefined {
        return this._total;
    }
}

export class TopCustomerModule extends BasicModule {
    private _data: TopCustomerData;

    constructor(data: {
        id: number;
        startTime: string | number | Date;
        endTime?: string | number | Date;
        data: TopCustomerData;
    }) {
        super({
            id: data.id,
            startTime: data.startTime,
            endTime: data.endTime,
            type: ModuleTypes.TopCustomer,
        });
        this._data = data.data;
    }

    get data(): TopCustomerData {
        return this._data;
    }
}
