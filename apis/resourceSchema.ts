import * as R from 'ramda';
import * as yup from 'yup';
import * as YupTypes from 'yup/lib/schema.js';
import { yupX } from 'ergonomic/apis/yup.js';
import { getEnum, EnumMember } from 'ergonomic/utils/enum.js';
import { Keys } from 'ergonomic/utils/object.js';
import { GeneralizedFieldTypeEnum } from 'ergonomic/apis/fieldSchema.js';
import { isForeignKey } from 'ergonomic/data/documentId.js';

// API Resource Properties
export const GeneralizedApiResourceProperties = {
	_archived: yup
		.boolean()
		.default(false)
		.meta({ type: GeneralizedFieldTypeEnum.obj.boolean }),
	_created_by: yup
		.string()
		.default('')
		.test({
			message: ({ path, value }: { path: string; value: string }) =>
				`${path} is not a document ID: ${value}`,
			name: 'isForeignKey',
			test: (value) => isForeignKey([{ id_prefix: 'usr' }], value),
		})
		.meta({
			can_update: false,
			resources: ['user'],
			server_managed: true,
			type: GeneralizedFieldTypeEnum.obj.foreign_key,
		}),
	_date_created: yupX.now().meta({
		can_update: false,
		server_managed: true,
	}),
	_date_last_modified: yupX.now().meta({
		server_managed: true,
	}),
	_deleted: yup
		.boolean()
		.default(false)
		.meta({ type: GeneralizedFieldTypeEnum.obj.boolean }),
	_id: yup.string().defined().label('Unique ID'),
	_object: yup.string().defined().meta({
		can_update: false,
		server_managed: true,
	}),
	category: yup.string().defined(),
	description: yup
		.string()
		.default('')
		.meta({ type: GeneralizedFieldTypeEnum.obj.long_text }),
	name: yup
		.string()
		.defined()
		.meta({ type: GeneralizedFieldTypeEnum.obj.short_text }),
} as const;
export const GeneralizedApiResourceSchema = yup.object(
	GeneralizedApiResourceProperties,
);
export const defaultGeneralizedApiResource =
	GeneralizedApiResourceSchema.getDefault();
export type GeneralizedApiResource = yup.InferType<
	typeof GeneralizedApiResourceSchema
>;

export const GeneralizedApiResourceFieldEnum = getEnum(
	Keys(GeneralizedApiResourceProperties),
);
export type GeneralizedApiResourceField = EnumMember<
	typeof GeneralizedApiResourceFieldEnum
>;

// Create API Resource
export const CreateParamsHelpers = {
	fieldMaskEnum: getEnum(
		Keys(
			R.pick(
				[
					'_archived',
					'_date_created',
					'_date_last_modified',
					'_deleted',
					'_object',
				] as const,
				GeneralizedApiResourceProperties,
			),
		),
	),
	getRequiredField: <T extends YupTypes.AnySchema>(schema: T) =>
		(schema.defined() as T).meta({ required_on_create: true }),
};

export type CreateParamsFieldMask = EnumMember<
	typeof CreateParamsHelpers.fieldMaskEnum
>;
export type CreateParamsField<T extends string | number | symbol> = Exclude<
	T,
	CreateParamsFieldMask
>;
export type CreateParams<
	T extends GeneralizedApiResource,
	K extends keyof T,
> = Partial<Pick<T, CreateParamsField<keyof T>>> & Required<Pick<T, K>>;
export type GeneralizedCreateBody = Partial<GeneralizedApiResource>;
export const GeneralizedApiResourceCreateParamsRequiredFieldEnum = getEnum([
	'category',
	'name',
]);

// Update API Resource
const UpdateParamsFieldMaskEnum = getEnum(
	Keys(
		R.pick(
			['_object', '_id', '_date_created'] as const,
			GeneralizedApiResourceProperties,
		),
	),
);
export const UpdateParamsHelpers = {
	fieldMaskEnum: UpdateParamsFieldMaskEnum,
	toFieldEnum: <T extends string>(fields: T[]) =>
		getEnum(
			fields.filter(
				R.complement(UpdateParamsFieldMaskEnum.isMember),
			) as UpdateParamsField<T>[],
		),
};

export type UpdateParamsFieldMask = EnumMember<
	typeof UpdateParamsFieldMaskEnum
>;
export type UpdateParamsField<T extends string | number | symbol> = Exclude<
	T,
	UpdateParamsFieldMask
>;
export type UpdateParams<T extends GeneralizedApiResource> = Partial<
	Pick<T, UpdateParamsField<keyof T>>
>;
export type GeneralizedUpdateBody = UpdateParams<GeneralizedApiResource>;
export type GeneralizedUpdateOperation = {
	_id: string;
	updateParams: GeneralizedUpdateBody;
};

// DB Helpers
export const WriteOperationEnum = getEnum(['create', 'update']);
export type WriteOperation = EnumMember<typeof WriteOperationEnum>;
