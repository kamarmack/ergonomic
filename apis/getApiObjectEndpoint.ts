import * as changeCase from 'change-case';

export const getApiObjectEndpoint = (objectPlural: string): string => {
	return changeCase.paramCase(objectPlural);
};
