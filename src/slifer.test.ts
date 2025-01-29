import { describe, expect, it } from "bun:test";
import { initSDL, initSDLImage, initSDLTypeFont } from "./engine";
import Vector2 from "./engine/vector";
import Window from "./engine/window";
import Renderer from "./engine/renderer";

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

describe("Initializing SDL TTF ", () => {
    it("Should initialize without error ", () => {
        expect(() => initSDLTypeFont()).not.toThrow(Error);
    });
});

describe("Window Creation ", () => {
    it("Should create window without error", () => {
        expect(() =>
            Window.createWindow("Game", new Vector2(1, 1))
        ).not.toThrow(Error);
    });
});

describe("Renderer Creation ", () => {
    it("Should create renderer without error", () => {
        expect(() => Renderer.createRenderer()).not.toThrow(Error);
    });
});
