import * as R from 'ramda';
import * as yup from 'yup';
import * as YupTypes from 'yup/lib/schema';
import * as TsHelpers from '../typescript-helpers';
import * as ObjectSchemaHelpers from './object-schema-helpers';
import * as getApiObjectEndpointHelpers from './getApiObjectEndpoint';

// Create API Object Property Definitions
export const getApiObjectSpec = <
	T extends string,
	U extends Record<T, YupTypes.AnySchema>,
	V extends string,
>({
	createParamsRequiredFieldEnum,
	databaseId = '(default)',
	properties,
}: {
	createParamsRequiredFieldEnum: TsHelpers.TsEnumType<V>;
	databaseId?: string;
	properties: U;
}) => {
	// API Object
	const apiObjectJsonShape = R.mapObjIndexed(
		(schema: U[T], field: T) =>
			createParamsRequiredFieldEnum.isMember(field)
				? ObjectSchemaHelpers.CreateParamsHelpers.toRequiredField(schema)
				: schema,
		properties,
	) as U;

	const apiObjectJsonSchema = yup.object(apiObjectJsonShape);
	const apiObjectFieldEnum = TsHelpers.getEnum(
		TsHelpers.Keys(apiObjectJsonShape as Record<T, YupTypes.AnySchema>),
	);
	const apiObjectDefaultJson = apiObjectJsonSchema.getDefault();
	type ApiObjectType = ObjectSchemaHelpers.BaseApiObject &
		yup.InferType<typeof apiObjectJsonSchema>;

	// Create Params
	const createParamsJsonShape = R.omit(
		ObjectSchemaHelpers.CreateParamsHelpers.fieldMaskEnum.arr,
		apiObjectJsonShape,
	);
	const createParamsJsonSchema = yup.object(createParamsJsonShape);
	const createParamsFieldEnum = TsHelpers.getEnum(
		TsHelpers.Keys(
			createParamsJsonShape as Omit<
				Record<T, YupTypes.AnySchema>,
				keyof typeof ObjectSchemaHelpers.CreateParamsHelpers.fieldMaskEnum.obj
			>,
		),
	);
	const createParamsDefaultJson = createParamsJsonSchema.getDefault();

	type CreateApiObjectParamsType = ObjectSchemaHelpers.CreateParams<
		ApiObjectType,
		keyof ApiObjectType & V
	>;
	const mergeCreateParams = ({
		_ref_user,
		createParams,
	}: {
		_ref_user: ObjectSchemaHelpers.BaseApiObject['_ref_user'];
		createParams: CreateApiObjectParamsType;
	}) =>
		({
			...apiObjectJsonSchema.getDefault(),
			...R.reject((v) => v === undefined, createParams),
			_ref_user,
		} as ApiObjectType);

	// Create Params Required Fields
	const createParamsRequiredFieldJsonShape = R.pick(
		createParamsRequiredFieldEnum.arr as V[],
		apiObjectJsonShape,
	);
	const createParamsRequiredFieldJsonSchema = yup.object(
		createParamsRequiredFieldJsonShape,
	);

	// Update Params
	const updateParamsJsonShape = R.omit(
		ObjectSchemaHelpers.UpdateParamsHelpers.fieldMaskEnum.arr,
		apiObjectJsonShape,
	);
	const updateParamsJsonSchema = yup.object(updateParamsJsonShape);
	const updateParamsFieldEnum = TsHelpers.getEnum(
		TsHelpers.Keys(
			updateParamsJsonShape as Omit<
				Record<T, YupTypes.AnySchema>,
				keyof typeof ObjectSchemaHelpers.UpdateParamsHelpers.fieldMaskEnum.obj
			>,
		),
	);
	const updateParamsDefaultJson = updateParamsJsonSchema.getDefault();

	type UpdateApiObjectParamsType =
		ObjectSchemaHelpers.UpdateParams<ApiObjectType>;
	const mergeUpdateParams = ({
		prevApiObjectJson,
		updateParams,
	}: {
		prevApiObjectJson: ApiObjectType;
		updateParams: UpdateApiObjectParamsType;
	}): ApiObjectType => ({
		...prevApiObjectJson,
		...R.reject((v) => v === undefined, updateParams),
	});

	// REST API Client
	const { _object } =
		properties as unknown as typeof ObjectSchemaHelpers.BaseApiObjectProperties;
	const apiObjectCollectionId = _object.getDefault();
	if (apiObjectCollectionId === undefined) throw new Error();
	const apiObjectBaseEndpoint =
		getApiObjectEndpointHelpers.getApiObjectEndpoint(apiObjectCollectionId);

	return {
		apiObjectCollectionId,
		apiObjectDefaultJson,
		apiObjectBaseEndpoint,
		apiObjectFieldEnum,
		apiObjectJsonSchema,
		apiObjectJsonShape,
		createParamsDefaultJson,
		createParamsFieldEnum,
		createParamsJsonSchema,
		createParamsJsonShape,
		createParamsRequiredFieldEnum,
		createParamsRequiredFieldJsonSchema,
		createParamsRequiredFieldJsonShape,
		databaseId,
		mergeCreateParams,
		updateParamsDefaultJson,
		updateParamsFieldEnum,
		updateParamsJsonSchema,
		updateParamsJsonShape,
		mergeUpdateParams,
	} as const;
};

export type ApiObjectSpec = ReturnType<typeof getApiObjectSpec>;
