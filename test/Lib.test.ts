import { describe, test, expect } from "vitest";
import { Instagram } from "../";

describe("Built library", () => {
	test("Instagram class is a named import", () => {
		expect(Instagram).toBeDefined();
	});
});