import type { ModuleTypes } from '@//enums/ModuleTypes';
import { ensureDate } from '@//lib/EnsureDate';

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
}
