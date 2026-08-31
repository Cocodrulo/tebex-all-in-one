import { ensureDate } from '@/lib/EnsureDate';
import { executeApi } from '@/lib/executeApi';

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

	get id(): number {
		return this._id;
	}

	get createdAt(): Date {
		return this._createdAt;
	}

	get updatedAt(): Date {
		return this._updatedAt;
	}

	get accountId(): number {
		return this._accountId;
	}

	get title(): string {
		return this._title;
	}

	get slug(): string {
		return this._slug;
	}

	get private(): boolean {
		return this._private;
	}

	get hidden(): boolean {
		return this._hidden;
	}

	get disabled(): boolean {
		return this._disabled;
	}

	get sequence(): boolean {
		return this._sequence;
	}

	get content(): string {
		return this._content;
	}

	static async fetch(token: string): Promise<Page[]> {
		if (!token) {
			throw new Error(
				'Required parameter token was null or undefined when calling this function',
			);
		}

		const API = `/accounts/${encodeURIComponent(token)}/pages`;
		const result = await executeApi<PageProps[]>(API);

		if (!result.ok) throw new Error(result.data as string);

		return (result.data as PageProps[]).map((data) => new Page(data));
	}
}
