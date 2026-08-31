import type { CurrencyCode } from '@/enums/Currencies';
import type { PackageMediaType, PackageType } from '@/enums/PackageMediaAndType';
import { ensureDate } from '@/lib/EnsureDate';
import type { Immutable } from '@/lib/Immutable';
import type { InBasketData } from '@/models/Basket/InBasketData';
import type { RevenueShare } from '@/models/Basket/RevenueShare';
import type { BaseCategory } from '@/models/Category';

export class PackageMedia {
	private _type: PackageMediaType;
	private _name: string;
	private _url: string;
	private _featured: boolean;
	private _primary: boolean;

	constructor(props: {
		type: PackageMediaType;
		name: string;
		url: string;
		featured: boolean;
		primary: boolean;
	}) {
		this._type = props.type;
		this._name = props.name;
		this._url = props.url;
		this._featured = Boolean(props.featured);
		this._primary = Boolean(props.primary);
	}

	get type(): Immutable<PackageMediaType> {
		return this._type;
	}

	get name(): string {
		return this._name;
	}

	get url(): string {
		return this._url;
	}

	get featured(): boolean {
		return this._featured;
	}

	get primary(): boolean {
		return this._primary;
	}
}

export class BasePackage {
	private _id: number;
	private _description: string;
	private _image: string;
	private _name: string;
	private _slug: string;
	private _type: PackageType;

	constructor(props: {
		id: number;
		description: string;
		image: string;
		name: string;
		slug: string;
		type: PackageType;
	}) {
		this._id = props.id;
		this._description = props.description;
		this._image = props.image;
		this._name = props.name;
		this._slug = props.slug;
		this._type = props.type;
	}

	get id(): number {
		return this._id;
	}

	get description(): string {
		return this._description;
	}

	get image(): string {
		return this._image;
	}

	get name(): string {
		return this._name;
	}

	get slug(): string {
		return this._slug;
	}

	get type(): Immutable<PackageType> {
		return this._type;
	}
}

export class BasketPackage extends BasePackage {
	private _inBasket: InBasketData;
	private _revenueShares: RevenueShare[];

	constructor(props: {
		id: number;
		description: string;
		image: string;
		name: string;
		slug: string;
		type: PackageType;
		inBasket: InBasketData;
		revenueShares: RevenueShare[];
	}) {
		super({
			id: props.id,
			description: props.description,
			image: props.image,
			name: props.name,
			slug: props.slug,
			type: props.type,
		});

		this._inBasket = props.inBasket;
		this._revenueShares = props.revenueShares;
	}

	get inBasket(): Immutable<InBasketData> {
		return this._inBasket;
	}

	get revenueShares(): Immutable<RevenueShare[]> {
		return Object.freeze(this._revenueShares);
	}
}

export class Package extends BasePackage {
	private _category: BaseCategory;
	private _basePrice: string;
	private _salesTax: string;
	private _totalPrice: string;
	private _currency: CurrencyCode;
	private _proratePrice?: number;
	private _discount?: number;
	private _disableQuantity: boolean;
	private _disbaleGifting: boolean;
	private _expirationDate?: Date;
	private _media: PackageMedia[];
	private _order: number;
	private _userLimit?: number;
	private _creatorMetaData?: object;
	private _options: unknown[];
	private _variables: unknown[];
	private _createdAt: Date;
	private _updatedAt: Date;

	constructor(props: {
		id: number;
		description: string;
		image: string;
		name: string;
		slug: string;
		type: PackageType;
		category: BaseCategory;
		basePrice: string;
		salesTax: string;
		totalPrice: string;
		currency: CurrencyCode;
		proratePrice?: number;
		discount?: number;
		disableQuantity: boolean;
		disbaleGifting: boolean;
		expirationDate?: string | number | Date;
		media: PackageMedia[];
		order: number;
		userLimit?: number;
		creatorMetaData?: object;
		options: unknown[];
		variables: unknown[];
		createdAt: string | number | Date;
		updatedAt: string | number | Date;
	}) {
		super({
			id: props.id,
			description: props.description,
			image: props.image,
			name: props.name,
			slug: props.slug,
			type: props.type,
		});

		this._category = props.category;
		this._basePrice = props.basePrice;
		this._salesTax = props.salesTax;
		this._totalPrice = props.totalPrice;
		this._currency = props.currency;
		this._proratePrice = props.proratePrice;
		this._discount = props.discount;
		this._disableQuantity = Boolean(props.disableQuantity);
		this._disbaleGifting = Boolean(props.disbaleGifting);
		this._expirationDate = ensureDate(props.expirationDate);
		this._media = props.media;
		this._order = props.order;
		this._userLimit = props.userLimit;
		this._creatorMetaData = props.creatorMetaData;
		this._options = props.options;
		this._variables = props.variables;
		this._createdAt = ensureDate(props.createdAt);
		this._updatedAt = ensureDate(props.updatedAt);
	}

	get category(): Immutable<BaseCategory> {
		return this._category;
	}

	get basePrice(): string {
		return this._basePrice;
	}

	get salesTax(): string {
		return this._salesTax;
	}

	get totalPrice(): string {
		return this._totalPrice;
	}

	get currency(): Immutable<CurrencyCode> {
		return this._currency;
	}

	get proratePrice(): number | undefined {
		return this._proratePrice;
	}

	get discount(): number | undefined {
		return this._discount;
	}

	get disableQuantity(): boolean {
		return this._disableQuantity;
	}

	get disbaleGifting(): boolean {
		return this._disbaleGifting;
	}

	get expirationDate(): Date | undefined {
		return this._expirationDate;
	}

	get media(): Immutable<PackageMedia[]> {
		return Object.freeze(this._media);
	}

	get order(): number {
		return this._order;
	}

	get userLimit(): number | undefined {
		return this._userLimit;
	}

	get creatorMetaData(): Immutable<object> | undefined {
		return this._creatorMetaData;
	}

	get options(): Immutable<unknown[]> {
		return Object.freeze(this._options);
	}

	get variables(): Immutable<unknown[]> {
		return Object.freeze(this._variables);
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}
}
