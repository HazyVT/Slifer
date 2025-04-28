import { Color, type Image, Renderer } from "../engine.ts";
import { sdl } from "../ffi.ts";

/** @internal */
class Graphics {

    public static renderColor: Color = new Color(0, 0, 0, 255);
    public static backgroundColor: Color = new Color(0, 0, 0, 255);
    
    public render() {
        sdl.SDL_RenderPresent(Renderer.pointer);
    }

    private setColor(color: Color) {
        sdl.SDL_SetRenderDrawColor(
            Renderer.pointer,
            color.red, color.green, color.blue, color.alpha
        );
    }

    public setBackground(color: Color) {
        Graphics.backgroundColor = color;
    }

    public draw(image: Image, x: number, y: number, xScale?: number, yScale?: number, rotation?: number) {

        const dest = new Uint32Array(4);
        dest[0] = x;
        dest[1] = y;
        dest[2] = image.width * (xScale ? xScale : 1);
        dest[3] = image.height * (yScale ? yScale : 1);

        const rot = (rotation ? rotation : 0);

        //sdl.SDL_RenderCopy(Renderer.pointer, (image as any).pointer, (image as any).rectPointer, Deno.UnsafePointer.of(dest));
        // deno-lint-ignore no-explicit-any
        sdl.SDL_RenderCopyEx(Renderer.pointer, (image as any).pointer, (image as any).rectPointer, Deno.UnsafePointer.of(dest), rot, null, 0);
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