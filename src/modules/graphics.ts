import Vector2 from "../engine/vector2";
import { libsdl } from "../ffi";
import { ptr } from 'bun:ffi';

import type Image from "../engine/image";
import Render from "../engine/render";
import type Color from "../engine/color";
import type Rectangle from "../engine/rectangle";

/** @internal */
export default class Graphics {

    render() : void {
        libsdl.symbols.SDL_RenderPresent(Render.pointer);
    }
    
    draw(image: Image, position: Vector2) : void {

        (image as any).destArr[0] = position.x;
        (image as any).destArr[1] = position.y;
        
        libsdl.symbols.SDL_RenderCopy(
            Render.pointer,
            (image as any).pointer,
            null,
            ptr((image as any).destArr)
        );
    }

    drawEx(image: Image, position: Vector2, rotation?: number, scale?: Vector2, flipH?: boolean) {
        
        const destArr = (image as any).destArr;
        destArr[0] = position.x;
        destArr[1] = position.y;
        destArr[2] = image.width * (scale ? scale.x : 1);
        destArr[3] = image.height * (scale ? scale.y : 1);

        libsdl.symbols.SDL_RenderCopyEx(
            Render.pointer,
            (image as any).pointer,
            null,
            ptr(destArr),
            rotation ? rotation : 0,
            null,
            Number(flipH)
        );


    }

    setBackground(color: Color) : void {
        libsdl.symbols.SDL_SetRenderDrawColor(Render.pointer,
            color.r,
            color.g,
            color.b,
            color.a
        );
        libsdl.symbols.SDL_RenderClear(Render.pointer);
    }

    public drawRect(rectangle: Rectangle, color: Color) {
        libsdl.symbols.SDL_SetRenderDrawColor(
            Render.pointer,
            color.r,
            color.g,
            color.b,
            color.a
        );

        const rect = new Uint32Array(4);
        rect[0] = rectangle.position.x;
        rect[1] = rectangle.position.y;
        rect[2] = rectangle.size.x;
        rect[3] = rectangle.size.y;

        libsdl.symbols.SDL_RenderFillRect(Render.pointer, ptr(rect));
    }
}