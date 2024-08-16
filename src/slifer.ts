import { base } from "./external";
import Window from './core/window';
import Events from './core/events';
import Keyboard from './core/keyboard';
import { ptr } from 'bun:ffi';

class Slifer 
{
	public static gameWindow: Window | null = null;
	public static isRunning: boolean = false;

	// Classes for user to pull specific functions from
	public static Keyboard = Keyboard;

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
			(Events as any).handleEvents(eventArray);
		}

		return !this.isRunning;
	}
}

export default Slifer;
