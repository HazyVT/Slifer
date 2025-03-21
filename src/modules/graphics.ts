import Vector2 from "../engine/vector2";
import { libsdl, libttf } from "../ffi";
import { ptr } from 'bun:ffi';
import Font from '../engine/font';
import type Image from "../engine/image";
import Render from "../engine/render";
import Window from '../engine/window';
import type Color from "../engine/color";
import Rectangle from "../engine/rectangle";
import Cursor from '../engine/cursor';

type Drawable = Image;

/** @internal */
export default class Graphics {
	public render() {
		libsdl.symbols.SDL_RenderPresent(Render.pointer);
	}

	public draw(drawable: Drawable, x: number, y: number) {
		(drawable as any).destArray[0] = x;
		(drawable as any).destArray[1] = y;
		
		libsdl.symbols.SDL_RenderCopy(
			Render.pointer,
			(drawable as any).pointer,
			null,
			ptr((drawable as any).destArray)
		)
	}

	public drawScaled(drawable: Drawable, x: number, y: number, xscale: number, yscale: number) {
		(drawable as any).destArray[0] = x;
		(drawable as any).destArray[1] = y;
		(drawable as any).destArray[2] = drawable.width * xscale;
		(drawable as any).destArray[3] = drawable.height * yscale;
		
		libsdl.symbols.SDL_RenderCopy(
			Render.pointer,
			(drawable as any).pointer,
			null,
			ptr((drawable as any).destArray)
		)
	}

	private setColor(color: Color) {
		libsdl.symbols.SDL_SetRenderDrawColor(Render.pointer, color.r, color.g, color.b, color.a);
	}

	public setBackground(color: Color) {
		this.setColor(color);
		libsdl.symbols.SDL_RenderClear(Render.pointer);
	}

	public drawRect(rectangle: Rectangle, color: Color) {
		this.setColor(color);

		const rect = new Uint32Array(4);
		rect[0] = rectangle.position.x;
		rect[1] = rectangle.position.y;
		rect[2] = rectangle.size.x;
		rect[3] = rectangle.size.y;
		
		libsdl.symbols.SDL_RenderFillRect(Render.pointer, ptr(rect));
	}
}