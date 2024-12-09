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
	GeneralizedApiResource,
	GeneralizedApiResourceProperties,
	CreateParams,
	CreateParamsHelpers,
	UpdateParams,
	UpdateParamsHelpers,
} from 'ergonomic/apis/resourceSchema.js';
import { getApiResourceEndpoint } from 'ergonomic/apis/getApiResourceEndpoint.js';

// Create API Resource Property Definitions
export const getApiResourceSpec = <
	T extends string,
	U extends Record<T, YupTypes.AnySchema>,
	V extends T,
>({
	createParamsRequiredFieldEnum,
	databaseId = '(default)',
	idPrefix,
	resourcePlural,
	properties,
}: {
	createParamsRequiredFieldEnum: GeneralizedEnumType<V>;
	databaseId?: string;
	idPrefix: string;
	resourcePlural?: string;
	properties: U;
}) => {
	// API Resource
	const apiResourceJsonShape = R.mapObjIndexed(
		(schema: U[T], field: T) =>
			createParamsRequiredFieldEnum.isMember(field)
				? CreateParamsHelpers.getRequiredField(schema)
				: schema,
		properties,
	) as U;

	const apiResourceJsonSchema = yup.object(apiResourceJsonShape);
	const apiResourceFieldEnum = getEnum(
		Keys(apiResourceJsonShape as Record<T, YupTypes.AnySchema>),
	);
	const apiResourceDefaultJson = apiResourceJsonSchema.getDefault();
	type ApiResourceType = GeneralizedApiResource &
		yup.InferType<typeof apiResourceJsonSchema>;

	// Create Params
	const createParamsJsonShape = R.omit(
		CreateParamsHelpers.fieldMaskEnum.arr as T[],
		apiResourceJsonShape,
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

	type CreateApiResourceParamsType = CreateParams<
		ApiResourceType,
		keyof ApiResourceType & V
	>;
	const mergeCreateParams = ({
		createParams,
	}: {
		createParams: CreateApiResourceParamsType;
	}) =>
		({
			...apiResourceJsonSchema.getDefault(),
			...R.reject((v) => v === undefined, createParams),
		} as ApiResourceType);

	// Create Params Required Fields
	const createParamsRequiredFieldJsonShape = R.pick(
		createParamsRequiredFieldEnum.arr as V[],
		apiResourceJsonShape,
	);
	const createParamsRequiredFieldJsonSchema = yup.object(
		createParamsRequiredFieldJsonShape,
	);

	// Update Params
	const updateParamsJsonShape = R.omit(
		UpdateParamsHelpers.fieldMaskEnum.arr as T[],
		apiResourceJsonShape,
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

	type UpdateApiResourceParamsType = UpdateParams<ApiResourceType>;
	const mergeUpdateParams = ({
		prevApiResourceJson,
		updateParams,
	}: {
		prevApiResourceJson: ApiResourceType;
		updateParams: UpdateApiResourceParamsType;
	}): ApiResourceType => ({
		...prevApiResourceJson,
		...R.reject((v) => v === undefined, updateParams),
	});

	// REST API Client
	const { _object } =
		properties as unknown as typeof GeneralizedApiResourceProperties;
	const apiResourceCollectionId = _object.getDefault();
	if (apiResourceCollectionId === undefined) throw new Error();
	const apiResourceEndpoint = getApiResourceEndpoint(
		resourcePlural ?? apiResourceCollectionId + 's',
	);

	return {
		apiResourceCollectionId,
		apiResourceCollectionIdPlural:
			resourcePlural ?? apiResourceCollectionId + 's',
		apiResourceDefaultJson,
		apiResourceEndpoint,
		apiResourceFieldEnum,
		apiResourceJsonSchema,
		apiResourceJsonShape,
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

export type GeneralizedApiResourceSpec = ReturnType<typeof getApiResourceSpec>;
