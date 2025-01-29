import { describe, expect, it } from "bun:test";
import { initSDL, initSDLImage, initSDLTypeFont } from "./engine";
import Graphics from "./modules/graphics";

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

describe("Loading default font", () => {
    it("Should load default font without error", () => {
        expect(() => Graphics.font).not.toThrow(Error);
    });
});
