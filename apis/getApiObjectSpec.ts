import * as R from 'ramda';
import * as yup from 'yup';
import * as YupTypes from 'yup/lib/schema.js';
import { Keys } from 'ergonomic/utils/object.js';
import {
	EnumMember,
	GeneralizedEnumType,
	getEnum,
} from 'ergonomic/utils/enum.js';
import {
	GeneralizedApiObject,
	GeneralizedApiObjectProperties,
	CreateParams,
	CreateParamsHelpers,
	UpdateParams,
	UpdateParamsHelpers,
} from 'ergonomic/apis/object-schema.js';
import { getApiObjectEndpoint } from 'ergonomic/apis/getApiObjectEndpoint.js';

// Create API Object Property Definitions
export const getApiObjectSpec = <
	T extends string,
	U extends Record<T, YupTypes.AnySchema>,
	V extends T,
>({
	createParamsRequiredFieldEnum,
	databaseId = '(default)',
	idPrefix,
	objectPlural,
	properties,
}: {
	createParamsRequiredFieldEnum: GeneralizedEnumType<V>;
	databaseId?: string;
	idPrefix: string;
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
				EnumMember<typeof CreateParamsHelpers.fieldMaskEnum>
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
				EnumMember<typeof UpdateParamsHelpers.fieldMaskEnum>
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
		apiObjectCollectionIdPlural: objectPlural ?? apiObjectCollectionId + 's',
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
		idPrefix,
		mergeCreateParams,
		updateParamsDefaultJson,
		updateParamsFieldEnum,
		updateParamsJsonSchema,
		updateParamsJsonShape,
		mergeUpdateParams,
	} as const;
};

export type GeneralizedApiObjectSpec = ReturnType<typeof getApiObjectSpec>;

/**
 * @deprecated Use `GeneralizedApiObjectSpec` instead.
 */
export type ApiObjectSpec = ReturnType<typeof getApiObjectSpec>;
