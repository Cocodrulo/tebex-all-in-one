import { ModuleTypes } from '@/enums/ModuleTypes';
import type { Immutable } from '@/lib/Immutable';
import type { Package } from '@/models/Package';
import { BasicModule } from '@/models/Modules/BasicModule';

export class FeaturedPackageData {
	private _header: string;
	private _package: Package;

	constructor(data: { header: string; package: Package }) {
		this._header = data.header;
		this._package = data.package;
	}

	get header(): string {
		return this._header;
	}

	get package(): Immutable<Package> {
		return this._package;
	}
}

export class FeaturedPackage extends BasicModule {
	private _data: FeaturedPackageData;

	constructor(data: {
		id: number;
		startTime: string | number | Date;
		endTime?: string | number | Date;
		data: FeaturedPackageData;
	}) {
		super({
			id: data.id,
			startTime: data.startTime,
			endTime: data.endTime,
			type: ModuleTypes.FeaturedPackage,
		});
		this._data = data.data;
	}

	get data(): Immutable<FeaturedPackageData> {
		return this._data;
	}
}
