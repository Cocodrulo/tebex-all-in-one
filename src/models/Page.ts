import { ensureDate } from "@/lib/EnsureDate";
import { executeApi } from "@/lib/ExecuteApi";
import { PageSchema } from "@/schemas/Page.schema";

export interface PageProps {
    id: number;
    createdAt: string | number | Date;
    updatedAt: string | number | Date;
    accountId: number;
    title: string;
    slug: string;
    private: boolean;
    hidden: boolean;
    disabled: boolean;
    sequence: boolean;
    content: string;
}

/**
 * Represents a single page.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/pages/get-custom-pages
 */
export class Page {
    private _id: number;
    private _createdAt: Date;
    private _updatedAt: Date;
    private _accountId: number;
    private _title: string;
    private _slug: string;
    private _private: boolean;
    private _hidden: boolean;
    private _disabled: boolean;
    private _sequence: boolean;
    private _content: string;

    private constructor(props: PageProps) {
        PageSchema.parse(props);
        this._id = props.id;
        this._createdAt = ensureDate(props.createdAt);
        this._updatedAt = ensureDate(props.updatedAt);
        this._accountId = props.accountId;
        this._title = props.title;
        this._slug = props.slug;
        this._private = Boolean(props.private);
        this._hidden = Boolean(props.hidden);
        this._disabled = Boolean(props.disabled);
        this._sequence = Boolean(props.sequence);
        this._content = props.content;
    }

    /**
     * The identifier of the page.
     */
    get id(): number {
        return this._id;
    }

    /**
     * The date on which the page was created.
     */
    get createdAt(): Date {
        return this._createdAt;
    }

    /**
     * The date on which the page was last updated.
     */
    get updatedAt(): Date {
        return this._updatedAt;
    }

    /**
     * The identifier of the account.
     */
    get accountId(): number {
        return this._accountId;
    }

    /**
     * The title of the page.
     */
    get title(): string {
        return this._title;
    }

    /**
     * The slug of the page.
     */
    get slug(): string {
        return this._slug;
    }

    /**
     * Whether the page is private.
     */
    get private(): boolean {
        return this._private;
    }

    /**
     * Whether the page is hidden.
     */
    get hidden(): boolean {
        return this._hidden;
    }

    /**
     * Whether the page is disabled.
     */
    get disabled(): boolean {
        return this._disabled;
    }

    /**
     * Whether the page is included in the sequence.
     */
    get sequence(): boolean {
        return this._sequence;
    }

    /**
     * The content of the page.
     */
    get content(): string {
        return this._content;
    }

    /**
     * Fetches all the pages.
     *
     * @see https://docs.tebex.io/developers/headless-api/guides/pages/get-custom-pages
     * @param token The Tebex public token.
     * @returns A promise that resolves to an array of pages.
     */
    static async fetch(token: string): Promise<Page[]> {
        if (!token)
            throw new Error(
                "Required parameter token was null or undefined when calling this function",
            );

        const API = `/accounts/${encodeURIComponent(token)}/pages`;
        const result = await executeApi<PageProps[]>(API);

        if (!result.ok) throw new Error(result.data as string);

        return (result.data as PageProps[]).map((data) => new Page(data));
    }
}
