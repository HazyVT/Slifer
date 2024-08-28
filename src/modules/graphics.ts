import { type Pointer, ptr } from "bun:ffi";
import { libsdl, libttf } from "../ffi";
import type Color from "./color";

class Graphics {

    private renderer!: Pointer;

    loadFont(path: string, pt: number) : Font {
        const font = libttf.symbols.TTF_OpenFont(Buffer.from(path+"\x00"), pt);
        if (font == null) throw `Font load failed`;
        return font;
    }

    drawText(font: Font, text: string, color: Color, x?: number, y?: number) {
        // Calculate size of text
        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        libttf.symbols.TTF_SizeText(font, Buffer.from(text+"\x00"), ptr(wArr), ptr(hArr));
        
        const surface = libttf.symbols.TTF_RenderText_Solid(font, Buffer.from(text+"\x00"), (color as any).value);
        const texture = libsdl.symbols.SDL_CreateTextureFromSurface(this.renderer, surface);

        const destRect = new Uint32Array(4);
        destRect[0] = x ? x : 0;
        destRect[1] = y ? y : 0;
        destRect[2] = wArr[0];
        destRect[3] = hArr[0];
        
        libsdl.symbols.SDL_RenderCopy(
            this.renderer,
            texture,
            null, ptr(destRect)
        );
    }

    flip() : void {
        libsdl.symbols.SDL_RenderPresent(this.renderer);
    }
}

export type Font = Pointer;

export default Graphics;