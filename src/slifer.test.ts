import { describe, expect, it } from "bun:test";
import { initLibraries } from "./engine";

describe("Initializing ", () => {
    it("Should initialize without error ", () => {
        expect(() => initLibraries()).not.toThrow(Error);
    });
});
