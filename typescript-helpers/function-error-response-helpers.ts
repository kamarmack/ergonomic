import {
	getEnum,
	EnumMember,
} from 'ergonomic/typescript-helpers/enum-helpers.js';

export const GeneralizedErrorCategoryEnum = getEnum([
	'doc.deleted',
	'doc.does-not-exist',
	'collection.does-not-exist',
	'collection.empty',
	'request.invalid-params',
	'request.timed-out',
	'request.unauthorized',
	'request.forbidden',
	'request.unknown-error',
]);
export type GeneralizedErrorCategory = EnumMember<
	typeof GeneralizedErrorCategoryEnum
>;

export const GeneralizedErrorStatusCodeEnum = getEnum([
	'400',
	'401',
	'403',
	'404',
	'500',
]);
export type GeneralizedErrorStatusCode = EnumMember<
	typeof GeneralizedErrorStatusCodeEnum
>;
export type GeneralizedErrorStatusCodeNumber = 400 | 401 | 403 | 404 | 500;
export const getGeneralizedErrorStatusCode = (
	errorCategory: GeneralizedErrorCategory,
): GeneralizedErrorStatusCode =>
	({
		'doc.deleted': GeneralizedErrorStatusCodeEnum.obj[404],
		'doc.does-not-exist': GeneralizedErrorStatusCodeEnum.obj[404],
		'collection.does-not-exist': GeneralizedErrorStatusCodeEnum.obj[404],
		'collection.empty': GeneralizedErrorStatusCodeEnum.obj[404],
		'request.invalid-params': GeneralizedErrorStatusCodeEnum.obj[400],
		'request.timed-out': GeneralizedErrorStatusCodeEnum.obj[400],
		'request.unauthorized': GeneralizedErrorStatusCodeEnum.obj[401],
		'request.forbidden': GeneralizedErrorStatusCodeEnum.obj[403],
		'request.unknown-error': GeneralizedErrorStatusCodeEnum.obj[500],
	}[errorCategory]);

/**
 * GeneralizedError
 *
 * An error that is thrown when a Function call or an API request fails.
 *
 * @property error The error object
 * @property error.category The category of the error
 * @property error.data The data
 * @property error.message The error message
 * @property error.status The status code
 * @property error.status_text The status text
 *
 * @example
 * {
 * 	error: {
 * 		category: 'request.invalid-params',
 * 		data: {
 * 				'username': [
 * 					'This field may not be blank.'
 * 				],
 * 		},
 * 		message: 'Invalid parameters were provided.',
 * 		status: 400,
 * 		status_text: 'Bad Request'
 * 	}
 * }
 */
export type GeneralizedError = {
	error: {
		category: GeneralizedErrorCategory;
		data: Record<string, unknown>;
		message: string;
		status_code: GeneralizedErrorStatusCodeNumber;
		status_text: string;
	};
};
const defaultGetGeneralizedErrorParams = {
	category: 'request.unknown-error' as const,
	data: {},
	message: 'An unknown error occurred.',
	status_text: 'Internal Server Error',
};
export const getGeneralizedError = (
	config: Partial<
		Omit<GeneralizedError['error'], 'status_code'>
	> = defaultGetGeneralizedErrorParams,
): GeneralizedError => ({
	error: {
		...defaultGetGeneralizedErrorParams,
		...config,
		status_code: parseInt(
			getGeneralizedErrorStatusCode(
				config.category || defaultGetGeneralizedErrorParams.category,
			),
		) as GeneralizedErrorStatusCodeNumber,
	},
});
