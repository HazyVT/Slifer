import { libimage, libsdl } from "../ffi";
import { type Pointer, ptr, toArrayBuffer } from 'bun:ffi';
import Render from "./render";

/** @internal */
export default class Image {

    private pointer:  Pointer;

    public readonly width: number;
    public readonly height: number;

    constructor(path: string) {
        const cs = Buffer.from(path+'\x00');
        const surface = libimage.symbols.IMG_Load(cs);
        if (surface == null) throw `Loading ${path} failed`;
        this.pointer = surface;


		// Convert to texture
		const texture = libsdl.symbols.SDL_CreateTextureFromSurface(
			Render.pointer,
			this.pointer
		)
		if (texture == null) throw `Loading ${path} failed`;

		const wArr = new Uint32Array(1);
		const hArr = new Uint32Array(1);
		libsdl.symbols.SDL_QueryTexture(
			texture,
			null,
			null,
			ptr(wArr),
			ptr(hArr)
		)

		this.width = wArr[0];
		this.height = hArr[0];
    }
}
