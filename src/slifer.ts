import { libimage, libsdl, libttf } from "./ffi";
import Global from "./global";
import { ptr } from 'bun:ffi';

export class SliferClass {

    isRunning : boolean = true;

    constructor() {
        const baseInit = libsdl.symbols.SDL_Init(0x00000020);
        if (baseInit != 0) throw `SDL failed to initialize`;

        const imageInit = libimage.symbols.IMG_Init(3);
        if (imageInit != 3) throw `SDL Image failed to initialize`;

        const ttfInit = libttf.symbols.TTF_Init();
        if (ttfInit != 0) throw `SDL TTF failed to initialize`;
    }

    /**
     * 
     * @param title Title of window
     * @param width Width of window
     * @param height Height of window
     */
    createWindow(title: string, width: number, height: number) : void {
        // Creating cstring buffer from string
        const _title = Buffer.from(title + "\x00");


        // Creating window pointer
        const _win = libsdl.symbols.SDL_CreateWindow(_title, 0x2FFF0000, 0x2FFF0000, width, height, 0);
        if (_win == null) throw `Window creation failed`;
        Global.ptrWindow = _win;

        // Creating renderer pointer
        const _ren = libsdl.symbols.SDL_CreateRenderer(Global.ptrWindow, -1, 0);
        if (_ren == null) throw `Renderer Creation failed`;
        Global.ptrRenderer = _ren;
    }

    shouldClose() : boolean {

        // Clear the renderer
        libsdl.symbols.SDL_SetRenderDrawColor(Global.ptrRenderer, 34, 34, 34, 255);
        libsdl.symbols.SDL_RenderClear(Global.ptrRenderer);

        // Poll Events
        const eventArray = new Uint16Array(32);
        const isEvent = libsdl.symbols.SDL_PollEvent(ptr(eventArray));

        if (isEvent) {
            switch (eventArray[0]) {
                // Quit event
                case 256:
                    this.isRunning = false;
                    break;
                default:
                    console.log(eventArray);
                    break;
            }
        }

        return this.isRunning;
    }



}