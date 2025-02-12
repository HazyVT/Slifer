import { type Pointer } from 'bun:ffi';
import { libttf } from '../ffi';

export default class Font {
	private pointer : Pointer;

	constructor(path: string, size: number) {
		const fp = libttf.symbols.TTF_OpenFont(Buffer.from(path+"\x00"), size);
		if (fp == null) throw `Font failed to be opened`;
		this.pointer = fp;
	}

	public destroy() {
		libttf.symbols.TTF_CloseFont(this.pointer);
	}
}
