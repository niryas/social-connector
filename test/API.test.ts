import { afterAll, afterEach, beforeAll, describe, expect, test } from "vitest";
import API from "../src/API";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const handlers = [
	http.get("http://localhost", () => {
		return HttpResponse.json({});
	}),

	http.get("http://localhost/json", () => {
		return HttpResponse.json({ thisIsJson: true });
	}),

	http.get("http://error", () => {
		return new HttpResponse(null, { status: 400 });
	}),

	http.post("http://localhost/json", async ({ request }) => {
		const data = await request.json();
		if (!data || !data["thisIsJson"]) {
			return new HttpResponse(null, { status: 400 });
		}

		const returnValue = {};
		if (data["returnData"]) {
			returnValue["someData"] = true;
		}
		return HttpResponse.json(returnValue);
	}),
];

const server = setupServer(...handlers);

describe("API", () => {
	beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

	afterAll(() => server.close());

	afterEach(() => server.resetHandlers());

	describe("get()", () => {
		test("sends a request", async () => {
			const api = new API();

			const result =
				await api.get<Record<string, never>>("http://localhost");
			expect(result).toBeDefined();
		});
		test("returns a json response", async () => {
			const api = new API();

			const result = await api.get<{ thisIsJson: boolean }>(
				"http://localhost/json",
			);
			expect(result.thisIsJson).toBeTruthy();
		});
		test("raises error if request fails", async () => {
			const api = new API();

			let statusCode: number;
			try {
				await api.get("http://error");
			} catch (e) {
				statusCode = e.status;
			}
			expect(statusCode).toBe(400);
		});
	});

	describe("post()", () => {
		test("sends a post request with data", async () => {
			const api = new API();

			const data = { thisIsJson: true };
			const result = await api.post("http://localhost/json", data);
			expect(result).toBeDefined();
		});
		test("returns a json response", async () => {
			const api = new API();

			const data = { thisIsJson: true, returnData: true };
			const result = await api.post("http://localhost/json", data);
			expect(result["someData"]).toBeTruthy();
		});
		test("raises error if request fails", async () => {
			const api = new API();

			let statusCode: number;
			try {
				await api.post("http://localhost/json", {});
			} catch (e) {
				statusCode = e.status;
			}
			expect(statusCode).toBe(400);
		});
	});
});
