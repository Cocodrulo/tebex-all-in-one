import type { Country } from '@/enums/CountryCodes';
import type { CurrencyCode } from '@/enums/Currencies';
import { deepFreeze, type Immutable } from '@/lib/Immutable';
import type { BasketLinks } from '@/models/Basket/BasketLinks';
import type { Coupon } from '@/models/Codes/Coupon';
import type { CreatorCode } from '@/models/Codes/CreatorCode';
import type { Giftcard } from '@/models/Codes/Giftcard';
import type { BasketPackage } from '@/models/Package';

export class Basket {
	private _id: string;
	private _ident: string;
	private _complete: boolean;
	private _email?: string;
	private _username?: string;
	private _coupons?: Coupon[];
	private _giftcards?: Giftcard[];
	private _creatorCode?: CreatorCode;
	private _cancelUrl?: string;
	private _completeUrl?: string;
	private _completeAutoRedirecTo?: boolean;
	private _country: Country;
	private _ip: string;
	private _usernameId: string;
	private _basePrice: string;
	private _salesTax: string;
	private _totalPrice: string;
	private _currency: CurrencyCode;
	private _packages: BasketPackage[] | [];
	private _custom?: object;
	private _links: BasketLinks;

	constructor(props: {
		id: string;
		ident: string;
		complete: boolean;
		email?: string;
		username?: string;
		coupons?: Coupon[];
		giftcards?: Giftcard[];
		creatorCode?: CreatorCode;
		cancelUrl?: string;
		completeUrl?: string;
		completeAutoRedirecTo?: boolean;
		country: Country;
		ip: string;
		usernameId: string;
		basePrice: string;
		salesTax: string;
		totalPrice: string;
		packages: BasketPackage[] | [];
		custom?: object;
		links: BasketLinks;
		currency: CurrencyCode;
	}) {
		this._id = props.id;
		this._ident = props.ident;
		this._complete = Boolean(props.complete);
		this._email = props.email;
		this._username = props.username;
		this._coupons = props.coupons;
		this._giftcards = props.giftcards;
		this._creatorCode = props.creatorCode;
		this._cancelUrl = props.cancelUrl;
		this._completeUrl = props.completeUrl;
		this._completeAutoRedirecTo = Boolean(props.completeAutoRedirecTo);
		this._country = props.country;
		this._ip = props.ip;
		this._usernameId = props.usernameId;
		this._basePrice = props.basePrice;
		this._salesTax = props.salesTax;
		this._totalPrice = props.totalPrice;
		this._currency = props.currency;
		this._packages = props.packages;
		this._custom = props.custom;
		this._links = props.links;
	}

	get id(): string {
		return this._id;
	}

	get ident(): string {
		return this._ident;
	}

	get complete(): boolean {
		return this._complete;
	}

	get email(): string | undefined {
		return this._email;
	}

	get username(): string | undefined {
		return this._username;
	}

	get coupons(): Immutable<Coupon[]> | undefined {
		return this._coupons ? Object.freeze(this._coupons) : undefined;
	}

	get giftcards(): Immutable<Giftcard[]> | undefined {
		return this._giftcards ? Object.freeze(this._giftcards) : undefined;
	}

	get creatorCode(): Immutable<CreatorCode> | undefined {
		return this._creatorCode ? Object.freeze(this._creatorCode) : undefined;
	}

	get cancelUrl(): string | undefined {
		return this._cancelUrl;
	}

	get completeUrl(): string | undefined {
		return this._completeUrl;
	}

	get completeAutoRedirecTo(): boolean | undefined {
		return this._completeAutoRedirecTo;
	}

	get country(): Country {
		return this._country;
	}

	get ip(): string {
		return this._ip;
	}

	get usernameId(): string {
		return this._usernameId;
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

	get packages(): Immutable<BasketPackage[] | []> {
		return Object.freeze(this._packages);
	}

	get custom(): Immutable<object> | undefined {
		return this._custom ? deepFreeze(this._custom) : undefined;
	}

	get links(): BasketLinks {
		return this._links;
	}
}
