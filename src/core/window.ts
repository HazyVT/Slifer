import { type Pointer } from 'bun:ffi';
import { base } from '../external';

class Window 
{
	private windowPointer: Pointer | null = null;

	constructor(title: string, width: number, height: number)
	{

		/**
		* Creating the game window
		*/
		this.windowPointer = base.symbols.SDL_CreateWindow(
			Buffer.from(title+"\x00"),
			0x2FFF0000,
			0x2FFF0000,
			width,
			height,
			0
		);

		if (this.windowPointer == null)
		{
			throw new Error("Slifer: Window failed to be created");
		}
	}
}

export default Window;
