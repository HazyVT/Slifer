import { type Pointer } from 'bun:ffi';
import { libsdl } from "../ffi";
import Window from "./window";

/** @internal */
export default class Render {

    public static pointer : Pointer;

    public static createRenderer(width: number, height: number) {
        const renPointer = libsdl.symbols.SDL_CreateRenderer(Window.pointer, -1, 0x00000004 + 0x00000002);
        if (renPointer == null) throw `Renderer creation failed.`;
        this.pointer = renPointer;
    }
}
