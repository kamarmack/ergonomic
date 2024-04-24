import * as R from 'ramda';
import * as yup from 'yup';
import * as YupTypes from 'yup/lib/schema';
import { Keys } from 'ergonomic/typescript-helpers/object-helpers.js';
import {
	GeneralizedEnumType,
	getEnum,
} from 'ergonomic/typescript-helpers/enum-helpers.js';
import {
	GeneralizedApiObject,
	GeneralizedApiObjectProperties,
	CreateParams,
	CreateParamsHelpers,
	UpdateParams,
	UpdateParamsHelpers,
} from 'ergonomic/typescript-api-helpers/object-schema-helpers.js';
import { getApiObjectEndpoint } from 'ergonomic/typescript-api-helpers/getApiObjectEndpoint.js';

// Create API Object Property Definitions
export const getApiObjectSpec = <
	T extends string,
	U extends Record<T, YupTypes.AnySchema>,
	V extends T,
>({
	createParamsRequiredFieldEnum,
	databaseId = '(default)',
	documentIdPrefix,
	objectPlural,
	properties,
}: {
	createParamsRequiredFieldEnum: GeneralizedEnumType<V>;
	databaseId?: string;
	documentIdPrefix: string;
	objectPlural?: string;
	properties: U;
}) => {
	// API Object
	const apiObjectJsonShape = R.mapObjIndexed(
		(schema: U[T], field: T) =>
			createParamsRequiredFieldEnum.isMember(field)
				? CreateParamsHelpers.getRequiredField(schema)
				: schema,
		properties,
	) as U;

	const apiObjectJsonSchema = yup.object(apiObjectJsonShape);
	const apiObjectFieldEnum = getEnum(
		Keys(apiObjectJsonShape as Record<T, YupTypes.AnySchema>),
	);
	const apiObjectDefaultJson = apiObjectJsonSchema.getDefault();
	type ApiObjectType = GeneralizedApiObject &
		yup.InferType<typeof apiObjectJsonSchema>;

	// Create Params
	const createParamsJsonShape = R.omit(
		CreateParamsHelpers.fieldMaskEnum.arr as T[],
		apiObjectJsonShape,
	);
	const createParamsJsonSchema = yup.object(createParamsJsonShape);
	const createParamsFieldEnum = getEnum(
		Keys(
			createParamsJsonShape as unknown as Omit<
				Record<T, YupTypes.AnySchema>,
				keyof typeof CreateParamsHelpers.fieldMaskEnum.obj
			>,
		),
	);
	const createParamsDefaultJson = createParamsJsonSchema.getDefault();

	type CreateApiObjectParamsType = CreateParams<
		ApiObjectType,
		keyof ApiObjectType & V
	>;
	const mergeCreateParams = ({
		createParams,
	}: {
		createParams: CreateApiObjectParamsType;
	}) =>
		({
			...apiObjectJsonSchema.getDefault(),
			...R.reject((v) => v === undefined, createParams),
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
		UpdateParamsHelpers.fieldMaskEnum.arr as T[],
		apiObjectJsonShape,
	);
	const updateParamsJsonSchema = yup.object(updateParamsJsonShape);
	const updateParamsFieldEnum = getEnum(
		Keys(
			updateParamsJsonShape as unknown as Omit<
				Record<T, YupTypes.AnySchema>,
				keyof typeof UpdateParamsHelpers.fieldMaskEnum.obj
			>,
		),
	);
	const updateParamsDefaultJson = updateParamsJsonSchema.getDefault();

	type UpdateApiObjectParamsType = UpdateParams<ApiObjectType>;
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
		properties as unknown as typeof GeneralizedApiObjectProperties;
	const apiObjectCollectionId = _object.getDefault();
	if (apiObjectCollectionId === undefined) throw new Error();
	const apiObjectEndpoint = getApiObjectEndpoint(
		objectPlural ?? apiObjectCollectionId + 's',
	);

	return {
		apiObjectCollectionId,
		apiObjectDefaultJson,
		apiObjectEndpoint,
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
		documentIdPrefix,
		mergeCreateParams,
		updateParamsDefaultJson,
		updateParamsFieldEnum,
		updateParamsJsonSchema,
		updateParamsJsonShape,
		mergeUpdateParams,
	} as const;
};

export type ApiObjectSpec = ReturnType<typeof getApiObjectSpec>;
