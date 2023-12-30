import { inspect } from 'util';
import { HTTPError } from 'ky-universal';
import {
	GeneralizedResponse,
	getGeneralizedError,
} from 'ergonomic/typescript-helpers/index.js';

export const handleKyError = async (
	error: unknown,
): Promise<GeneralizedResponse> => {
	console.error(
		'Encountered an error from ky request:',
		inspect(error, { depth: 10, colors: true }),
	);

	try {
		return (await (error as HTTPError).response.json()) as GeneralizedResponse;
	} catch (err) {
		const defaultResponse = {
			data: [],
			errors: [getGeneralizedError()],
		};
		return defaultResponse;
	}
};
