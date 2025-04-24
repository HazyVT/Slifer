import { Renderer, Window } from "./engine.ts";
import { closeBase, closeImage, sdl, image } from './ffi.ts';
import Graphics from "./modules/graphics.ts";
import Keyboard from "./modules/keyboard.ts";
import Mouse from "./modules/mouse.ts";

/** @internal */
class Slifer {

	public isRunning: boolean = true;
	
	public Keyboard = new Keyboard();
	public Mouse = new Mouse();
	public Graphics = new Graphics();
	
	private encoder = new TextEncoder();

	constructor() {
		const sdlInit = sdl.SDL_Init(32);
		if (sdlInit != 0) throw `SDL Init Failed`;

		console.log("SDL Init Success");

		const imgInit = image.IMG_Init(2);
		if (imgInit != 2) throw `SDL Image Init Failed`;

		console.log("SDL Image Init Success");


		//sdl.SDL_SetHint(this.encoder.encode("SDL_HINT_RENDER_SCALE_QUALITY\x00"), this.encoder.encode("0\x00"));
	}

	public createWindow(title: string, width: number, height: number) {
		const titleArray = this.encoder.encode(title+"\x00");
		const winPointer = sdl.SDL_CreateWindow(titleArray, 0x2FFF0000, 0x2FFF0000, width, height, 0);
		if (winPointer == null) throw `Window Creation Failed`;

		Window.pointer = winPointer;

		const renPointer = sdl.SDL_CreateRenderer(winPointer, -1, 0);
		if (renPointer == null) throw `Renderer Creation Failed`;

		Renderer.pointer = renPointer;
		
		return new Window();
	}

	public shouldClose() : boolean {
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

		return !this.isRunning;
	}

	public quit() : void {
		closeBase();
		closeImage();
	}
}

export default Slifer;
