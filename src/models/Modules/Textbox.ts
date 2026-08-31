import { ModuleTypes } from '@/enums/ModuleTypes';
import { BasicModule } from '@/models/Modules/BasicModule';

export class TextboxData {
	private _header: string;
	private _text: string;

	constructor(data: { header: string; text: string }) {
		this._header = data.header;
		this._text = data.text;
	}

	get header(): string {
		return this._header;
	}

	get text(): string {
		return this._text;
	}
}

export class TextboxModule extends BasicModule {
	private _data: TextboxData;

	constructor(data: {
		id: number;
		startTime: string | number | Date;
		endTime?: string | number | Date;
		data: TextboxData;
	}) {
		super({
			id: data.id,
			startTime: data.startTime,
			endTime: data.endTime,
			type: ModuleTypes.TextBox,
		});
		this._data = data.data;
	}

	get data(): TextboxData {
		return this._data;
	}
}
