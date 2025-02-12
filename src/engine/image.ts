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
        //@ts-expect-error
        const surface = libimage.symbols.IMG_Load(cs);
        if (surface == null) throw `Loading ${path} failed`;
        this.pointer = surface;
		const dv = new DataView(toArrayBuffer(this.pointer, 0, 21));
		this.width = dv.getUint8(16);
		this.height = dv.getUint8(20);
    }
}
