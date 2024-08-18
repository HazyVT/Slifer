import { base } from "./external";
import Window from './core/window';
import Events from './core/events';
import Keyboard from './core/keyboard';
import { ptr } from 'bun:ffi';
import keys from "./core/keys";

class SliferClass
{
	public gameWindow: Window | null = null;
	public isRunning: boolean = false;

	// Classes for user to pull specific functions from
	public Keyboard = Keyboard;

	// Variables to take from
	public keys = keys;

	public initialize(title: string, width: number, height: number) : Window 
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

	public shouldQuit() : boolean
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

export default SliferClass;
