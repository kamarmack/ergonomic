import * as R from 'ramda';
import * as EnumHelpers from './enum-helpers';

export const TsErrorCategoryEnum = EnumHelpers.getEnum([
	'doc.deleted',
	'doc.does-not-exist',
	'collection.does-not-exist',
	'collection.empty',
	'request.invalid-params',
	'request.timed-out',
	'request.unauthenticated',
	'request.unknown-error',
]);
export type TsErrorCategory = keyof typeof TsErrorCategoryEnum.obj;

export const TsErrorStatusCodeEnum = EnumHelpers.getEnum([
	'400',
	'401',
	'404',
	'500',
]);
export type TsErrorStatusCode = keyof typeof TsErrorStatusCodeEnum.obj;
export const getTsErrorStatusCode = (
	errorCategory: TsErrorCategory,
): TsErrorStatusCode =>
	({
		'doc.deleted': TsErrorStatusCodeEnum.obj[404],
		'doc.does-not-exist': TsErrorStatusCodeEnum.obj[404],
		'collection.does-not-exist': TsErrorStatusCodeEnum.obj[404],
		'collection.empty': TsErrorStatusCodeEnum.obj[404],
		'request.invalid-params': TsErrorStatusCodeEnum.obj[400],
		'request.timed-out': TsErrorStatusCodeEnum.obj[400],
		'request.unauthenticated': TsErrorStatusCodeEnum.obj[401],
		'request.unknown-error': TsErrorStatusCodeEnum.obj[500],
	}[errorCategory]);

export type TsError = {
	_object: 'error';
	category: TsErrorCategory;
	msg: unknown;
	status_code: TsErrorStatusCode;
	[key: string]: unknown;
};
export const getTsErrorFn =
	(category: TsErrorCategory = 'request.unknown-error') =>
	(msg = ''): TsError => ({
		_object: 'error',
		category,
		msg,
		status_code: getTsErrorStatusCode(category),
	});
const getDefaultTsError = getTsErrorFn();

export type TsResponse<T = unknown> = {
	data: T[];
	errors: TsError[];
};

export const getTsErrorResponse = <T = unknown>(
	getTsError = getDefaultTsError,
	msg = '',
): TsResponse<T> => ({
	data: [],
	errors: [getTsError(msg)],
});
export const isTsErrorResponse = <T = unknown>(
	response: TsResponse<T>,
): boolean => response.errors.length > 0;
export const isTsSuccessResponse = R.complement(isTsErrorResponse);
