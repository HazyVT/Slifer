import { Color, Image, Renderer } from "../engine.ts";
import { sdl } from "../ffi.ts";

/** @internal */
class Graphics {
    
    public render() {
        sdl.SDL_RenderPresent(Renderer.pointer);
    }

    public setBackground(color: Color) {
        sdl.SDL_SetRenderDrawColor(Renderer.pointer, color.red, color.green, color.blue, color.alpha);
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
}

export default Graphics;