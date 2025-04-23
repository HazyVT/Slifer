import { Renderer, Window } from "./engine.ts";
import { closebase, sdl } from './ffi.ts';

enum Event {
    first = 0,
    quit = 0x100,
    keyDown = 0x300,
    keyUp,
    mouseMotion = 0x400,
    mouseButtonDown,
    mouseButtonUp
}

class Slifer {

	public isRunning: boolean = true;
	
	private encoder = new TextEncoder();

	constructor() {
		const sdlInit = sdl.SDL_Init(32);
		if (sdlInit != 0) throw `SDL Init failed`;

		console.log("SDL Init Success");
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
		const eventArray = new Uint16Array(32);
		const event = Deno.UnsafePointer.of(eventArray);
		if (sdl.SDL_PollEvent(event) == 1) {

			const view = new Deno.UnsafePointerView(event!);
			const type = view.getUint16();

			switch (type) {
				case Event.quit:
					this.isRunning = false;
					break;
				default:
					break;
			}

		}
		return !this.isRunning;
	}

	public quit() : void {
		closebase();
	}
}

export default Slifer;
