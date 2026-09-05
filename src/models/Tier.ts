import { InvalidRequest } from "@/errors/InvalidData";
import type { BasicAuth } from "@/interfaces/BasicAuth";
import type { PendingDowngradePackageData, TierStatus } from "@/interfaces/Tier";
import { ensureDate } from "@/lib/EnsureDate";
import { executeApi } from "@/lib/ExecuteApi";
import type { Package } from "@/models/Package";

/**
 * Represents a tier.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/tiers
 */
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

    constructor({
        id,
        createdAt,
        usernameId,
        pkg,
        active,
        recurringPaymentReference,
        nextPaymentDate,
        status,
        pendingDowngradePackage,
    }: {
        id: number;
        createdAt: string | number | Date;
        usernameId: string;
        pkg: Package;
        active: boolean;
        recurringPaymentReference: string;
        nextPaymentDate: string | number | Date;
        status: TierStatus;
        pendingDowngradePackage: PendingDowngradePackageData;
    }) {
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

    /**
     * Updates a user's tier.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/tiers/update-a-tier
     * @param tierId The identifier of the tier to update.
     * @param auth The authentication for the webstore. Composed by publicToken:privateKey
     * @param packageId The identifier of the package to update to.
     * @returns A promise that resolves to the updated tier.
     */
    static async updateTier(tierId: string, auth: BasicAuth, packageId?: number): Promise<boolean> {
        if (!auth || !auth.match(/\w+:\w+/))
            throw new InvalidRequest(
                "Invalid authentication for the webstore. Composed by publicToken:privateKey",
            );

        const API = `/accounts/tiers/${encodeURIComponent(tierId)}`;

        const result = await executeApi<{ success: boolean; message: string }>(API, {
            body: JSON.stringify({
                package_id: packageId,
            }),
            method: "PATCH",
            headers: {
                Authorization: `Basic ${btoa(auth)}`,
            },
        });

        if (!result.ok) throw new InvalidRequest(result.data as string);

        return result.ok && typeof result.data === "object" && result.data?.success;
    }
}
