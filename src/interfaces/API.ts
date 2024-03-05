export interface APIInterface {
	post<T>(url: string, data: object): Promise<T>;
	get<T>(url: string): Promise<T>;
}
