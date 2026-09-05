import type { BarStyle } from "@/enums/BarStyle";
import { ModuleTypes } from "@/enums/ModuleTypes";
import type { Immutable } from "@/lib/Immutable";
import type { IntRange } from "@/lib/IntRange";
import { BasicModule } from "@/models/Modules/BasicModule";

/**
 * Represents the data of the Payment Goal module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#paymentgoalmodule
 */
export class PaymentGoalData {
    private _header: string;
    private _percentage: IntRange<0, 100>;
    private _barStyle: BarStyle;
    private _barAnimated: boolean;
    private _total?: number;
    private _target?: number;

    constructor(data: {
        header: string;
        percentage: IntRange<0, 100>;
        barStyle: BarStyle;
        barAnimated: boolean;
        total?: number;
        target?: number;
    }) {
        this._header = data.header;
        this._percentage = data.percentage;
        this._barStyle = data.barStyle;
        this._barAnimated = data.barAnimated;
        this._total = data.total;
        this._target = data.target;
    }

    /**
     * The header of the module.
     */
    get header(): string {
        return this._header;
    }

    /**
     * The percentage of the goal that has been reached.
     */
    get percentage(): IntRange<0, 100> {
        return this._percentage;
    }

    /**
     * The style of the bar.
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
     * The total amount of payments made towards the goal.
     */
    get total(): number | undefined {
        return this._total;
    }

    /**
     * The target amount for the goal.
     */
    get target(): number | undefined {
        return this._target;
    }
}

/**
 * Represents the Payment Goal module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#paymentgoalmodule
 */
export class PaymentGoal extends BasicModule {
    private _data: PaymentGoalData;

    constructor(props: {
        startTime: string | number | Date;
        endTime?: string | number | Date;
        id: number;
        data: PaymentGoalData;
    }) {
        super({
            startTime: props.startTime,
            endTime: props.endTime,
            id: props.id,
            type: ModuleTypes.PaymentGoal,
        });
        this._data = props.data;
    }

    /**
     * The data of the module.
     */
    get data(): Immutable<PaymentGoalData> {
        return this._data;
    }
}
