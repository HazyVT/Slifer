import { base } from "./external";
import Window from './core/window';
import Events from './core/events';
import Keyboard from './core/keyboard';
import { ptr } from 'bun:ffi';

enum keys {
	K_a				= 97,
	K_b				= 98,
	K_c				= 99,
	K_d				= 100,
	K_e				= 101,
	K_f				= 102,
	K_g				= 103,
	K_h				= 104,
	K_i				= 105,
	K_j				= 106,
	K_k				= 107,
	K_l				= 108,
	K_m				= 109,
	K_n				= 110,
	K_o				= 111,
	K_p				= 112,
	K_q				= 113,
	K_r				= 114,
	K_s				= 115,
	K_t				= 116,
	K_u				= 117,
	K_v				= 118,
	K_w				= 119,
	K_x				= 120,
	K_y				= 121,
	K_z				= 122,
	K_BACKSPACE		= 8,
	K_TAB			= 9,
	K_CLEAR			= 12,
	K_RETURN			= 13,
	K_PAUSE			= 19,
	K_ESCAPE			= 27,
	K_SPACE			= 32,
	K_EXCLAIM		= 33,
	K_QUOTEDBL		= 34,
	K_HASH			= 35,
	K_DOLLAR			= 36,
	K_AMPERSAND		= 38,
	K_QUOTE			= 39,
	K_LEFTPAREN		= 40,
	K_RIGHTPAREN		= 41,
	K_ASTERISK		= 42,
	K_PLUS			= 43,
	K_COMMA			= 44,
	K_MINUS			= 45,
	K_PERIOD			= 46,
	K_SLASH			= 47,
	K_0				= 48,
	K_1				= 49,
	K_2				= 50,
	K_3				= 51,
	K_4				= 52,
	K_5				= 53,
	K_6				= 54,
	K_7				= 55,
	K_8				= 56,
	K_9				= 57,
	K_COLON			= 58,
	K_SEMICOLON		= 59,
	K_LESS			= 60,
	K_EQUALS			= 61,
	K_GREATER		= 62,
	K_QUESTION		= 63,
	K_AT				= 64,
}

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
