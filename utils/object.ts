export const Keys = <T extends Record<string, unknown>>(
	object: T,
): (keyof T)[] => Object.keys(object);

/**
 * Typed version of `Object.entries`.
 *
 * @example
 * const o = { a: 1, b: 2, c: 3 };
 * const e = Entries(o);
 * //    ^? Array<["a" | "b" | "c", number]>
 */
export const Entries = <T extends Record<string, unknown>>(
	object: T,
): Array<[keyof T, T[keyof T]]> =>
	Object.entries(object) as Array<[keyof T, T[keyof T]]>;

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

/**
 * Utility type:
 * For type TData, make the properties in TKeys non-nullable
 *
 * -? removes the optional marker
 */
export type WithNonNullableKeys<TData, TKeys extends keyof TData> = Omit<
	TData,
	TKeys
> & {
	[P in TKeys]-?: NonNullable<TData[P]>;
};
