import * as R from 'ramda';
import { getEnum } from 'ergonomic/typescript-helpers/enum-helpers.js';

export const GeneralizedErrorCategoryEnum = getEnum([
	'doc.deleted',
	'doc.does-not-exist',
	'collection.does-not-exist',
	'collection.empty',
	'request.invalid-params',
	'request.timed-out',
	'request.unauthenticated',
	'request.unknown-error',
]);
export type GeneralizedErrorCategory =
	keyof typeof GeneralizedErrorCategoryEnum.obj;

export const GeneralizedErrorStatusCodeEnum = getEnum([
	'400',
	'401',
	'404',
	'500',
]);
export type GeneralizedErrorStatusCode =
	keyof typeof GeneralizedErrorStatusCodeEnum.obj;
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
		'request.unauthenticated': GeneralizedErrorStatusCodeEnum.obj[401],
		'request.unknown-error': GeneralizedErrorStatusCodeEnum.obj[500],
	}[errorCategory]);

export type GeneralizedError = {
	_object: 'error';
	category: GeneralizedErrorCategory;
	msg: unknown;
	status_code: GeneralizedErrorStatusCode;
	[key: string]: unknown;
};
export const getGeneralizedErrorFn =
	(category: GeneralizedErrorCategory = 'request.unknown-error') =>
	(msg = ''): GeneralizedError => ({
		_object: 'error',
		category,
		msg,
		status_code: getGeneralizedErrorStatusCode(category),
	});
const getDefaultGeneralizedError = getGeneralizedErrorFn();

export type GeneralizedResponse<T = unknown> = {
	data: T[];
	errors: GeneralizedError[];
};

export const getGeneralizedErrorResponse = <T = unknown>(
	getGeneralizedError = getDefaultGeneralizedError,
	msg = '',
): GeneralizedResponse<T> => ({
	data: [],
	errors: [getGeneralizedError(msg)],
});
export const isGeneralizedErrorResponse = <T = unknown>(
	response: GeneralizedResponse<T>,
): boolean => response.errors.length > 0;
export const isGeneralizedSuccessResponse = R.complement(
	isGeneralizedErrorResponse,
);
