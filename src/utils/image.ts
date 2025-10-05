import { sdl, sdlImage, execPath, isCompiled } from '../ffi.ts';
import { join } from "@std/path";
import { logError } from "../utils.ts";
import Slifer from "../slifer.ts";

const encoder = new TextEncoder();

class Image {

    private _pointer: Deno.PointerValue;

    public readonly width: number;
    public readonly height: number;

    constructor(path: string) {
        const rawTexture = sdlImage.IMG_LoadTexture(
            Slifer.renderer, 
            encoder.encode(isCompiled && Deno.build.os == "darwin" ? join(execPath, "../Resources", path+"\x00") : path+"\x00")
        );
        
        if (rawTexture == null) {
            logError(`Image ${path} failed to load`);
        }

        sdl.SDL_SetTextureScaleMode(rawTexture, 0);
        

        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        sdl.SDL_QueryTexture(
            rawTexture, 
            null, null, 
            Deno.UnsafePointer.of(wArr), 
            Deno.UnsafePointer.of(hArr)
        );

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

    /**
     * 
     * @param value - Percentage of how high the opacity of the sprite should be. From 0 - 1
     */
    setOpacity(value: number) : void {
        if (sdl.SDL_SetTextureAlphaMod(this._pointer, Math.floor(value * 255)) != 0) {
            console.error("ERROR: Failed to set the opacity of texture")
        }
    }
}

export default Image;