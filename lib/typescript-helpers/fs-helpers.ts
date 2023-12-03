import { statSync } from 'fs';

export const isFile = (path: string): boolean => {
	try {
		return statSync(path).isFile();
	} catch (_) {
		return false;
	}
};
