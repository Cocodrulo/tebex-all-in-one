import type { CurrencyCode } from "@/enums/Currencies";
import type { GamePlatform, GamePlatformLabel } from "@/enums/GamePlatforms";
import type { Language } from "@/enums/Languages";
import { ensureDate } from "@/lib/EnsureDate";
import { executeApi } from "@/lib/executeApi";

export interface WebstoreProps {
    id: number;
    description: string;
    name: string;
    webstoreUrl: string;
    currency: CurrencyCode;
    lang: Language;
    logo?: string;
    platformType: GamePlatformLabel;
    platformTypeId: GamePlatform;
    disabled: boolean;
    createdAt: string | number | Date;
}

export class Webstore {
    private _id: number;
    private _description: string;
    private _name: string;
    private _webstoreUrl: string;
    private _currency: CurrencyCode;
    private _lang: Language;
    private _logo?: string;
    private _platformType: GamePlatformLabel;
    private _platformTypeId: GamePlatform;
    private _disabled: boolean;
    private _createdAt: Date;

    private constructor(props: WebstoreProps) {
        this._id = props.id;
        this._description = props.description;
        this._name = props.name;
        this._webstoreUrl = props.webstoreUrl;
        this._currency = props.currency;
        this._lang = props.lang;
        this._logo = props.logo;
        this._platformType = props.platformType;
        this._platformTypeId = props.platformTypeId;
        this._disabled = Boolean(props.disabled);
        this._createdAt = ensureDate(props.createdAt);
    }

    get id(): number {
        return this._id;
    }

    get description(): string {
        return this._description;
    }

    get name(): string {
        return this._name;
    }

    get webstoreUrl(): string {
        return this._webstoreUrl;
    }

    get currency(): CurrencyCode {
        return this._currency;
    }

    get lang(): Language {
        return this._lang;
    }

    get logo(): string {
        return this._logo;
    }

    get platformType(): string {
        return this._platformType;
    }

    get platformTypeId(): GamePlatform {
        return this._platformTypeId;
    }

    get disabled(): boolean {
        return this._disabled;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    static async fetch(token: string): Promise<Webstore> {
        if (!token) {
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );
        }

        const API = `/accounts/${encodeURIComponent(token)}`;
        const result = await executeApi<WebstoreProps>(API);

        if (!result.ok) throw new Error(result.data as string);

        return new Webstore(result.data as WebstoreProps);
    }
}
