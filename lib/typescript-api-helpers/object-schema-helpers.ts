import * as R from 'ramda';
import * as yup from 'yup';
import * as YupTypes from 'yup/lib/schema';
import * as TsHelpers from '../typescript-helpers';
import * as YupHelpers from './yup-helpers';

// API Object Properties
export const BaseApiObjectProperties = {
	_archived: yup.boolean().default(false),
	_date_created: YupHelpers.YupHelpers.now(),
	_deleted: yup.boolean().default(false),
	_id: yup.string().defined(),
	_object: yup.string().defined(),
	_ref_user: yup.string().defined(),
	category: yup.string().defined(),
	description: yup.string().default(''),
	name: yup.string().defined(),
} as const;
export const BaseApiObjectSchema = yup.object(BaseApiObjectProperties);
export const defaultBaseApiObject = BaseApiObjectSchema.getDefault();
export type BaseApiObject = yup.InferType<typeof BaseApiObjectSchema>;

export const BaseApiObjectFieldEnum = TsHelpers.getEnum(
	TsHelpers.Keys(BaseApiObjectProperties),
);
export type BaseApiObjectField = keyof typeof BaseApiObjectFieldEnum.obj;

// Create API Object
export const CreateParamsHelpers = {
	fieldMaskEnum: TsHelpers.getEnum(
		TsHelpers.Keys(
			R.pick(
				['_archived', '_date_created', '_deleted', '_object', '_ref_user'],
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
export const BaseApiObjectCreateParamsRequiredFieldEnum = TsHelpers.getEnum([
	'category',
	'name',
]);

// Update API Object
const _UpdateParamsFieldMaskEnum = TsHelpers.getEnum(
	TsHelpers.Keys(
		R.pick(
			['_object', '_id', '_date_created', '_ref_user'],
			BaseApiObjectProperties,
		),
	),
);
export const UpdateParamsHelpers = {
	fieldMaskEnum: _UpdateParamsFieldMaskEnum,
	toFieldEnum: <T extends string>(fields: T[]) =>
		TsHelpers.getEnum(
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
export const WriteOperationEnum = TsHelpers.getEnum(['create', 'update']);
export type WriteOperation = keyof typeof WriteOperationEnum.obj;

// Authentication Helpers
export const AUTH_DATABASE_ID = '(default)';
export const AUTH_USER_COLLECTION_ID = 'auth_user';
export type AuthUser = BaseApiObject & {
	_object: 'auth_user';
};
export const AUTH_USER_API_KEY_COLLECTION_ID = 'auth_user_api_key';
export type AuthUserApiKey = BaseApiObject & {
	_object: 'auth_user_api_key';
	hashed_api_key: string;
	revoked: boolean;
};
