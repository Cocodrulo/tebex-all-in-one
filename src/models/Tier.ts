import type { PendingDowngradePackageData, TierStatus } from "@/interfaces/Tier";
import { ensureDate } from "@/lib/EnsureDate";
import type { Package } from "@/models/Package";

export class Tier {
    private _id: number;
    private _createdAt: Date;
    private _usernameId: string;
    private _package: Package;
    private _active: boolean;
    private _recurringPaymentReference: string;
    private _nextPaymentDate: Date;
    private _status: TierStatus;
    private _pendingDowngradePackage: PendingDowngradePackageData;

    constructor(
        id: number,
        createdAt: string | number | Date,
        usernameId: string,
        pkg: Package,
        active: boolean,
        recurringPaymentReference: string,
        nextPaymentDate: string | number | Date,
        status: TierStatus,
        pendingDowngradePackage: PendingDowngradePackageData,
    ) {
        this._id = id;
        this._createdAt = ensureDate(createdAt);
        this._usernameId = usernameId;
        this._package = pkg;
        this._active = Boolean(active);
        this._recurringPaymentReference = recurringPaymentReference;
        this._nextPaymentDate = ensureDate(nextPaymentDate);
        this._status = status;
        this._pendingDowngradePackage = pendingDowngradePackage;
    }

    get id(): number {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get usernameId(): string {
        return this._usernameId;
    }

    get package(): Package {
        return this._package;
    }

    get active(): boolean {
        return this._active;
    }

    get recurringPaymentReference(): string {
        return this._recurringPaymentReference;
    }

    get nextPaymentDate(): Date {
        return this._nextPaymentDate;
    }

    get status(): TierStatus {
        return this._status;
    }

    get pendingDowngradePackage(): PendingDowngradePackageData {
        return this._pendingDowngradePackage;
    }
}
