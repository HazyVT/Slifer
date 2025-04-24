import { Color, Image, Renderer } from "../engine.ts";
import { sdl } from "../ffi.ts";

/** @internal */
class Graphics {
    
    public render() {
        sdl.SDL_RenderPresent(Renderer.pointer);
    }

    private setColor(color: Color) {
        sdl.SDL_SetRenderDrawColor(Renderer.pointer, color.red, color.green, color.blue, color.alpha);
    }

    public setBackground(color: Color) {
        this.setColor(color);
        sdl.SDL_RenderClear(Renderer.pointer);
    }

    public draw(image: Image, x: number, y: number) {

        const dest = new Uint32Array(4);
        dest[0] = x;
        dest[1] = y;
        dest[2] = image.width;
        dest[3] = image.height;

        // deno-lint-ignore no-explicit-any
        sdl.SDL_RenderCopy(Renderer.pointer, (image as any).pointer, null, Deno.UnsafePointer.of(dest));
    }

    public rectangle(mode:  'fill' | 'line', x: number, y: number, width: number, height: number, color: Color) {

        const dest = new Uint32Array(4);
        dest[0] = x;
        dest[1] = y;
        dest[2] = width;
        dest[3] = height;

        this.setColor(color);

        
        switch (mode) {
            case 'fill':
                sdl.SDL_RenderFillRect(Renderer.pointer, Deno.UnsafePointer.of(dest));
                break;
            case 'line':
                sdl.SDL_RenderDrawRect(Renderer.pointer, Deno.UnsafePointer.of(dest));
                break;
        }
    }
}

export default Graphics;