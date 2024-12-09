import * as R from 'ramda';
import * as yup from 'yup';
import * as changeCase from 'change-case';
import { Keys } from 'ergonomic/typescript/object.js';

export type GeneralizedEnumObject<K extends string = string> = Readonly<{
	[key in K]: key;
}>;
const getEnumObject = <K extends string>(
	options: Record<number, K>,
): GeneralizedEnumObject<K> =>
	R.uniq(Keys(options)).reduce((acc, v) => {
		const key = options[v] as K;
		return { ...acc, [key]: key };
	}, {} as GeneralizedEnumObject<K>);

const validateGeneralizedEnumMember =
	<K extends string>(options: K[]) =>
	(str: unknown): str is K =>
		options.some((s) => s === str);

const getEnumRegex = (options: string[]) => new RegExp(options.join('|'), 'gi');

const getDefaultLabelByEnumOptionObject = (
	arr: string[],
): Record<string, string> => {
	return R.mapObjIndexed(
		(_, i) => changeCase.sentenceCase(i),
		R.invertObj(arr),
	);
};

export const getEnum = <K extends string>(
	members: Record<number, K>,
	defaultValue: K = members[0] as K,
) => {
	const obj = getEnumObject(members);
	const arr = Keys(obj);
	return {
		arr,
		isMember: validateGeneralizedEnumMember(arr),
		obj,
		regex: getEnumRegex(arr),
		getDefinedSchemaWithDefault: () =>
			yup
				.mixed<K>()
				.oneOf(arr)
				.default(defaultValue)
				.meta({
					label_by_enum_option: getDefaultLabelByEnumOptionObject(arr),
					type: 'select_one',
				}),
		getDefinedSchema: () =>
			yup
				.mixed<K>()
				.oneOf(arr)
				.defined()
				.meta({
					label_by_enum_option: getDefaultLabelByEnumOptionObject(arr),
					type: 'select_one',
				}),
		getOptionalSchema: () =>
			yup
				.mixed<K>()
				.oneOf(arr)
				.meta({
					label_by_enum_option: getDefaultLabelByEnumOptionObject(arr),
					type: 'select_one',
				}),
	} as const;
};
export type GeneralizedEnumType<K extends string> = ReturnType<typeof getEnum> &
	Readonly<{
		arr: K[];
		obj: GeneralizedEnumObject<K>;
	}>;

export const getOrderedEnum = <K extends string>(
	members: Record<number, K>,
	options: {
		defaultValue?: K;
		titles?: string[];
	},
) => {
	const indices = Object.keys(members).map((i) => parseInt(i));
	const numSteps = indices.length;
	const stepWeight = Math.trunc(100 / numSteps) / 100;
	const arrPercentage = indices.map((i) =>
		i === numSteps - 1 ? 1 : (i + 1) * stepWeight,
	);
	const firstPercentage = arrPercentage[0] as number;
	const objSteps = arrPercentage.slice().reduce(
		(acc, percentage, i) => ({
			...acc,
			[members[i] as string]: percentage,
		}),
		{} as Record<K, number>,
	) as Readonly<Record<K, number>>;
	const objStepIndices = arrPercentage.slice().reduce(
		(acc, _, i) => ({
			...acc,
			[members[i] as string]: i,
		}),
		{} as Record<K, number>,
	) as Readonly<Record<K, number>>;
	const objPercentage = R.invertObj(objSteps) as Readonly<Record<number, K>>;
	const nearestPercentage = (numberValue: unknown): number =>
		typeof numberValue === 'number'
			? R.reverse(arrPercentage).find(
					(percentage) => numberValue >= percentage,
			  ) || firstPercentage
			: firstPercentage;
	const nearestStep = (numberValue: number): K =>
		objPercentage[nearestPercentage(numberValue)] as K;
	return {
		...getEnum(
			members,
			'defaultValue' in options ? options.defaultValue : (members[0] as K),
		),
		arrPercentage,
		nearestPercentage,
		nearestStep,
		objPercentage,
		objSteps,
		objStepIndices,
		titles: options?.titles || (members as K[]),
	} as const;
};

export type Exc<T, V extends T> = Exclude<T, V>;
export type Ext<T, V extends T> = Extract<T, V>;

/**
 * Extracts the keys of an enum object.
 *
 * @example
 * ```typescript
 * const FruitEnum = getEnum(['apple', 'orange', 'pear']);
 * type Fruit = EnumMember<typeof FruitEnum>; // => 'apple' | 'orange' | 'pear'
 *
 * const VeggieEnum = getEnum(['carrot', 'green_beans', 'cauliflower', 'celery']);
 * type Veggie = EnumMember<typeof VeggieEnum>; // => 'carrot' | 'green_beans' | 'cauliflower' | 'celery'
 * ```
 */
export type EnumMember<T> = T extends { obj: Record<infer K, unknown> }
	? K
	: never;
