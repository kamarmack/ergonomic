import * as R from 'ramda';
import * as yup from 'yup';
import * as YupTypes from 'yup/lib/schema';
import { YupHelpers } from 'ergonomic/typescript-api-helpers/yup-helpers.js';
import { getEnum } from 'ergonomic/typescript-helpers/enum-helpers.js';
import { Keys } from 'ergonomic/typescript-helpers/object-helpers.js';

// API Object Properties
export const BaseApiObjectProperties = {
	_archived: yup.boolean().default(false),
	_date_created: YupHelpers.now(),
	_deleted: yup.boolean().default(false),
	_id: yup.string().defined(),
	_object: yup.string().defined(),
	category: yup.string().defined(),
	description: yup.string().default(''),
	name: yup.string().defined(),
} as const;
export const BaseApiObjectSchema = yup.object(BaseApiObjectProperties);
export const defaultBaseApiObject = BaseApiObjectSchema.getDefault();
export type BaseApiObject = yup.InferType<typeof BaseApiObjectSchema>;

export const BaseApiObjectFieldEnum = getEnum(Keys(BaseApiObjectProperties));
export type BaseApiObjectField = keyof typeof BaseApiObjectFieldEnum.obj;

// Create API Object
export const CreateParamsHelpers = {
	fieldMaskEnum: getEnum(
		Keys(
			R.pick(
				['_archived', '_date_created', '_deleted', '_object'],
				BaseApiObjectProperties,
			),
		),
	),
	toRequiredField: <T extends YupTypes.AnySchema>(schema: T) =>
		(schema.defined() as T).meta({ createParamsRequired: true }),
};

export type CreateParamsFieldMask =
	keyof typeof CreateParamsHelpers.fieldMaskEnum.obj;
export type CreateParamsField<T extends string | number | symbol> = Exclude<
	T,
	CreateParamsFieldMask
>;
export type CreateParams<T extends BaseApiObject, K extends keyof T> = Partial<
	Pick<T, CreateParamsField<keyof T>>
> &
	Required<Pick<T, K>>;
export type BaseCreateBody = CreateParams<BaseApiObject, BaseApiObjectField>;
export const BaseApiObjectCreateParamsRequiredFieldEnum = getEnum([
	'category',
	'name',
]);

// Update API Object
const _UpdateParamsFieldMaskEnum = getEnum(
	Keys(R.pick(['_object', '_id', '_date_created'], BaseApiObjectProperties)),
);
export const UpdateParamsHelpers = {
	fieldMaskEnum: _UpdateParamsFieldMaskEnum,
	toFieldEnum: <T extends string>(fields: T[]) =>
		getEnum(
			fields.filter(
				R.complement(_UpdateParamsFieldMaskEnum.isMember),
			) as UpdateParamsField<T>[],
		),
};

export type UpdateParamsFieldMask = keyof typeof _UpdateParamsFieldMaskEnum.obj;
export type UpdateParamsField<T extends string | number | symbol> = Exclude<
	T,
	UpdateParamsFieldMask
>;
export type UpdateParams<T extends BaseApiObject> = Partial<
	Pick<T, UpdateParamsField<keyof T>>
>;
export type BaseUpdateBody = UpdateParams<BaseApiObject>;
export type BaseUpdateOperation = {
	_id: string;
	updateParams: BaseUpdateBody;
};

// DB Helpers
export const WriteOperationEnum = getEnum(['create', 'update']);
export type WriteOperation = keyof typeof WriteOperationEnum.obj;
