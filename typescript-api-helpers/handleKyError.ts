import { inspect } from 'util';
import { HTTPError } from 'ky-universal';
import {
	GeneralizedResponse,
	getGeneralizedError,
} from 'ergonomic/typescript-helpers/index.js';

const logKyError = (error: unknown): void => {
	console.error(
		'Encountered an error from ky request:',
		inspect(error, { depth: 10, colors: true }),
	);
};

export const handleKyError = async (
	error: unknown,
): Promise<GeneralizedResponse> => {
	try {
		const errorResponse = (await (
			error as HTTPError
		).response.json()) as GeneralizedResponse;
		logKyError(errorResponse);
		return errorResponse;
	} catch (err) {
		logKyError(err);
		const defaultResponse = {
			data: [],
			errors: [getGeneralizedError()],
		};
		return defaultResponse;
	}
};
