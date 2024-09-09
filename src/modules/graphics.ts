import { libimage, libsdl } from "../ffi";
import Global from "../global";
import { type Pointer, ptr } from 'bun:ffi';

class Graphics {
    /**
     * Slifers draw function. Used to draw everything to the screen.
     */
    render() {
        libsdl.symbols.SDL_RenderPresent(Global.ptrRenderer);
    }

    /**
     * Create a new color. All values are from 0-255
     * 
     * @param r red value 
     * @param g green value
     * @param b blue value
     * @param a alpha value
     * @returns Color object
     */
    makeColor(r: number, g: number, b: number, a: number) {
        const _color = new Color(r, g, b, a);
        return _color;
    }

    /**
     * Sets the background of the window to a color of choice. 
     * 
     * Make sure this is put in the top level of the while loop
     * as it will clear the renderer.
     * 
     * @param color Color object. Make using Slifer.Graphics.makeColor
     */
    setBackground(color: Color) {
        libsdl.symbols.SDL_SetRenderDrawColor(Global.ptrRenderer, color.r, color.g, color.b, color.a);
        libsdl.symbols.SDL_RenderClear(Global.ptrRenderer);
    }

    /**
     * Loads a new image
     * 
     * @param path string path to image
     * @returns Image ready to draw
     */
    loadImage(path: string) : Image {
        const _path = Buffer.from(path + "\x00");
        const surface = libimage.symbols.IMG_Load(_path);
        if (surface == null) throw `Image failed to load`;
        const texture = libsdl.symbols.SDL_CreateTextureFromSurface(Global.ptrRenderer, surface);
        if (texture == null) throw `Image failed to be created`;
        return new Image(texture);
    }

    draw(image: Image, x: number, y: number, width: number, height: number) {
        const _dest = new Uint32Array(4);
        _dest[0] = x;
        _dest[1] = y;
        _dest[2] = width;
        _dest[3] = height;
        libsdl.symbols.SDL_RenderCopy(Global.ptrRenderer, (image as any).pointer, null, ptr(_dest));
    }
    
}

class Image {

    private pointer;
    
    constructor(texture: Pointer) {
        this.pointer = texture;
    }
}

class Color {
    readonly r;
    readonly g;
    readonly b;
    readonly a;

    constructor(r: number, g: number, b: number, a: number) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
}

export default Graphics;