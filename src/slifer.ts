import { libsdl } from "./ffi";
import Window from "./engine/window";
import { ptr } from "bun:ffi";
import { initLibraries } from "./engine";
import { version } from "../package.json";
import type Vector2 from "./engine/vector2";
import Graphics from "./modules/graphics";
import Keyboard from "./modules/keyboard";
import Mouse from "./modules/mouse";
import Render from "./engine/render";
import Color from './engine/color';
import Cursor from './engine/cursor';

class Slifer {
    public isRunning: boolean;
	public deltaTime: number;

    // Modules
    public Graphics = new Graphics();
    public Keyboard = new Keyboard();
    public Mouse = new Mouse();

    private start = 0;
    private end = 0;
    private black : Color;

    constructor() {
        initLibraries();
        this.isRunning = true;
        this.deltaTime = 0;
		this.black = new Color(0,0,0,0);
    }

    public createWindow(title: string, width: number, height: number): Window {
        Window.createWindow(title, width, height);
        Render.createRenderer(width, height);

        this.start = Number(libsdl.symbols.SDL_GetTicks64());

        return new Window();
    }

    public setCursor(cursor: Cursor) {
    	libsdl.symbols.SDL_SetCursor((cursor as any).pointer);
    }

    public shouldClose(): boolean {
        libsdl.symbols.SDL_SetRenderDrawColor(Render.pointer, this.black.r, this.black.g, this.black.b, this.black.a);
        libsdl.symbols.SDL_RenderClear(Render.pointer);
		
        const eventArray = new Uint16Array(32);
        const event = libsdl.symbols.SDL_PollEvent(ptr(eventArray));
        if (event) {
            switch (eventArray[0]) {
                case 256:
                    this.isRunning = false;
                    break;
                case 1024:
                    Mouse.onMove(eventArray[10], eventArray[12]);
                    break;
                case 1026:
                    Mouse.onRelease(eventArray[8]);
                    break;
            }
        }


        Keyboard.handleStates();

        Mouse.handleState();

        this.end = Number(libsdl.symbols.SDL_GetTicks64());

		this.deltaTime = (this.end - this.start) / 1000;

        this.start = this.end;

        return !this.isRunning;
    }

    public getVersion(): string {
        return "v" + version;
    }

    public quit(): void {
        libsdl.symbols.SDL_DestroyRenderer(Render.pointer);
        libsdl.symbols.SDL_DestroyWindow(Window.pointer);
        libsdl.symbols.SDL_Quit();
    }
}

export default Slifer;
