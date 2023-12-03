export const isFilePath = (stringValue: unknown): stringValue is string =>
	typeof stringValue === 'string' &&
	Array.isArray(stringValue.match(/^[a-zA-Z0-9-_/]+(\.[a-z]+)?$/));
