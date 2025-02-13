import Vector2 from "../engine/vector2";
import { libsdl, libttf } from "../ffi";
import { ptr } from 'bun:ffi';
import Font from '../engine/font';
import type Image from "../engine/image";
import Render from "../engine/render";
import Window from '../engine/window';
import type Color from "../engine/color";
import Rectangle from "../engine/rectangle";
import Canvas from '../engine/canvas';

/** @internal */
export default class Graphics {

    public render() : void {
    	const texture = libsdl.symbols.SDL_CreateTextureFromSurface(Render.pointer, Render.surface);
    	if (texture == null) throw `Render texture creation failed`;
    	libsdl.symbols.SDL_RenderCopy(
    		Render.pointer,
    		texture,
    		null,
    		null
    	);
        libsdl.symbols.SDL_RenderPresent(Render.pointer);
        libsdl.symbols.SDL_DestroyTexture(texture);
    }
    
    public draw(drawable: Image | Canvas, x: number, y: number) : void {

		(drawable as any).destArray[0] = x;
		(drawable as any).destArray[1] = y;
		
		        
        libsdl.symbols.SDL_UpperBlitScaled(
        	(drawable as any).pointer,
        	null,
        	Render.surface,
        	ptr((drawable as any).destArray)
        );
    }

    public setBackground(color: Color) : void {
		const _col = ((color.r << 16) + (color.g << 8) + (color.b << 0));
		libsdl.symbols.SDL_FillRect(Render.surface, ptr(Render.destArray), _col);

   	}

    public drawRect(rectangle: Rectangle, color: Color) {
		const _col = ((color.r << 16) + (color.g << 8) + (color.b << 0));

        const rect = new Uint32Array(4);
        rect[0] = rectangle.position.x;
    	rect[1] = rectangle.position.y;
        rect[2] = rectangle.size.x;
        rect[3] = rectangle.size.y;

        libsdl.symbols.SDL_FillRect(Render.surface, ptr(rect), _col);
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

    	const _col = ((color.r << 16) + (color.g << 8) + (color.b << 0));

    	const surface = libttf.symbols.TTF_RenderText_Solid(
    		(font as any).pointer,
    	  	Buffer.from(text+'\x00'),
    	   	_col
    	);
    	if (surface == null) throw `Rendering text failed`;

    	const destRect = new Uint32Array(4);
		destRect[0] = x;
		destRect[1] = y;
		destRect[2] = wArr[0];
		destRect[3] = hArr[0];

    	libsdl.symbols.SDL_UpperBlitScaled(
			surface,
			null,
			Render.surface,
			ptr(destRect)
    	);
		
    }
}
