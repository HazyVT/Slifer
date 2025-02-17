import { libimage, libsdl } from "../ffi";
import { type Pointer, ptr, toArrayBuffer } from 'bun:ffi';
import Render from "./render";

/** @internal */
export default class Image {

    private pointer:  Pointer;
    private destArray: Uint32Array;

    public readonly width: number;
    public readonly height: number;

    constructor(path: string) {
        const cs = Buffer.from(path+'\x00');
        const surface = libimage.symbols.IMG_Load(cs);
        if (surface == null) throw `${libsdl.symbols.SDL_GetError()}`
        this.pointer = surface;


		// Convert to texture
		const texture = libsdl.symbols.SDL_CreateTextureFromSurface(
			Render.pointer,
			this.pointer
		)
		if (texture == null) throw `${libsdl.symbols.SDL_GetError()}`;

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

		this.destArray = new Uint32Array(4);
		this.destArray[2] = this.width;
		this.destArray[3] = this.height;
    }
}
