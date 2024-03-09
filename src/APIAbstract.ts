import {APIInterface} from "./interfaces/API.ts";

/** @classdesc Base API Abstract class. Custom implementations of an API service
 * should extend this class.
 *
 * The exact implementation details, as well as additional public or private methods
 * are fully customizable.
 *
 * */
export default abstract class APIAbstract implements APIInterface {
	public abstract get<T>(url: string): Promise<T>;

	public abstract post<T>(url: string, data: object): Promise<T>;
}
