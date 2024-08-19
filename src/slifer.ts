import { base, image } from "./external";
import Window from './core/window';
import Keyboard from './core/keyboard';
import Mouse from './core/mouse';
import { ptr } from 'bun:ffi';
import keys from "./core/keys";
import buttons from "./core/buttons";
import Graphics from './core/graphics';

class SliferClass
{
	public gameWindow: Window | null = null;
	public isRunning: boolean = false;

	// Classes for user to pull specific functions from
	public Keyboard = Keyboard;
	public Mouse = Mouse;
	public Graphics = Graphics;

	// Variables to take from
	public keys = keys;
	public buttons = buttons;

	public initialize(title: string, width: number, height: number) : Window 
	{
		// Initialize SDL
		const init = base.symbols.SDL_Init(48);

		if (init != 0)
		{
			throw new Error("Slifer: Initialization failed");
		}

		// Initialize image library
		const img = image.symbols.IMG_Init(3);
		if (img != 3)
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
			switch (eventArray[0])
			{
				case 256:
					// Quit Event
					this.isRunning = false;
					break;
				case 771:
					// Keydown event
					(this.Keyboard as any).setKeyDown(eventArray[6]);
					break;
				case 769:
					// Keyup event;
					(this.Keyboard as any).setKeyUp(eventArray[10]);
					break;
				case 1025:
					//console.log("Key Down");
					const button = eventArray[8] - 256;
					(this.Mouse as any).setButtonDown(button);
					break;
				case 1026:
					(this.Mouse as any).setButtonUp(eventArray[8]);
					break;
				default:
					//console.log(eventArray);
					break;
			}
		}

		return !this.isRunning;
	}
}

export default SliferClass;
