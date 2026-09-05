import { ModuleTypes } from "@/enums/ModuleTypes";
import { ensureDate } from "@/lib/EnsureDate";
import type { Immutable } from "@/lib/Immutable";
import { BasicModule } from "@/models/Modules/BasicModule";

/**
 * Represents a recent payment.
 */
export class RecentPayment {
    private _username: string;
    private _usernameId: string;
    private _package: { name: string };
    private _createdAt?: Date;
    private _price?: number;
    private _currency?: string;

    /**
     * Creates a new instance of RecentPayment.
     * @param data The data to create the RecentPayment from.
     */
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

    /**
     * The username of the user who made the payment.
     */
    get username(): string {
        return this._username;
    }

    /**
     * The ID of the user who made the payment.
     */
    get usernameId(): string {
        return this._usernameId;
    }

    /**
     * The package that was purchased.
     */
    get package(): { name: string } {
        return this._package;
    }

    /**
     * The date and time when the payment was created.
     */
    get createdAt(): Date | undefined {
        return this._createdAt;
    }

    /**
     * The price of the payment.
     */
    get price(): number | undefined {
        return this._price;
    }

    /**
     * The currency of the payment.
     */
    get currency(): string | undefined {
        return this._currency;
    }
}

/**
 * Represents the data of the Recent Payments module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#recentpaymentsmodule
 */
export class RecentPaymentsData {
    private _header: string;
    private _payments: RecentPayment[];

    constructor(data: { header: string; payments: RecentPayment[] }) {
        this._header = data.header;
        this._payments = data.payments;
    }

    /**
     * The header of the module.
     */
    get header(): string {
        return this._header;
    }

    /**
     * The payments of the module.
     */
    get payments(): Immutable<RecentPayment[]> {
        return Object.freeze(this._payments);
    }
}

/**
 * Represents the Recent Payments module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#recentpaymentsmodule
 */
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

        this._data = new RecentPaymentsData({
            header: data.data.header,
            payments:
                (data.data.payments as any[])?.map((payment) =>
                    payment instanceof RecentPayment ? payment : new RecentPayment(payment),
                ) || [],
        });
    }

    /**
     * The data of the module.
     */
    get data(): RecentPaymentsData {
        return this._data;
    }
}
