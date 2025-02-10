import { libimage, libsdl } from "../ffi";
import { type Pointer, ptr } from 'bun:ffi';
import Render from "./render";

/** @internal */
export default class Image {

    private pointer:  Pointer;
    private destArr: Uint32Array;

    public readonly width;
    public readonly height;

    constructor(path: string) {
        const cs = Buffer.from(path+'\x00');
        //@ts-expect-error Buffer error;
        const texture = libimage.symbols.IMG_LoadTexture(Render.pointer, cs);
        if (texture == null) throw `Texture creation failed.`;
        this.pointer = texture;

        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        libsdl.symbols.SDL_QueryTexture(texture, null, null, ptr(wArr), ptr(hArr));

        this.width = wArr[0];
        this.height = hArr[0];

        this.destArr = new Uint32Array(4);
        this.destArr[0] = 0;
        this.destArr[1] = 0;
        this.destArr[2] = this.width;
        this.destArr[3] = this.height;
    }
}