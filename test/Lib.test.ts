import { describe, test, expect } from "vitest";
import { Instagram } from "../";
import IG from "../src/Instagram";

describe("Built library", () => {
	test("Instagram class is a named import", () => {
		expect(Instagram).toBeDefined();
	});

	test("Instagram import is of type Instagram", () => {
		expect(Instagram).toBeTypeOf(typeof IG);
	});
});
