import {APIInterface} from "./interfaces/API.ts";

const GET = "GET";
const POST = "POST";

export default class API implements APIInterface {
	get<T>(url: string): Promise<T> {
		return fetch(url, {method: GET}).then(this.handleResult<T>);
	}

	async post<T>(url: string, data: object): Promise<T> {
		const options = {
			method: POST,
			headers: {"Content-Type": "application/json"},
			body: JSON.stringify(data),
		};
		return fetch(url, options).then(this.handleResult<T>);
	}

	private async handleResult<T>(data: Response): Promise<T> {
		const jsonData = await data.json();

		if (!data.ok) {
			return Promise.reject(data);
		}

		return jsonData;
	}
}