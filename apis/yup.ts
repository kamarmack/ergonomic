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
	isUnitedStatesPhoneNumber,
	isUnitedStatesPostalCode,
	isRecurrenceRuleString,
	isUtcDate,
	isDateYyyyMmDd,
	isDomain,
	getDocumentIdString,
	isDocumentIdString,
	isDocumentIdStringRef,
	isUrl,
} from 'ergonomic/data/index.js';
import { GeneralizedFieldTypeEnum } from 'ergonomic/apis/fieldSchema.js';

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

export const yupX = {
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
				message: '${path} is not a date',
				name: 'isDate',
				test: (value) => value === '' || isDateYyyyMmDd(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.date }),
	dateTime: () =>
		yup
			.string()
			.test({
				message: '${path} is not a UTC date',
				name: 'isDateTime',
				test: (value) => value === '' || isUtcDate(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.date_time }),
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
			.meta({ type: GeneralizedFieldTypeEnum.obj.date_time }),
	percentage: () =>
		yup
			.number()
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.percentage }),
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
	unitedStatesPhoneNumber: () =>
		yup
			.string()
			.test({
				message: '${path} is not a US phone number',
				name: 'isUnitedStatesPhoneNumber',
				test: (value) => value === '' || isUnitedStatesPhoneNumber(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.united_states_phone_number }),
	unitedStatesPostalCode: () =>
		yup
			.string()
			.test({
				message: '${path} is not a US postal code',
				name: 'isUnitedStatesPostalCode',
				test: (value) => value === '' || isUnitedStatesPostalCode(value),
			})
			.default('')
			.meta({ type: GeneralizedFieldTypeEnum.obj.address_field }),
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
} as const;

export const getApiResourceYupFields = <TResourceName extends string>(
	_: TResourceName[],
	idPrefixMap: Record<TResourceName, string>,
) =>
	({
		id: (_object: TResourceName) =>
			yup
				.string()
				.default(() =>
					getDocumentIdString({
						id_prefix: idPrefixMap[_object],
					}),
				)
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a document ID: ${value}`,
					name: 'isDocumentId',
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
		idRef: (resources: TResourceName[]) =>
			yup
				.string()
				.default('')
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a document ID: ${value}`,
					name: 'isDocumentId',
					test: (value) =>
						isDocumentIdStringRef(
							resources.map((_object) => ({
								id_prefix: idPrefixMap[_object],
							})),
							value,
						),
				})
				.meta({
					resources: resources,
					type: GeneralizedFieldTypeEnum.obj.id_ref,
				}),
		idRefs: (resources: TResourceName[]) =>
			yupX
				.array(
					yup
						.string()
						.defined()
						.test({
							message: ({ path, value }: { path: string; value: string }) =>
								`${path} is not a document ID: ${value}`,
							name: 'isDocumentId',
							test: (value) =>
								typeof value === 'string' &&
								isDocumentIdString(
									resources.map((_object) => ({
										id_prefix: idPrefixMap[_object],
									})),
									value,
								),
						}),
				)
				.defined()
				.meta({
					resources: resources,
					type: GeneralizedFieldTypeEnum.obj.id_refs,
				}),
	} as const);
