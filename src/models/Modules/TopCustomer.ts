import { ModuleTypes } from "@/enums/ModuleTypes";
import { BasicModule } from "@/models/Modules/BasicModule";

/**
 * Represents the data of the Top Customer module.
 */
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

    /**
     * The header of the module.
     */
    get header(): string {
        return this._header;
    }

    /**
     * The username of the customer.
     */
    get username(): string {
        return this._username;
    }

    /**
     * The username ID of the customer.
     */
    get usernameId(): string {
        return this._usernameId;
    }

    /**
     * The total of the customer.
     */
    get total(): number | undefined {
        return this._total;
    }
}

/**
 * Represents the Top Customer module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#topcustomermodule
 */
export class TopCustomer extends BasicModule {
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

    /**
     * The data of the module.
     */
    get data(): TopCustomerData {
        return this._data;
    }
}
