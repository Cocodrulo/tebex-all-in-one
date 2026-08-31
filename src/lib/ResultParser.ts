const snakeToCamel = (str: string) => str.replace(/_([a-z])/g, (_, p1) => p1.toUpperCase());

export const parseResult = (obj: object) => {
	return JSON.parse(
		JSON.stringify(obj, (_, value) => {
			if (value && typeof value === 'object' && !Array.isArray(value)) {
				return Object.fromEntries(
					Object.entries(value).map(([k, v]) => [snakeToCamel(k), v]),
				);
			}
			return value;
		}),
	);
};
