import { libsdl } from "../ffi";
import Global from "../global";

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