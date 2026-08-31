import type { BarStyle } from '@/enums/BarStyle';
import { ModuleTypes } from '@/enums/ModuleTypes';
import type { Immutable } from '@/lib/Immutable';
import type { IntRange } from '@/lib/IntRange';
import { BasicModule } from '@/models/Modules/BasicModule';

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

	get header(): string {
		return this._header;
	}

	get percentage(): IntRange<0, 100> {
		return this._percentage;
	}

	get barStyle(): BarStyle {
		return this._barStyle;
	}

	get barAnimated(): boolean {
		return this._barAnimated;
	}

	get total(): number | undefined {
		return this._total;
	}

	get target(): number | undefined {
		return this._target;
	}
}

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

	get data(): Immutable<PaymentGoalData> {
		return this._data;
	}
}
