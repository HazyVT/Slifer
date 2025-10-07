import { libs } from "../ffi.ts";
import { logError } from "./logging.ts";
import Slifer from '../slifer.ts'
import Color, { colorToNumber } from "./color.ts";

const encoder = new TextEncoder();

class Font {

    private _pointer;
    private _texture: Deno.PointerObject<unknown> | null = null;
    private _text: string | null = null;
    private _color: number = -1;

    public width: number = 0;
    public height: number = 0;

    constructor(path: string, pt: number) {
        const fontPointer = libs.TTF.TTF_OpenFont(encoder.encode(path + "\x00"), pt);
        if (fontPointer == null) {
            logError(`Failed to open font ${path}`);
            Deno.exit();
        }
        this._pointer = fontPointer;

        Slifer.loadedFonts.push(this._pointer);


    }

    private createTexture(text: string) {
        const textSurface = libs.TTF.TTF_RenderText_Solid(this._pointer, encoder.encode(text + "\x00"), this._color);
        if (textSurface == null) {
            logError(`Failed to create surface for text: ${text}`);
            Deno.exit();
        }

        const textTexture = libs.SDL.SDL_CreateTextureFromSurface(Slifer.renderer, textSurface);
        if (textTexture == null) {
            logError(`Failed to create texture for text: ${text}`);
            Deno.exit();
        }

        libs.SDL.SDL_FreeSurface(textSurface);

        if (Slifer.loadedTextures.includes(this._texture)) {
            Slifer.loadedTextures.splice(Slifer.loadedTextures.indexOf(this._texture), 1);
        }
        

        this._texture = textTexture;
        Slifer.loadedTextures.push(this._texture);


        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        libs.SDL.SDL_QueryTexture(
            this._texture,
            null, null,
            Deno.UnsafePointer.of(wArr),
            Deno.UnsafePointer.of(hArr)
        );

        this.width = wArr[0];
        this.height = hArr[0];

        this._text = text;
    }

    print(text: string, x: number, y: number, color?: Color) {
        const colorToRender = colorToNumber(color ? color : new Color(255, 255, 255));
        if (!this._texture || text != this._text || colorToRender != this._color) {
            this._color = colorToRender;
            this.createTexture(text);
        }

        const dest = new Uint32Array(4);
        dest[0] = x;
        dest[1] = y;
        dest[2] = this.width;
        dest[3] = this.height;

        const copy = libs.SDL.SDL_RenderCopy(
            Slifer.renderer,
            this._texture,
            null,
            Deno.UnsafePointer.of(dest)
        );

        if (copy != 0) {
            logError("Failed to render text to screen");
            Deno.exit();
        }
    }
}

export default Font;