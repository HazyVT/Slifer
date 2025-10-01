import { sdl, sdlImage} from "./ffi.ts";
import Slifer from "./main.ts";

export function logError(message: string) {
    console.error(`%cERROR: ${message}`, "color: red;");
}

export class Color {
    readonly red: number;
    readonly green: number;
    readonly blue: number;

    constructor(red: number, green: number, blue: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
    }
}

export type Keys =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "0"
    | "space"
    | "tabspace"
    | "left shift"
    | "right shift"
    | "left ctrl"
    | "escape"
    | "backspace"
    | "."
    | "return";
        
export class Image {

    private _pointer: Deno.PointerValue;

    public readonly width: number;
    public readonly height: number;

    constructor(data: Uint8Array) {
        const fb = new Uint8Array(data).buffer;
        const rwops = sdl.SDL_RWFromMem(fb, fb.byteLength);
        if (rwops == null) {
            console.error("ERROR: Failed to load raw data");
            Deno.exit();
        }
        const rawTexture = sdlImage.IMG_LoadTexture_RW(Slifer.renderer, rwops)
        if (rawTexture == null) {
            console.error("ERROR: Failed to load texture from raw");
            Deno.exit();
        }


        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        sdl.SDL_QueryTexture(rawTexture, null, null, Deno.UnsafePointer.of(wArr), Deno.UnsafePointer.of(hArr));

        this.width = wArr[0];
        this.height = hArr[0];
        this._pointer = rawTexture;

        if (sdl.SDL_SetTextureBlendMode(this._pointer, 1) != 0) {
            console.error("ERROR: Failed to set blend mode of texture")
        }
        
    }

    /**
     * 
     * @param x - position on x axis to draw image.
     * @param y - position on y axis to draw image.
     * @param xScale - [Optional] multiply the width of the image. Default is 1 
     * @param yScale - [Optional] multiply the height of the image. Default is 1
     */
    draw(x: number, y: number, xScale: number = 1, yScale: number = 1) : void {
        const dest = new Uint32Array(4);
        dest[0] = x;
        dest[1] = y;
        dest[2] = this.width * xScale;
        dest[3] = this.height * yScale;
        
        sdl.SDL_RenderCopy(Slifer.renderer, this._pointer, null, Deno.UnsafePointer.of(dest));
    }

    setOpacity(value: number) : void {
        if (sdl.SDL_SetTextureAlphaMod(this._pointer, value) == 0) {
            console.error("ERROR: Failed to set the opacity of texture")
        }
    }
}