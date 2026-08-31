export function ensureDate(value: string | number | Date): Date {
	if (value instanceof Date) return value;
	return new Date(value);
}
