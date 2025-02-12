import { libimage, libsdl } from "../ffi";
import { type Pointer, ptr } from 'bun:ffi';
import Render from "./render";

/** @internal */
export default class Image {

    private pointer:  Pointer;

    constructor(path: string) {
        const cs = Buffer.from(path+'\x00');
        const surface = libimage.symbols.IMG_Load(cs);
        if (surface == null) throw `Loading ${path} failed`;
        this.pointer = surface;
    }
}
