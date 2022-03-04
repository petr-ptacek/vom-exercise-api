export class HTTPError extends Error {

	public response: Response;
	public data: unknown;

	constructor(response: Response, data?: unknown) {
		super('HTTP Error');

		this.data = data;
		this.response = response;
	}
}
