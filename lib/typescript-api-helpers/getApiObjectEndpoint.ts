import * as changeCase from 'change-case';

export const getApiObjectEndpoint = (_object: string): string => {
	return changeCase.paramCase(_object) + 's';
};
