import * as yup from 'yup';
import * as YupSchemaHelpers from 'yup/lib/schema.js';
import { getEnum } from 'ergonomic/typescript-helpers/enum-helpers.js';
import {
	getUtcDateNow,
	isCurrencyUsdCents,
	isDuration,
	isEmailAddress,
	isFilePath,
	isInterval,
	isPhoneNumberUnitedStates,
	isUtcDate,
	isWebDomain,
	isWebUrl,
	getDocumentIdString,
	isDocumentIdString,
} from 'ergonomic/data-format-helpers/index.js';
import { GeneralizedFieldTypeEnum } from 'ergonomic/typescript-api-helpers/field-schema-helpers.js';

export const YupTypeEnum = getEnum([
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
	) =>
		yup
			.array()
			.default([])
			.of<T>(types)
			.meta({ type: GeneralizedFieldTypeEnum.obj.list }),
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
	growthRate: () =>
		yup
			.number()
			.default(0)
			.meta({ type: GeneralizedFieldTypeEnum.obj.floating_point_number }),
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
	usd: () =>
		yup
			.number()
			.test({
				message: '${path} is not currency usd',
				name: 'is-currency-usd',
				test: (value: unknown) => value === '' || isCurrencyUsdCents(value),
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

export const getApiObjectYupHelpers = <ApiObjectCollection extends string>(
	_: ApiObjectCollection[],
	documentIdPrefixMap: Record<ApiObjectCollection, string>,
) =>
	({
		id: (_object: ApiObjectCollection) =>
			yup
				.string()
				.default(() =>
					getDocumentIdString({
						document_id_prefix: documentIdPrefixMap[_object],
					}),
				)
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a uuid: ${value}`,
					name: 'is-uuid',
					test: (value) =>
						isDocumentIdString(
							[{ document_id_prefix: documentIdPrefixMap[_object] }],
							value,
						),
				})
				.label('Unique ID')
				.meta({ _object, type: GeneralizedFieldTypeEnum.obj.id }),
		idRef: (referenceCollections: ApiObjectCollection[]) =>
			yup
				.string()
				.default('')
				.test({
					message: ({ path, value }: { path: string; value: string }) =>
						`${path} is not a uuid: ${value}`,
					name: 'is-uuid',
					test: (value) =>
						isDocumentIdString(
							referenceCollections.map((_object) => ({
								document_id_prefix: documentIdPrefixMap[_object],
							})),
							value,
						),
				})
				.meta({
					reference_collections: referenceCollections,
					type: GeneralizedFieldTypeEnum.obj.id_ref,
				}),
		idRefs: (referenceCollections: ApiObjectCollection[]) =>
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
									document_id_prefix: documentIdPrefixMap[_object],
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
