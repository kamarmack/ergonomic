export const Keys = <T extends Record<string, unknown>>(
	object: T,
): (keyof T)[] => Object.keys(object);

export type Writeable<T> = {
	-readonly [K in keyof T]: T[K];
};

export const getAlphabetizedObject = <T extends Record<string, unknown>>(
	json: T,
): T =>
	Keys(json)
		.sort()
		.reduce((acc, k) => ({ ...acc, [k]: json[k] } as T), {} as T);

export const getJsonString = (obj: unknown) =>
	JSON.stringify(
		obj,
		(_, value) => (typeof value === 'undefined' ? null : value) as unknown,
		'\t',
	);
