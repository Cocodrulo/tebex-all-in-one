import { ModuleTypes } from "@/enums/ModuleTypes";
import { ensureDate } from "@/lib/EnsureDate";
import type { Immutable } from "@/lib/Immutable";
import { BasicModule } from "@/models/Modules/BasicModule";

export class RecentPayment {
    private _username: string;
    private _usernameId: string;
    private _package: { name: string };
    private _createdAt?: Date;
    private _price?: number;
    private _currency?: string;

    constructor(data: {
        username: string;
        usernameId: string;
        package: { name: string };
        createdAt?: string | number | Date;
        price?: number;
        currency?: string;
    }) {
        this._username = data.username;
        this._usernameId = data.usernameId;
        this._package = data.package;
        this._createdAt = ensureDate(data.createdAt);
        this._price = data.price;
        this._currency = data.currency;
    }

    get username(): string {
        return this._username;
    }

    get usernameId(): string {
        return this._usernameId;
    }

    get package(): { name: string } {
        return this._package;
    }

    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    get price(): number | undefined {
        return this._price;
    }

    get currency(): string | undefined {
        return this._currency;
    }
}

export class RecentPaymentsData {
    private _header: string;
    private _payments: RecentPayment[];

    constructor(data: { header: string; payments: RecentPayment[] }) {
        this._header = data.header;
        this._payments = data.payments;
    }

    get header(): string {
        return this._header;
    }

    get payments(): Immutable<RecentPayment[]> {
        return Object.freeze(this._payments);
    }
}

export class RecentPayments extends BasicModule {
    private _data: RecentPaymentsData;

    constructor(data: {
        id: number;
        startTime: string | number | Date;
        endTime?: string | number | Date;
        data: RecentPaymentsData;
    }) {
        super({
            id: data.id,
            startTime: data.startTime,
            endTime: data.endTime,
            type: ModuleTypes.RecentPayments,
        });
    }

    get data(): RecentPaymentsData {
        return this._data;
    }
}
