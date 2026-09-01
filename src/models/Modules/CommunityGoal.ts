import { ModuleTypes } from "@/enums/ModuleTypes";
import type { BarStyle } from "@/enums/BarStyle";
import type { Immutable } from "@/lib/Immutable";
import { BasicModule } from "@/models/Modules/BasicModule";
import type { IntRange } from "@/lib/IntRange";

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
        this._header = data.header;
        this._barStyle = data.barStyle;
        this._barAnimated = data.barAnimated;
        this._percentage = data.percentage;
        this._totalPayments = data.totalPayments;
        this._target = data.target;
        this._timesAchieved = data.timesAchieved;
    }

    get header(): string {
        return this._header;
    }

    get barStyle(): BarStyle {
        return this._barStyle;
    }

    get barAnimated(): boolean {
        return this._barAnimated;
    }

    get percentage(): IntRange<0, 100> {
        return this._percentage;
    }

    get totalPayments(): number | undefined {
        return this._totalPayments;
    }

    get target(): number | undefined {
        return this._target;
    }

    get timesAchieved(): number | undefined {
        return this._timesAchieved;
    }
}

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

    get data(): Immutable<CommunityGoalData> {
        return this._data;
    }
}
