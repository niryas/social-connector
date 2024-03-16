import { describe, test, expect } from "vitest";
import { Instagram, DIRECTION } from "../";
import IG from "../src/Instagram";
import { DIRECTION as DIR } from "../src/SocialConnector";

describe("Built library", () => {
	test("Instagram class is a named import", () => {
		expect(Instagram).toBeDefined();
	});

	test("Instagram import is of type Instagram", () => {
		expect(Instagram).toBeTypeOf(typeof IG);
	});

	test("DIRECTION import is of type DIRECTION", () => {
		expect(DIRECTION).toBeTypeOf(typeof DIR);
	});
});
