import * as R from 'ramda';
import * as yup from 'yup';
import * as YupTypes from 'yup/lib/schema.js';
import { YupHelpers } from 'ergonomic/typescript-api-helpers/yup-helpers.js';
import { getEnum } from 'ergonomic/typescript-helpers/enum-helpers.js';
import { Keys } from 'ergonomic/typescript-helpers/object-helpers.js';
import { GeneralizedFieldTypeEnum } from 'ergonomic/typescript-api-helpers/field-schema-helpers.js';

// API Object Properties
export const GeneralizedApiObjectProperties = {
	_archived: yup
		.boolean()
		.default(false)
		.meta({ type: GeneralizedFieldTypeEnum.obj.boolean }),
	_date_created: YupHelpers.now(),
	_deleted: yup
		.boolean()
		.default(false)
		.meta({ type: GeneralizedFieldTypeEnum.obj.boolean }),
	_id: yup.string().defined().label('Unique ID'),
	_object: yup.string().defined(),
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
export const GeneralizedApiObjectSchema = yup.object(
	GeneralizedApiObjectProperties,
);
export const defaultGeneralizedApiObject =
	GeneralizedApiObjectSchema.getDefault();
export type GeneralizedApiObject = yup.InferType<
	typeof GeneralizedApiObjectSchema
>;

export const GeneralizedApiObjectFieldEnum = getEnum(
	Keys(GeneralizedApiObjectProperties),
);
export type GeneralizedApiObjectField =
	keyof typeof GeneralizedApiObjectFieldEnum.obj;

// Create API Object
export const CreateParamsHelpers = {
	fieldMaskEnum: getEnum(
		Keys(
			R.pick(
				['_archived', '_date_created', '_deleted', '_object'] as const,
				GeneralizedApiObjectProperties,
			),
		),
	),
	getRequiredField: <T extends YupTypes.AnySchema>(schema: T) =>
		(schema.defined() as T).meta({ required_on_create: true }),
};

export type CreateParamsFieldMask =
	keyof typeof CreateParamsHelpers.fieldMaskEnum.obj;
export type CreateParamsField<T extends string | number | symbol> = Exclude<
	T,
	CreateParamsFieldMask
>;
export type CreateParams<
	T extends GeneralizedApiObject,
	K extends keyof T,
> = Partial<Pick<T, CreateParamsField<keyof T>>> & Required<Pick<T, K>>;
export type GeneralizedCreateBody = CreateParams<
	GeneralizedApiObject,
	GeneralizedApiObjectField
>;
export const GeneralizedApiObjectCreateParamsRequiredFieldEnum = getEnum([
	'category',
	'name',
]);

// Update API Object
const UpdateParamsFieldMaskEnum = getEnum(
	Keys(
		R.pick(
			['_object', '_id', '_date_created'] as const,
			GeneralizedApiObjectProperties,
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

export type UpdateParamsFieldMask = keyof typeof UpdateParamsFieldMaskEnum.obj;
export type UpdateParamsField<T extends string | number | symbol> = Exclude<
	T,
	UpdateParamsFieldMask
>;
export type UpdateParams<T extends GeneralizedApiObject> = Partial<
	Pick<T, UpdateParamsField<keyof T>>
>;
export type GeneralizedUpdateBody = UpdateParams<GeneralizedApiObject>;
export type GeneralizedUpdateOperation = {
	_id: string;
	updateParams: GeneralizedUpdateBody;
};

// DB Helpers
export const WriteOperationEnum = getEnum(['create', 'update']);
export type WriteOperation = keyof typeof WriteOperationEnum.obj;
