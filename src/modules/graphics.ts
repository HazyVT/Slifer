import type { Pointer } from "bun:ffi";
import { libsdl, libttf } from "../ffi";

class Graphics {

    private renderer!: Pointer;

    loadFont(path: string, pt: number) : Font {
        const font = libttf.symbols.TTF_OpenFont(Buffer.from(path+"\x00"), pt);
        if (font == null) throw `Font load failed`;
        return font;
    }

    drawText(font: Font, text: string, color: number) {
        const surface = libttf.symbols.TTF_RenderText_Solid(font, Buffer.from(text+"\x00"), color);
        const texture = libsdl.symbols.SDL_CreateTextureFromSurface(this.renderer, surface);
        libsdl.symbols.SDL_RenderCopy(
            this.renderer,
            texture,
            null, null
        );
    }

    flip() : void {
        libsdl.symbols.SDL_RenderPresent(this.renderer);
    }
}

export type Font = Pointer;

export default Graphics;