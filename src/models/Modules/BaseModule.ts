import { ModuleTypes } from "@/enums/ModuleTypes";
import { ensureDate } from "@/lib/EnsureDate";
import { executeApi } from "@/lib/ExecuteApi";
import type { Module } from "./BasicModule";

export type ModuleCreator = (mod: { type: ModuleTypes; [key: string]: unknown }) => Module;

let _moduleCreator: ModuleCreator | null = null;

/**
 * Sets the module creator function used by BasicModule.fetch().
 * @internal
 */
export function setModuleCreator(creator: ModuleCreator): void {
    _moduleCreator = creator;
}

/**
 * Represents a Tebex module common data.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules
 */
export abstract class BasicModule {
    protected readonly _id: number;
    protected readonly _type: ModuleTypes;
    protected readonly _startTime: Date;
    protected readonly _endTime?: Date;

    protected constructor(props: {
        type: ModuleTypes;
        startTime: string | number | Date;
        endTime?: string | number | Date;
        id: number;
    }) {
        this._id = props.id;
        this._type = props.type;
        this._startTime = ensureDate(props.startTime);
        this._endTime = props.endTime ? ensureDate(props.endTime) : undefined;
    }

    /**
     * The identifier of the module.
     */
    get id(): number {
        return this._id;
    }

    /**
     * The type of the module (TopCustomer, Textbox, RecentPayments, FeaturedPackage, GiftcardBalance, ServerStatus, PaymentGoal and CommunityGoal).
     */
    get type(): ModuleTypes {
        return this._type;
    }

    /**
     * The start time of the module.
     */
    get startTime(): Date {
        return this._startTime;
    }

    /**
     * The end time of the module.
     */
    get endTime(): Date | undefined {
        return this._endTime;
    }

    /**
     * Retrieves all modules from the sidebar.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules
     * @param token The Tebex token.
     * @returns A promise that resolves to an array of modules.
     */
    static async fetch(token: string): Promise<Module[]> {
        if (!token) throw new Error("Token is required");

        const API = `/accounts/${encodeURIComponent(token)}/sidebar`;

        const result = await executeApi<{ type: ModuleTypes; [key: string]: unknown }[]>(API);

        if (!result.ok || !Array.isArray(result.data)) throw new Error(result.data as string);

        if (!_moduleCreator) throw new Error("Module creator has not been initialized");

        return result.data.map((mod) => _moduleCreator!(mod));
    }
}
