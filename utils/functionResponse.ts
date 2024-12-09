import * as R from 'ramda';
import { GeneralizedError } from 'ergonomic/utils/functionErrorResponse.js';

export type GeneralizedResponse<T = unknown> = {
	data: T[];
	errors: GeneralizedError[];
};

export const isGeneralizedErrorResponse = <T = unknown>(
	response: GeneralizedResponse<T>,
): boolean => response.errors.length > 0;
export const isGeneralizedSuccessResponse = R.complement(
	isGeneralizedErrorResponse,
);
