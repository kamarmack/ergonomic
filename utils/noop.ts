export function noop(): void {
	return void 0;
}
export function noopAsync(): Promise<void> {
	return Promise.resolve();
}
