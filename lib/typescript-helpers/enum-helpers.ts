import * as R from 'ramda';
import * as yup from 'yup';
import * as ObjectHelpers from './object-helpers';

export type TsEnumObject<K extends string = string> = Readonly<{
	[key in K]: key;
}>;
const _getEnumObject = <K extends string>(
	options: Record<number, K>,
): TsEnumObject<K> =>
	R.uniq(ObjectHelpers.Keys(options)).reduce((acc, v) => {
		const key = options[v] as K;
		return { ...acc, [key]: key };
	}, {} as TsEnumObject<K>);

const _isTsEnumMember =
	<K extends string>(options: K[]) =>
	(str: unknown): str is K =>
		options.some((s) => s === str);

const _getEnumRegex = (options: string[]) =>
	new RegExp(options.join('|'), 'gi');

export const getEnum = <K extends string>(
	members: Record<number, K>,
	defaultValue: K = members[0] as K,
) => {
	const obj = _getEnumObject(members);
	const arr = ObjectHelpers.Keys(obj);
	return {
		arr,
		isMember: _isTsEnumMember(arr),
		obj,
		regex: _getEnumRegex(arr),
		toDefinedSchemaWithDefault: () =>
			yup.mixed<K>().oneOf(arr).default(defaultValue),
		toDefinedSchema: () => yup.mixed<K>().oneOf(arr).defined(),
		toOptionalSchema: () => yup.mixed<K>().oneOf(arr),
	} as const;
};
export type TsEnumType<K extends string> = ReturnType<typeof getEnum> &
	Readonly<{
		arr: K[];
		obj: TsEnumObject<K>;
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
