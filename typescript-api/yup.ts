import * as yup from 'yup';
import * as YupSchemaHelpers from 'yup/lib/schema.js';
import { getEnum, EnumMember } from 'ergonomic/typescript/enum.js';
import { isInteger } from 'ergonomic/typescript/number.js';
import {
	IanaTimeZoneEnum,
	getUtcDateNow,
	isDuration,
	isEmailAddress,
	isFilePath,
	isInterval,
	isPhoneNumberUnitedStates,
	isPostalCodeUnitedStates,
	isRecurrenceRuleString,
	isUtcDate,
	isWebDomain,
	isWebUrl,
	getDocumentIdString,
	isDocumentIdString,
	isDocumentIdStringRef,
} from 'ergonomic/data-types/index.js';
import { GeneralizedFieldTypeEnum } from 'ergonomic/typescript-api/field-schema.js';

export const YupTypeEnum = getEnum([
	'array',
	'boolean',
	'mixed',
	'number',
	'string',
]);
export type YupType = EnumMember<typeof YupTypeEnum>;

export type FieldSchema = YupSchemaHelpers.SchemaObjectDescription & {
	innerType?: YupSchemaHelpers.SchemaInnerTypeDescription;
};

export const YupHelpers = {
	array: <T extends Parameters<ReturnType<typeof yup.array>['of']>[0]>(
		types: T,
	) =>
		yup
			.array()
			.default([])
			.of<T>(types)
			.meta({ type: GeneralizedFieldTypeEnum.obj.list }),
	constant: <T extends boolean | string | number>(value: T) =>
		yup
			.mixed<T>()
			.oneOf([value])
			.default(value)
			.meta({
				can_update: false,
				type: GeneralizedFieldTypeEnum.obj[
					typeof value === 'string'
						? 'short_text'
						: typeof value === 'number'
						? 'floating_point_number'
						: 'boolean'
				],
			}),
	booleanDefaultFalse: () =>
		yup
			.boolean()
			.default(false)
			.meta({ type: GeneralizedFieldTypeEnum.obj.boolean }),
	booleanDefaultTrue: () =>
		yup
			.boolean()
			.default(true)
			.meta({ type: GeneralizedFieldTypeEnum.obj.boolean }),
	booleanDefaultUnset: () =>
		yup
			.boolean()
			.nullable()
			.default(null)
			.meta({ type: GeneralizedFieldTypeEnum.obj.boolean }),
	date: () =>
		yup
			.string()
			.test({
				message: '${path} is not a UTC Date',
				name: 'is-utc-date',
				test: (value) => value === '' || isUtcDate(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.date }),
	duration: () =>
		yup
			.string()
			.test({
				message: '${path} is not a Duration',
				name: 'is-duration',
				test: (value) => value === '' || isDuration(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.duration }),
	emailAddress: () =>
		yup
			.string()
			.test({
				message: '${path} is not an email address',
				name: 'is-email-address',
				test: (value: unknown) => value === '' || isEmailAddress(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.email_address }),
	filePath: () =>
		yup
			.string()
			.test({
				message: '${path} is not a File Path',
				name: 'is-filePath',
				test: (value) => value === '' || isFilePath(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.file }),
	floatingPointNumber: () =>
		yup
			.number()
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.floating_point_number }),
	integer: () =>
		yup
			.number()
			.test({
				message: '${path} is not an integer',
				name: 'is-integer',
				test: isInteger,
			})
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.integer }),
	interval: () =>
		yup
			.string()
			.test({
				message: '${path} is not a Interval',
				name: 'is-interval',
				test: (value) => value === '' || isInterval(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.interval }),
	now: () =>
		yup
			.string()
			.test({
				message: '${path} is not a UTC Date',
				name: 'is-utc-date',
				test: isUtcDate,
			})
			.default(getUtcDateNow)
			.meta({ type: GeneralizedFieldTypeEnum.obj.date }),
	percentage: () =>
		yup
			.number()
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.percentage }),
	phoneNumber: () =>
		yup
			.string()
			.test({
				message: '${path} is not a US phone number',
				name: 'is-phone-number-united-states',
				test: (value) => value === '' || isPhoneNumberUnitedStates(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.phone_number }),
	postalCodeUnitedStates: () =>
		yup
			.string()
			.test({
				message: '${path} is not a US postal code',
				name: 'is-postal-code-united-states',
				test: (value) => value === '' || isPostalCodeUnitedStates(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.address_field }),
	recurrenceRule: () =>
		yup
			.string()
			.default('')
			.test({
				message: '${path} is not a Recurrence Rule',
				name: 'is-recurrence-rule',
				test: (value) => value === '' || isRecurrenceRuleString(value),
			})
			.meta({ type: GeneralizedFieldTypeEnum.obj.recurrence_rule }),
	timeZone: () =>
		yup
			.string()
			.oneOf((IanaTimeZoneEnum.arr as string[]).concat(['']))
			.default('')
			.meta({
				type: GeneralizedFieldTypeEnum.obj.time_zone,
			}),
	usd: () =>
		yup
			.number()
			.test({
				message: '${path} is not currency usd',
				name: 'is-currency-usd',
				test: (value: unknown) => typeof value === 'number',
			})
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.currency }),
	webDomain: () =>
		yup
			.string()
			.test({
				message: '${path} is not a web host',
				name: 'is-web-host',
				test: (value) => value === '' || isWebDomain(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.domain }),
	webUrl: () =>
		yup
			.string()
			.test({
				message: '${path} is not a web url',
				name: 'is-web-url',
				test: (value) => value === '' || isWebUrl(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.url }),
} as const;

export const getApiObjectYupHelpers = <TCollection extends string>(
	_: TCollection[],
	idPrefixMap: Record<TCollection, string>,
) =>
	({
		id: (_object: TCollection) =>
			yup
				.string()
				.default(() =>
					getDocumentIdString({
						id_prefix: idPrefixMap[_object],
					}),
				)
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a uuid: ${value}`,
					name: 'is-uuid',
					test: (value) =>
						isDocumentIdString([{ id_prefix: idPrefixMap[_object] }], value),
				})
				.label('Unique ID')
				.meta({
					_object,
					can_update: false,
					primary_key: true,
					type: GeneralizedFieldTypeEnum.obj.id,
				}),
		idRef: (referenceCollections: TCollection[]) =>
			yup
				.string()
				.default('')
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a uuid: ${value}`,
					name: 'is-uuid',
					test: (value) =>
						isDocumentIdStringRef(
							referenceCollections.map((_object) => ({
								id_prefix: idPrefixMap[_object],
							})),
							value,
						),
				})
				.meta({
					reference_collections: referenceCollections,
					type: GeneralizedFieldTypeEnum.obj.id_ref,
				}),
		idRefs: (referenceCollections: TCollection[]) =>
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
							isDocumentIdString(
								referenceCollections.map((_object) => ({
									id_prefix: idPrefixMap[_object],
								})),
								value,
							),
					}),
			)
				.defined()
				.meta({
					reference_collections: referenceCollections,
					type: GeneralizedFieldTypeEnum.obj.id_refs,
				}),
	} as const);
