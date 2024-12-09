import * as yup from 'yup';
import * as YupSchemaHelpers from 'yup/lib/schema.js';
import { getEnum, EnumMember } from 'ergonomic/utils/enum.js';
import { isInteger } from 'ergonomic/utils/number.js';
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
	isWebDomain as isDomain,
	isWebUrl as isUrl,
	getDocumentIdString,
	isDocumentIdString,
	isDocumentIdStringRef,
} from 'ergonomic/data/index.js';
import { GeneralizedFieldTypeEnum } from 'ergonomic/apis/field-schema.js';

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
				message: '${path} is not a UTC date',
				name: 'isDate',
				test: (value) => value === '' || isUtcDate(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.date }),
	domain: () =>
		yup
			.string()
			.test({
				message: '${path} is not a domain',
				name: 'isDomain',
				test: (value) => value === '' || isDomain(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.domain }),
	duration: () =>
		yup
			.string()
			.test({
				message: '${path} is not a duration',
				name: 'is-duration',
				test: (value) => value === '' || isDuration(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.duration }),
	emailAddress: () =>
		yup
			.string()
			.email()
			.test({
				message: '${path} is not an email address',
				name: 'isEmailAddress',
				test: (value: unknown) => value === '' || isEmailAddress(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.email_address }),
	filePath: () =>
		yup
			.string()
			.test({
				message: '${path} is not a file path',
				name: 'isFilePath',
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
				name: 'isInteger',
				test: isInteger,
			})
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.integer }),
	interval: () =>
		yup
			.string()
			.test({
				message: '${path} is not an interval',
				name: 'isInterval',
				test: (value) => value === '' || isInterval(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.interval }),
	now: () =>
		yup
			.string()
			.test({
				message: '${path} is not a UTC date',
				name: 'isDate',
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
				name: 'isUnitedStatesPhoneNumber',
				test: (value) => value === '' || isPhoneNumberUnitedStates(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.phone_number }),
	postalCodeUnitedStates: () =>
		yup
			.string()
			.test({
				message: '${path} is not a US postal code',
				name: 'isUnitedStatesPostalCode',
				test: (value) => value === '' || isPostalCodeUnitedStates(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.address_field }),
	recurrenceRule: () =>
		yup
			.string()
			.default('')
			.test({
				message: '${path} is not a recurrence rule',
				name: 'isRecurrenceRule',
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
				message: '${path} is not usd',
				name: 'isUsd',
				test: (value: unknown) => typeof value === 'number',
			})
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.usd }),
	url: () =>
		yup
			.string()
			.test({
				message: '${path} is not a url',
				name: 'isUrl',
				test: (value) => value === '' || isUrl(value),
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
