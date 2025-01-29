import { type Pointer } from "bun:ffi";
import { libsdl } from "../ffi";
import Window from "./window";

class Renderer {
    static #instance: Renderer;
    static #pointer: Pointer;

    public static get instance() {
        if (!Renderer.#instance) {
            Renderer.#instance = new Renderer();
        }

        return Renderer.#instance;
    }

    public static get pointer() {
        return Renderer.#pointer;
    }

    static createRenderer() {
        const vsyncHint = 0x00000004;
        const _ren = libsdl.symbols.SDL_CreateRenderer(
            Window.pointer,
            -1,
            vsyncHint
        );

        if (_ren == null) throw `Renderer Creation Failed`;
        Renderer.#pointer = _ren;
    }
}

export default Renderer;
