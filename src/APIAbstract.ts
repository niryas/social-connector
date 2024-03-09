import {APIInterface} from "./interfaces/API.ts";

export default abstract class APIAbstract implements APIInterface {
	public abstract get<T>(url: string): Promise<T>;

	public abstract post<T>(url: string, data: object): Promise<T>;
}
