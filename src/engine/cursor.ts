import { type Pointer } from 'bun:ffi';
import { libsdl, libimage } from '../ffi';

class Cursor {
	pointer : Pointer;

	constructor(path: string) {
		//@ts-expect-error
		const surf = libimage.symbols.IMG_Load(Buffer.from(path+"\x00"));
		if (surf == null) throw `Cursor surface ${path} failed`;
		const cursor = libsdl.symbols.SDL_CreateColorCursor(surf, 0, 0);
		if (cursor == null) throw `Cursor ${path} failed`;
		this.pointer = cursor; 
	}
}

export default Cursor;
