import { describe, expect, it } from "bun:test";
import { initSDL, initSDLImage, initSDLTypeFont } from "./engine";

describe("Initializing SDL ", () => {
    it("Should initialize without error ", () => {
        expect(() => initSDL()).not.toThrow(Error);
    });
});

describe("Initializing SDL Image ", () => {
    it("Should initialize without error ", () => {
        expect(() => initSDLImage()).not.toThrow(Error);
    });
});

describe("Initializing SDL TTF", () => {
    it("Should initialize without error ", () => {
        expect(() => initSDLTypeFont()).not.toThrow(Error);
    });
});
