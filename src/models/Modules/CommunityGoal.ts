import { ModuleTypes } from "@/enums/ModuleTypes";
import type { BarStyle } from "@/enums/BarStyle";
import type { Immutable } from "@/lib/Immutable";
import { BasicModule } from "./BaseModule";
import type { IntRange } from "@/lib/IntRange";
import { CommunityGoalDataSchema } from "@/schemas/Module.schema";

/**
 * Represents the data of the Community Goal module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#communitygoalmodule
 */
export class CommunityGoalData {
    private _header: string;
    private _barStyle: BarStyle;
    private _barAnimated: boolean;
    private _percentage: IntRange<0, 100>;
    private _totalPayments?: number;
    private _target?: number;
    private _timesAchieved?: number;

    constructor(data: {
        header: string;
        barStyle: BarStyle;
        barAnimated: boolean;
        percentage: IntRange<0, 100>;
        totalPayments?: number;
        target?: number;
        timesAchieved?: number;
    }) {
        CommunityGoalDataSchema.parse(data);
        this._header = data.header;
        this._barStyle = data.barStyle;
        this._barAnimated = data.barAnimated;
        this._percentage = data.percentage;
        this._totalPayments = data.totalPayments;
        this._target = data.target;
        this._timesAchieved = data.timesAchieved;
    }

    /**
     * The header of the module.
     */
    get header(): string {
        return this._header;
    }

    /**
     * The bar style of the module.
     */
    get barStyle(): BarStyle {
        return this._barStyle;
    }

    /**
     * Whether the bar is animated.
     */
    get barAnimated(): boolean {
        return this._barAnimated;
    }

    /**
     * The percentage of the goal that has been reached.
     */
    get percentage(): IntRange<0, 100> {
        return this._percentage;
    }

    /**
     * The total payments made towards the goal.
     */
    get totalPayments(): number | undefined {
        return this._totalPayments;
    }

    /**
     * The target amount for the goal.
     */
    get target(): number | undefined {
        return this._target;
    }

    /**
     * The number of times the goal has been achieved.
     */
    get timesAchieved(): number | undefined {
        return this._timesAchieved;
    }
}

/**
 * Represents the Community Goal module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#communitygoalmodule
 */
export class CommunityGoal extends BasicModule {
    private _data: CommunityGoalData;

    constructor(data: {
        id: number;
        startTime: string | number | Date;
        endTime?: string | number | Date;
        data: CommunityGoalData;
    }) {
        super({
            id: data.id,
            startTime: data.startTime,
            endTime: data.endTime,
            type: ModuleTypes.CommunityGoal,
        });
        this._data = data.data;
    }

    /**
     * The data of the module.
     */
    get data(): Immutable<CommunityGoalData> {
        return this._data;
    }
}
