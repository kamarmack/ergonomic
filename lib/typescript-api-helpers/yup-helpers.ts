import * as yup from 'yup';
import * as YupSchemaHelpers from 'yup/lib/schema';
import * as TsHelpers from '../typescript-helpers';
import {
	getUtcDateNow,
	isCurrencyUsdCents,
	isDuration,
	isEmailAddress,
	isFilePath,
	isInterval,
	isPhoneNumberUnitedStates,
	isRecurrenceRule,
	isUtcDate,
	isWebHost,
	isWebUrl,
	getDocumentIdString,
	isDocumentIdString,
} from '../data-format-helpers';
import * as UUID from 'uuid';

export const YupTypeEnum = TsHelpers.getEnum([
	'array',
	'boolean',
	'mixed',
	'number',
	'string',
]);
export type YupType = keyof typeof YupTypeEnum.obj;

export type FieldSchema = YupSchemaHelpers.SchemaObjectDescription & {
	innerType?: YupSchemaHelpers.SchemaInnerTypeDescription;
};

export const YupHelpers = {
	array: <T extends Parameters<ReturnType<typeof yup.array>['of']>[0]>(
		types: T,
	) => yup.array().default([]).of<T>(types),
	constant: <T extends boolean | string | number>(value: T) =>
		yup.mixed<T>().oneOf([value]).default(value),
	date: () =>
		yup
			.string()
			.test({
				message: '${path} is not a UTC Date',
				name: 'is-utc-date',
				test: (value) => value === '' || isUtcDate(value),
			})
			.default(''),
	duration: () =>
		yup
			.string()
			.test({
				message: '${path} is not a Duration',
				name: 'is-duration',
				test: (value) => value === '' || isDuration(value),
			})
			.default(''),
	emailAddress: () =>
		yup
			.string()
			.test({
				message: '${path} is not an email address',
				name: 'is-email-address',
				test: (value: unknown) => value === '' || isEmailAddress(value),
			})
			.default(''),
	filePath: () =>
		yup
			.string()
			.test({
				message: '${path} is not a File Path',
				name: 'is-filePath',
				test: (value) => value === '' || isFilePath(value),
			})
			.default(''),
	growthRate: () => yup.number().default(0),
	interval: () =>
		yup
			.string()
			.test({
				message: '${path} is not a Interval',
				name: 'is-interval',
				test: (value) => value === '' || isInterval(value),
			})
			.default(''),
	now: () =>
		yup
			.string()
			.test({
				message: '${path} is not a UTC Date',
				name: 'is-utc-date',
				test: isUtcDate,
			})
			.default(getUtcDateNow),
	phoneNumber: () =>
		yup
			.string()
			.test({
				message: '${path} is not a US phone number',
				name: 'is-phone-number-united-states',
				test: (value) => value === '' || isPhoneNumberUnitedStates(value),
			})
			.default(''),
	recurrenceRule: () =>
		yup
			.string()
			.test({
				message: '${path} is not a Recurrence Rule',
				name: 'is-recurrence-rule',
				test: (value) => value === '' || isRecurrenceRule(value),
			})
			.default(''),
	usd: () =>
		yup
			.number()
			.test({
				message: '${path} is not currency usd',
				name: 'is-currency-usd',
				test: (value: unknown) => value === '' || isCurrencyUsdCents(value),
			})
			.default(0),
	webHost: () =>
		yup
			.string()
			.test({
				message: '${path} is not a web host',
				name: 'is-web-host',
				test: (value) => value === '' || isWebHost(value),
			})
			.default(''),
	webUrl: () =>
		yup
			.string()
			.test({
				message: '${path} is not a web url',
				name: 'is-web-url',
				test: (value) => value === '' || isWebUrl(value),
			})
			.default(''),
} as const;

export const getApiObjectYupHelpers = <ApiObjectCollection extends string>(
	_: ApiObjectCollection[],
) =>
	({
		id: (_object: ApiObjectCollection) =>
			yup
				.string()
				.default(() => getDocumentIdString(_object))
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a uuid: ${value}`,
					name: 'is-uuid',
					test: (value) => isDocumentIdString([_object], value),
				})
				.meta({ _object }),
		ids: (_object: ApiObjectCollection) =>
			YupHelpers.array(
				yup
					.string()
					.default(() => UUID.v4())
					.test({
						message: ({ path, value }: { path: string; value: string }) =>
							`${path} is not a uuid: ${value}`,
						name: 'is-uuid',
						test: (value) => isDocumentIdString([_object], value),
					})
					.meta({ _object }),
			),
		idRef: (allowObjects: ApiObjectCollection[]) =>
			yup
				.string()
				.default('')
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a uuid: ${value}`,
					name: 'is-uuid',
					test: (value) => isDocumentIdString(allowObjects, value),
				})
				.meta({ allowObjects }),
		idRefs: (allowObjects: ApiObjectCollection[]) =>
			YupHelpers.array(
				yup
					.string()
					.defined()
					.test({
						message: ({ path, value }: { path: string; value: string }) =>
							`${path} is not a uuid: ${value}`,
						name: 'is-uuid',
						test: (value) =>
							typeof value === 'string' &&
							isDocumentIdString(allowObjects, value),
					})
					.meta({ allowObjects }),
			).defined(),
		userIdRef: () =>
			yup
				.string()
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a uuid: ${value}`,
					name: 'is-uuid',
					test: (value) => isDocumentIdString(['user'], value),
				})
				.defined(),
	} as const);
