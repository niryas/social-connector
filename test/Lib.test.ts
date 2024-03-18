import { describe, test, expect } from "vitest";
import { InstagramClient, DIRECTION } from "../";
import IG from "../src/InstagramClient";
import { DIRECTION as DIR } from "../src/SocialConnector";

describe("Built library", () => {
	test("InstagramClient class is a named import", () => {
		expect(InstagramClient).toBeDefined();
	});

	test("InstagramClient import is of type Instagram", () => {
		expect(InstagramClient).toBeTypeOf(typeof IG);
	});

	test("DIRECTION import is of type DIRECTION", () => {
		expect(DIRECTION).toBeTypeOf(typeof DIR);
	});
});
