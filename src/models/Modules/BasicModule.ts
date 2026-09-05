import { ModuleTypes } from "@/enums/ModuleTypes";
import { ensureDate } from "@/lib/EnsureDate";
import { TopCustomer } from "./TopCustomer";
import { Textbox } from "./Textbox";
import { RecentPayments } from "./RecentPayments";
import { FeaturedPackage } from "./FeaturedPackage";
import { GiftcardBalance } from "./Giftcard";
import { ServerStatus } from "./ServerStatus";
import { PaymentGoal } from "./PaymentGoal";
import { CommunityGoal } from "./CommunityGoal";
import { executeApi } from "@/lib/ExecuteApi";

export type Module =
    | TopCustomer
    | Textbox
    | RecentPayments
    | FeaturedPackage
    | GiftcardBalance
    | ServerStatus
    | PaymentGoal
    | CommunityGoal;

type ModuleConstructor = new (data: any) => Module;

export const MODULES: Record<ModuleTypes, ModuleConstructor> = {
    [ModuleTypes.TopCustomer]: TopCustomer,
    [ModuleTypes.TextBox]: Textbox,
    [ModuleTypes.RecentPayments]: RecentPayments,
    [ModuleTypes.FeaturedPackage]: FeaturedPackage,
    [ModuleTypes.GiftcardBalance]: GiftcardBalance,
    [ModuleTypes.ServerStatus]: ServerStatus,
    [ModuleTypes.PaymentGoal]: PaymentGoal,
    [ModuleTypes.CommunityGoal]: CommunityGoal,
};

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

    get id(): number {
        return this._id;
    }

    get type(): ModuleTypes {
        return this._type;
    }

    get startTime(): Date {
        return this._startTime;
    }

    get endTime(): Date | undefined {
        return this._endTime;
    }

    static async fetch(token: string): Promise<Module[]> {
        if (!token) throw new Error("Token is required");

        const API = `/accounts/${encodeURIComponent(token)}/sidebar`;

        const result = await executeApi<{ type: ModuleTypes; [key: string]: unknown }[]>(API);

        if (!result.ok || !Array.isArray(result.data)) throw new Error(result.data as string);

        return result.data.map((mod) => {
            const moduleType = mod.type as ModuleTypes;
            const Constructor = MODULES[moduleType];
            if (!Constructor) throw new Error(`Unknown module type: ${mod.type}`);
            return new Constructor(mod);
        });
    }
}
