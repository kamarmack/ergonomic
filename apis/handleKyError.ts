import { inspect } from 'util';
import { HTTPError } from 'ky-universal';
import {
	getGeneralizedError,
	GeneralizedError,
} from 'ergonomic/utils/error.js';

const logKyError = (error: unknown): void => {
	console.error(
		'Encountered an error from ky request:',
		inspect(error, { depth: 10, colors: true }),
	);
};

export const handleKyError = async (
	error: unknown,
): Promise<GeneralizedError> => {
	try {
		const errorResponse = (await (
			error as HTTPError
		).response.json()) as GeneralizedError;
		logKyError(errorResponse);
		return errorResponse;
	} catch (err) {
		logKyError(err);
		return getGeneralizedError();
	}
};
