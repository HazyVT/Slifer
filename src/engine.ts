import { image, sdl } from "./ffi.ts";

const encoder = new TextEncoder();

/* @internal */
export class Window {
    public static pointer: Deno.PointerValue;
}

/* @internal */
export class Renderer {
    public static pointer:  Deno.PointerValue;
}

export class Image {

    private readonly pointer : Deno.PointerValue;

    public readonly width: number;
    public readonly height: number;

    constructor(path: string) {
        const pathArray = encoder.encode(path+"\x00");
        const texPointer = image.IMG_LoadTexture(Renderer.pointer, pathArray);
        if (texPointer == null) throw `Image Load Failed: ${path}`;
        this.pointer = texPointer;

        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        sdl.SDL_QueryTexture(texPointer, null, null, Deno.UnsafePointer.of(wArr), Deno.UnsafePointer.of(hArr));

        this.width = wArr[0];
        this.height = hArr[0];
    }

    public close() {
        sdl.SDL_DestroyTexture(this.pointer);
    }

}

export class Color {
    readonly red;
    readonly green;
    readonly blue;
    readonly alpha;

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}