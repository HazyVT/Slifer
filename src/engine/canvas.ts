import { type Pointer, ptr } from 'bun:ffi';
import { libsdl, libttf } from '../ffi';
import Image from './image';
import Render from './render';
import Color from './color';
import Font from './font';

/** @internal */
export default class Canvas {

	private pointer : Pointer;
	private destArray: Uint32Array;

	public readonly width;
	public readonly height;

	constructor(width: number, height: number) {
		const surPointer = libsdl.symbols.SDL_CreateRGBSurface(0, width, height, 32, 0, 0, 0, 0)
		if (surPointer == null) throw `Canvas creation failed`;
		this.pointer = surPointer;
		this.width = width;
		this.height = height;
		this.destArray = new Uint32Array(4);
		this.destArray[2] = this.width;
		this.destArray[3] = this.height;
	}

	private drawBG(color: Color) {
		const _col = ((color.r << 16) + (color.g << 8) + (color.b << 0));

		libsdl.symbols.SDL_FillRect(this.pointer, ptr(this.destArray), _col);
	}

	clear() {
        this.drawBG(new Color(0, 0, 0, 0));
	}

	setBackground(color: Color) {
		this.drawBG(color);
	}

	draw(drawable: Image | Canvas, x: number, y: number) : void {
		(drawable as any).destArray[0] = x;
		(drawable as any).destArray[1] = y;
		        
        libsdl.symbols.SDL_UpperBlitScaled(
        	(drawable as any).pointer,
        	null,
        	this.pointer,
        	ptr((drawable as any).destArray)
        );
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
				this.pointer,
				ptr(destRect)
	    	);
			
	    }
	

}
