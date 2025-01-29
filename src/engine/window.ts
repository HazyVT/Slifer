import { type Pointer } from "bun:ffi";
import Vector2 from "./vector";
import { libsdl } from "../ffi";

class Window {
    static #instance: Window;
    static #pointer: Pointer;

    public title!: string;
    public size!: Vector2;

    public static get instance() {
        if (!Window.#instance) {
            Window.#instance = new Window();
        }

        return Window.#instance;
    }

    public static get pointer() {
        return Window.#pointer;
    }

    public static createWindow(title: string, width: number, height: number) {
        Window.instance.title = title;
        Window.instance.size = new Vector2(width, height);

        // Create cstring by buffer from string
        const _titleBuffer = new Buffer(Window.instance.title + "\x00");

        // Centering window flag
        const _center = 0x2fff0000;

        // Create window pointer
        const _winPointer = libsdl.symbols.SDL_CreateWindow(
            _titleBuffer,
            _center,
            _center,
            Window.instance.size.x,
            Window.instance.size.y,
            0
        );

        if (_winPointer == null) throw `Window Creation Failed`;
        Window.#pointer = _winPointer;
    }
}

export default Window;
