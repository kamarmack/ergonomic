import * as changeCase from 'change-case';

export const getApiResourceEndpoint = (resourcePlural: string): string => {
	return changeCase.paramCase(resourcePlural);
};
