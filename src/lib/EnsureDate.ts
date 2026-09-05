export function ensureDate(value: string | number | Date): Date;
export function ensureDate(value?: string | number | Date | null): Date | undefined;
export function ensureDate(value?: string | number | Date | null): Date | undefined {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    return new Date(value);
}
