import { base } from "./external";
import Window from './core/window';
import { ptr } from 'bun:ffi';

class Slifer 
{
	public static gameWindow: Window | null = null;
	public static isRunning: boolean = false;

	public static initialize(title: string, width: number, height: number) : Window 
	{

		// Initialize SDL
		const init = base.symbols.SDL_Init(48);

		if (init != 0)
		{
			throw new Error("Slifer: Initialization failed");
		}

		// Create the game window
		// Initialize as a singleton
		if (this.gameWindow == null)
		{
			this.gameWindow = new Window(title, width, height);		
		}

		this.isRunning = true;
		return this.gameWindow;
	}

	public static shouldQuit() : boolean
	{
		const eventArray = new Uint16Array(32);
		const isEvent = base.symbols.SDL_PollEvent(ptr(eventArray));

		if (isEvent)
		{
			this.handleEvents(eventArray);
		}

		return !this.isRunning;
	}

	private static handleEvents(array: Uint16Array)
	{
		switch (array[0])
		{
			case 256:
				this.isRunning = false;
				break;
				
		}
	}

}

export default Slifer;
