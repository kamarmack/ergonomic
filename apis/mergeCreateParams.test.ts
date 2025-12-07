import * as yup from 'yup';
import { getApiResourceSpec } from 'ergonomic/apis/getApiResourceSpec.js';
import { getEnum } from 'ergonomic/utils/enum.js';

describe('mergeCreateParams', () => {
	// Define a test schema
	const testProperties = {
		_archived: yup.boolean().default(false),
		_created_by: yup.string().default(''),
		_date_created: yup.string().default(''),
		_date_last_modified: yup.string().default(''),
		_deleted: yup.boolean().default(false),
		_id: yup.string().optional(),
		_object: yup.string().default('testResource'),
		category: yup.string().optional(),
		description: yup.string().default(''),
		name: yup.string().optional(),
		testField: yup.string().optional(),
		nestedField: yup
			.object({
				subField1: yup.string().optional(),
				subField2: yup.number().optional(),
			})
			.optional(),
	};

	const createParamsRequiredFieldEnum = getEnum(['name'] as const);

	const apiResourceSpec = getApiResourceSpec({
		createParamsRequiredFieldEnum,
		idPrefix: 'test',
		properties: testProperties,
		resourceNamePlural: 'testResources',
	});

	test('should not include undefined fields in the result', () => {
		const createParams = {
			name: 'Test Resource',
			description: 'A test resource',
			testField: undefined, // This should be filtered out
			category: undefined, // This should be filtered out
		};

		const result = apiResourceSpec.mergeCreateParams({ createParams });

		// Check that undefined fields are not present in the result
		expect(result).not.toHaveProperty('testField');
		expect(result).not.toHaveProperty('category');

		// Check that defined fields are present
		expect(result.name).toBe('Test Resource');
		expect(result.description).toBe('A test resource');

		// Check that no property has undefined value
		Object.keys(result).forEach((key) => {
			expect((result as any)[key]).not.toBe(undefined);
		});
	});

	test('should handle nested objects with undefined values', () => {
		const createParams = {
			name: 'Test Resource',
			nestedField: {
				subField1: 'value1',
				subField2: undefined, // This should be handled properly
			},
		};

		const result = apiResourceSpec.mergeCreateParams({ createParams });

		// The nested field should not contain undefined values
		if (result.nestedField) {
			Object.keys(result.nestedField).forEach((key) => {
				expect((result.nestedField as any)[key]).not.toBe(undefined);
			});
		}
	});

	test('should handle completely undefined nested objects', () => {
		const createParams = {
			name: 'Test Resource',
			nestedField: undefined, // Entire nested object is undefined
		};

		const result = apiResourceSpec.mergeCreateParams({ createParams });

		// nestedField should not be present or should not be undefined
		if ('nestedField' in result) {
			expect(result.nestedField).not.toBe(undefined);
		}
	});

	test('should preserve required fields and handle undefined values', () => {
		const createParams = {
			name: 'Required Name', // name is required
			description: 'A test resource',
			testField: undefined, // This should be filtered out
		};

		const result = apiResourceSpec.mergeCreateParams({ createParams });

		// Should not throw an error and should handle gracefully
		expect(result).toBeDefined();
		expect(result.name).toBe('Required Name');
		expect(result.description).toBe('A test resource');
		expect(result).not.toHaveProperty('testField');
	});

	test('should be compatible with Firestore by having no undefined values', () => {
		// Simulate a typical Firestore use case
		const createParams = {
			name: 'Test Resource',
			description: 'A test resource',
			category: undefined, // Common scenario in forms where optional field is not filled
			testField: undefined, // Undefined field that should be filtered
		};

		const result = apiResourceSpec.mergeCreateParams({ createParams });

		// Simulate Firestore validation - should not throw error about undefined values
		const validateFirestoreDocument = (doc: any) => {
			const checkForUndefined = (obj: any, path = ''): string[] => {
				const undefinedFields: string[] = [];
				for (const [key, value] of Object.entries(obj)) {
					const currentPath = path ? `${path}.${key}` : key;
					if (value === undefined) {
						undefinedFields.push(currentPath);
					} else if (
						value !== null &&
						typeof value === 'object' &&
						!Array.isArray(value)
					) {
						undefinedFields.push(...checkForUndefined(value, currentPath));
					}
				}
				return undefinedFields;
			};

			const undefinedFields = checkForUndefined(doc);
			if (undefinedFields.length > 0) {
				throw new Error(
					`Cannot use "undefined" as a Firestore value (found in field "${undefinedFields[0]}")`,
				);
			}
		};

		// This should not throw an error - proving the fix resolves the original issue
		expect(() => validateFirestoreDocument(result)).not.toThrow();
	});
});

describe('mergeUpdateParams', () => {
	// Define a test schema
	const testProperties = {
		_archived: yup.boolean().default(false),
		_created_by: yup.string().default(''),
		_date_created: yup.string().default(''),
		_date_last_modified: yup.string().default(''),
		_deleted: yup.boolean().default(false),
		_id: yup.string().optional(),
		_object: yup.string().default('testResource'),
		category: yup.string().optional(),
		description: yup.string().default(''),
		name: yup.string().optional(),
		testField: yup.string().optional(),
		nestedField: yup
			.object({
				subField1: yup.string().optional(),
				subField2: yup.number().optional(),
			})
			.optional(),
	};

	const createParamsRequiredFieldEnum = getEnum(['name'] as const);

	const apiResourceSpec = getApiResourceSpec({
		createParamsRequiredFieldEnum,
		idPrefix: 'test',
		properties: testProperties,
		resourceNamePlural: 'testResources',
	});

	test('should not include undefined fields in update result', () => {
		const prevApiResourceJson = {
			_archived: false,
			_created_by: 'user1',
			_date_created: '2023-01-01T00:00:00Z',
			_date_last_modified: '2023-01-01T00:00:00Z',
			_deleted: false,
			_id: 'test_123',
			_object: 'testResource',
			category: 'existing',
			description: 'Existing resource',
			name: 'Existing Name',
		} as any;

		const updateParams = {
			description: 'Updated description',
			testField: undefined, // This should be filtered out
			category: undefined, // This should be filtered out
		};

		const result = apiResourceSpec.mergeUpdateParams({
			prevApiResourceJson,
			updateParams,
		});

		// Check that undefined fields are not present in the result
		expect(result).not.toHaveProperty('testField');

		// Check that defined fields are updated
		expect(result.description).toBe('Updated description');
		expect(result.name).toBe('Existing Name'); // Should preserve existing values

		// Check that no property has undefined value
		Object.keys(result).forEach((key) => {
			expect((result as any)[key]).not.toBe(undefined);
		});
	});

	test('should handle nested objects with undefined values in updates', () => {
		const prevApiResourceJson = {
			_archived: false,
			_created_by: 'user1',
			_date_created: '2023-01-01T00:00:00Z',
			_date_last_modified: '2023-01-01T00:00:00Z',
			_deleted: false,
			_id: 'test_123',
			_object: 'testResource',
			description: 'Existing resource',
			name: 'Existing Name',
		} as any;

		const updateParams = {
			nestedField: {
				subField1: 'updated value',
				subField2: undefined, // This should be handled properly
			},
		};

		const result = apiResourceSpec.mergeUpdateParams({
			prevApiResourceJson,
			updateParams,
		});

		// The nested field should not contain undefined values
		if (result.nestedField) {
			Object.keys(result.nestedField).forEach((key) => {
				expect((result.nestedField as any)[key]).not.toBe(undefined);
			});
		}
	});

	test('should be compatible with Firestore by having no undefined values', () => {
		// Simulate a typical Firestore use case
		const prevApiResourceJson = {
			_archived: false,
			_created_by: 'user1',
			_date_created: '2023-01-01T00:00:00Z',
			_date_last_modified: '2023-01-01T00:00:00Z',
			_deleted: false,
			_id: 'test_123',
			_object: 'testResource',
			description: 'Existing resource',
			name: 'Existing Name',
		} as any;

		const updateParams = {
			description: 'Updated description',
			category: undefined, // Common scenario where field is cleared
			testField: undefined, // Undefined field that should be filtered
		};

		const result = apiResourceSpec.mergeUpdateParams({
			prevApiResourceJson,
			updateParams,
		});

		// Simulate Firestore validation - should not throw error about undefined values
		const validateFirestoreDocument = (doc: any) => {
			const checkForUndefined = (obj: any, path = ''): string[] => {
				const undefinedFields: string[] = [];
				for (const [key, value] of Object.entries(obj)) {
					const currentPath = path ? `${path}.${key}` : key;
					if (value === undefined) {
						undefinedFields.push(currentPath);
					} else if (
						value !== null &&
						typeof value === 'object' &&
						!Array.isArray(value)
					) {
						undefinedFields.push(...checkForUndefined(value, currentPath));
					}
				}
				return undefinedFields;
			};

			const undefinedFields = checkForUndefined(doc);
			if (undefinedFields.length > 0) {
				throw new Error(
					`Cannot use "undefined" as a Firestore value (found in field "${undefinedFields[0]}")`,
				);
			}
		};

		// This should not throw an error
		expect(() => validateFirestoreDocument(result)).not.toThrow();
	});
});
