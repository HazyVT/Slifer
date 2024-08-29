import { type Pointer, ptr } from "bun:ffi";
import { libsdl, libttf } from "../ffi";
import type Color from "./color";

class Graphics {

    private renderer!: Pointer;
    private windowWidth!: number;
    private windowHeight!: number;

    /**
     * Load font for later use
     * 
     * @param path string path to the font
     * @param pt size of font
     * @returns Font type
     */
    loadFont(path: string, pt: number) : Font {
        const font = libttf.symbols.TTF_OpenFont(Buffer.from(path+"\x00"), pt);
        if (font == null) throw `Font load failed`;
        return font;
    }

    /**
     * Print text to the screen
     * 
     * @param font Font type - Made by calling Slifer.Graphics.loadFont
     * @param text string of words to draw to screen
     * @param color Color type - Made by making new Slifer.Color(r,g,b);
     * @param x optional param for x position
     * @param y optional param for y position
     */
    print(font: Font, text: string, color: Color, x?: number, y?: number) {
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

    /**
     * Print text to the center of the screen
     * 
     * @param font Font type - Made by calling Slifer.Graphics.loadFont
     * @param text text string of words to draw to screen
     * @param color Color type - Made by instantiating new Slifer.Color(r,g,b);
     */
    printc(font: Font, text: string, color: Color) {
        // Calculate size of text
        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        libttf.symbols.TTF_SizeText(font, Buffer.from(text+"\x00"), ptr(wArr), ptr(hArr));
        this.print(font, text, color, (this.windowWidth / 2) - (wArr[0] / 2), (this.windowHeight / 2) - (hArr[0] / 2));
    }

    /**
     * Render to the screen
     */
    flip() : void {
        libsdl.symbols.SDL_RenderPresent(this.renderer);
    }
}

export type Font = Pointer;

export default Graphics;