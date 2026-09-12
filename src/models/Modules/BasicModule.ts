import { ModuleTypes } from "@/enums/ModuleTypes";
import { setModuleCreator } from "./BaseModule";
import { TopCustomer } from "./TopCustomer";
import { Textbox } from "./Textbox";
import { RecentPayments } from "./RecentPayments";
import { FeaturedPackage } from "./FeaturedPackage";
import { GiftcardBalance } from "./Giftcard";
import { ServerStatus } from "./ServerStatus";
import { PaymentGoal } from "./PaymentGoal";
import { CommunityGoal } from "./CommunityGoal";

export { BasicModule } from "./BaseModule";

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

setModuleCreator((mod) => {
    const moduleType = mod.type as ModuleTypes;
    const Constructor = MODULES[moduleType];
    if (!Constructor) throw new Error(`Unknown module type: ${mod.type}`);
    return new Constructor(mod);
});
