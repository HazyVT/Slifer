import { type Pointer } from 'bun:ffi';
import { libsdl } from "../ffi";
import Window from "./window";

/** @internal */
export default class Render {

    public static pointer : Pointer;
    public static surface: Pointer;
    public static destArray : Uint32Array;

    public static createRenderer(width: number, height: number) {
        const renPointer = libsdl.symbols.SDL_CreateRenderer(Window.pointer, -1, 0x00000004 + 0x00000002);
        if (renPointer == null) throw `Renderer creation failed.`;
        this.pointer = renPointer;
        const surPointer = libsdl.symbols.SDL_CreateRGBSurface(0, width, height, 32, 0, 0, 0, 0)
		if (surPointer == null) throw `Surface creation failed`;
		this.surface = surPointer;
		this.destArray = new Uint32Array(4);
		this.destArray[0] = 0;
		this.destArray[1] = 0;
		this.destArray[2] = width;
		this.destArray[3] = height;
    }
}
