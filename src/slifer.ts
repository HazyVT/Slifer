import { Renderer, Window } from "./engine.ts";
import { closeBase, closeImage, sdl, image } from './ffi.ts';
import Graphics from "./modules/graphics.ts";
import Keyboard from "./modules/keyboard.ts";
import Mouse from "./modules/mouse.ts";
import json from '../deno.json' with {type: 'json'}
import Math from "./modules/math.ts";

/** @internal */
class Slifer {

	public isRunning: boolean = true;
	public deltaTime : number = 0;
	
	public Keyboard : Keyboard = new Keyboard();
	public Mouse : Mouse = new Mouse();
	public Graphics : Graphics = new Graphics();
	public Math : Math = new Math();
	
	private encoder = new TextEncoder();
	private start!: bigint;
	private end!: bigint;

	constructor() {
		const sdlInit = sdl.SDL_Init(32);
		if (sdlInit != 0) throw `SDL Init Failed`;

		//console.log("SDL Init Success");

		const imgInit = image.IMG_Init(2);
		if (imgInit != 2) throw `SDL Image Init Failed`;

		//console.log("SDL Image Init Success");


		//sdl.SDL_SetHint(this.encoder.encode("SDL_HINT_RENDER_SCALE_QUALITY\x00"), this.encoder.encode("0\x00"));
		
	}

	public createWindow(title: string, width: number, height: number) : Window {
		const titleArray = this.encoder.encode(title+"\x00");
		const winPointer = sdl.SDL_CreateWindow(titleArray, 0x2FFF0000, 0x2FFF0000, width, height, 0);
		if (winPointer == null) throw `Window Creation Failed`;

		Window.pointer = winPointer;

		const renPointer = sdl.SDL_CreateRenderer(winPointer, -1, 0);
		if (renPointer == null) throw `Renderer Creation Failed`;

		Renderer.pointer = renPointer;

		this.start = sdl.SDL_GetTicks64();

		return new Window(width, height);
	}

	public shouldClose() : boolean {
		// Set background color
		sdl.SDL_SetRenderDrawColor(
			Renderer.pointer, 
			Graphics.backgroundColor.red,
			Graphics.backgroundColor.green,
			Graphics.backgroundColor.blue,
			Graphics.backgroundColor.alpha
		);
		
		// Clear renderer
		sdl.SDL_RenderClear(Renderer.pointer);

		// Handle events
		const eventArray = new Uint16Array(32);
		const event = Deno.UnsafePointer.of(eventArray);

		// Handle keyboard
		Keyboard.handleKeyStates();

		// Handle mouse
		Mouse.handleMouseState();
		

		if (sdl.SDL_PollEvent(event) == 1) {

			const view = new Deno.UnsafePointerView(event!);
			const type = view.getUint16();

			if (type == 256) {
				this.isRunning = false;
			}
		}

		this.end = sdl.SDL_GetTicks64();
		this.deltaTime = (Number(this.end) - Number(this.start)) / 1000;
		this.start = this.end;

		return !this.isRunning;
	}

	public getVersion() : string {
		return `v${json.version}`
	}

	public quit() : void {
		sdl.SDL_DestroyRenderer(Renderer.pointer);
		sdl.SDL_DestroyWindow(Window.pointer);
		closeBase();
		closeImage();
	}
}

export default Slifer;
