import { type Pointer } from "bun:ffi";
import Vector2 from "./vector";
import { libsdl } from "../ffi";

class Window {
    static #instance: Window;
    static #pointer: Pointer;

    private title!: string;
    private size!: Vector2;

    private static readonly centerPos = 0x2fff0000;

    private constructor() {}

    public static get instance() {
        if (!Window.#instance) {
            Window.#instance = new Window();
        }

        return Window.#instance;
    }

    public static get pointer() {
        return Window.#pointer;
    }

    public static createWindow(title: string, size: Vector2): void {
        Window.instance.title = title;
        Window.instance.size = size;

        // Create cstring by buffer from string
        const _titleBuffer = new Buffer(Window.instance.title + "\x00");

        // Create window pointer
        const _winPointer = libsdl.symbols.SDL_CreateWindow(
            _titleBuffer,
            Window.centerPos,
            Window.centerPos,
            Window.instance.size.x,
            Window.instance.size.y,
            0
        );

        if (_winPointer == null) throw `Window Creation Failed`;
        Window.#pointer = _winPointer;
    }

    public setSize(size: Vector2): void {
        this.size = size;
        libsdl.symbols.SDL_SetWindowSize(Window.pointer, size.x, size.y);
    }

    public setTitle(title: string): void {
        this.title = title;
        libsdl.symbols.SDL_SetWindowTitle(
            Window.pointer,
            Buffer.from(title + "\x00")
        );
    }

    public setFullscreen(flag: boolean) {
        libsdl.symbols.SDL_SetWindowFullscreen(Window.pointer, Number(flag));
    }

    public setPosition(position: Vector2) {
        libsdl.symbols.SDL_SetWindowPosition(
            Window.pointer,
            position.x,
            position.y
        );
    }

    public centerWindow() {
        this.setPosition(new Vector2(Window.centerPos, Window.centerPos));
    }
}

export default Window;
