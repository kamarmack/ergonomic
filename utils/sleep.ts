import { DateTime } from 'luxon';

/**
 * Sleep for a specified number of seconds.
 * @param options - Options for the sleep function
 * @param {number} [options.seconds=5] - The number of seconds to sleep
 * @param {boolean} [options.verbose=false] - If true, logs the sleep duration and next time
 */
export async function sleep(
	options: { seconds?: number; verbose?: boolean } = {
		seconds: 5,
		verbose: false,
	},
): Promise<void> {
	const seconds = options.seconds ?? 5;
	if (options.verbose) {
		const nextTime = DateTime.now()
			.plus({ seconds })
			.toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS);
		console.log(`Sleeping for a bit... Continuing at ${nextTime}`);
	}
	return new Promise(function (resolve) {
		setTimeout(resolve, seconds * 1000);
	});
}

export async function sleepMs(milliseconds: number): Promise<void> {
	return new Promise(function (resolve) {
		setTimeout(resolve, milliseconds);
	});
}
