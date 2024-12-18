import * as yup from 'yup';
import { GeneralizedFieldSpec } from 'ergonomic/apis//fieldSchema.js';
import { ObjectShape } from 'yup/lib/object';

/**
 * Get field spec by field key
 *
 * @param resourceSchema yup resource schema
 * @param fieldKeys field keys
 * @returns field spec by field key - See {@link GeneralizedFieldSpec}
 */
export const getFieldSpecByFieldKey = <TFieldKey extends string>(
	resourceSchema: yup.ObjectSchema<ObjectShape> | undefined,
	fieldKeys: TFieldKey[] = [],
): Record<TFieldKey, GeneralizedFieldSpec> =>
	fieldKeys.reduce((acc, fieldKey) => {
		const fields = resourceSchema?.fields ?? {};
		const fieldSchema = fields?.[fieldKey];

		if (!fieldSchema) {
			return acc;
		}

		const fieldSchemaTyped = fieldSchema as unknown as {
			getDefault: () => string | undefined;
			describe: () => GeneralizedFieldSpec;
		};

		return {
			...acc,
			[fieldKey]: {
				...fieldSchemaTyped.describe(),
				default: fieldSchemaTyped.getDefault() ?? undefined,
			},
		};
	}, {} as Record<TFieldKey, GeneralizedFieldSpec>);
