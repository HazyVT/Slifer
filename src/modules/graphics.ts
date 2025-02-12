import Vector2 from "../engine/vector2";
import { libsdl, libttf } from "../ffi";
import { ptr } from 'bun:ffi';
import Font from '../engine/font';
import type Image from "../engine/image";
import Render from "../engine/render";
import type Color from "../engine/color";
import type Rectangle from "../engine/rectangle";

/** @internal */
export default class Graphics {

    public render() : void {
        libsdl.symbols.SDL_RenderPresent(Render.pointer);
    }
    
    public draw(image: Image, x: number, y: number) : void {

        (image as any).destArr[0] = x;
        (image as any).destArr[1] = y;
        
        libsdl.symbols.SDL_RenderCopy(
            Render.pointer,
            (image as any).pointer,
            null,
            ptr((image as any).destArr)
        );
    }

    public drawEx(image: Image, x: number, y: number, rotation?: number, scaleX?: number, scaleY?: number, flipH?: boolean) {
        
        const destArr = (image as any).destArr;
        destArr[0] = x;
        destArr[1] = y;
        destArr[2] = image.width * (scaleX ? scaleX : 1)
        destArr[3] = image.height * (scaleY ? scaleY : 1);

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

    public setBackground(color: Color) : void {
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

    public print(text: string, x: number, y: number, font: Font, color: Color) {
    	const wArr = new Uint32Array(1);
    	const hArr = new Uint32Array(1);

    	libttf.symbols.TTF_SizeText(
	    	(font as any).pointer,
	    	Buffer.from(text+"\x00"),
	    	ptr(wArr),
	    	ptr(hArr)
    	);

    	const _col = ((color.r << 0) + (color.g << 8) + (color.b << 16));

    	const surface = libttf.symbols.TTF_RenderText_Solid(
    		(font as any).pointer,
    		Buffer.from(text+'\x00'),
    		_col
    	);
    	if (surface == null) throw `Rendering text failed`;

    	const texture = libsdl.symbols.SDL_CreateTextureFromSurface(
    		Render.pointer,
    		surface
    	);
			if (texture == null) throw `Texture Creation failed`;


			const destRect = new Uint32Array(4);
			destRect[0] = x;
			destRect[1] = y;
			destRect[2] = wArr[0];
			destRect[3] = hArr[0];
			libsdl.symbols.SDL_RenderCopy(
				Render.pointer,
				texture,
				null,
				ptr(destRect)
			);
    	

    	
    }
}
