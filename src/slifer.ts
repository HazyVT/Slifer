import { libimage, libsdl, libttf } from "./ffi";
import { initLibraries } from "./engine";
import Global from "./global";
import { ptr } from "bun:ffi";
import Graphics from "./modules/graphics";
import Keyboard from "./modules/keyboard";
import Mouse from "./modules/mouse";
import { version } from "../package.json";

/** @internal */
class Window {
    public width: number;
    public height: number;
    public title: string;

    constructor(title: string, width: number, height: number) {
        this.width = width;
        this.height = height;
        this.title = title;
    }

    setSize(width: number, height: number): void {
        libsdl.symbols.SDL_SetWindowSize(Global.ptrWindow, width, height);
    }

    setTitle(title: string): void {
        libsdl.symbols.SDL_SetWindowTitle(
            Global.ptrWindow,
            Buffer.from(title + "\x00")
        );
    }

    setFullscreen(flag: boolean): void {
        libsdl.symbols.SDL_SetWindowFullscreen(Global.ptrWindow, Number(flag));
    }

    centerWindow(): void {
        libsdl.symbols.SDL_SetWindowPosition(
            Global.ptrWindow,
            0x2fff0000,
            0x2fff0000
        );
    }

    setPosition(x: number, y: number): void {
        libsdl.symbols.SDL_SetWindowPosition(Global.ptrWindow, x, y);
    }
}

/** @interal */
export class SliferClass {
    public isRunning: boolean = true;
    private lastFrame: number = 0;
    private firstFrame: number = 0;

    // Modules
    Graphics = new Graphics();
    Keyboard = new Keyboard();
    Mouse = new Mouse();

    // Public Variables
    public dt: number = 0;

    constructor() {
        initLibraries();
    }

    /**
     * @param title Title of window
     * @param width Width of window
     * @param height Height of window
     */
    createWindow(title: string, width: number, height: number): Window {
        // Creating cstring buffer from string
        const _title = Buffer.from(title + "\x00");

        // Creating window pointer
        const _win = libsdl.symbols.SDL_CreateWindow(
            _title,
            0x2fff0000,
            0x2fff0000,
            width,
            height,
            0
        );
        if (_win == null) throw `Window creation failed`;
        Global.ptrWindow = _win;

        // Creating renderer pointer
        const vsyncHint = 0x00000004;
        const _ren = libsdl.symbols.SDL_CreateRenderer(
            Global.ptrWindow,
            -1,
            vsyncHint
        );
        if (_ren == null) throw `Renderer Creation failed`;
        Global.ptrRenderer = _ren;

        this.firstFrame = Number(libsdl.symbols.SDL_GetPerformanceCounter());

        return new Window(title, width, height);
    }

    /**
     * @returns if the window should close
     */
    shouldClose(): boolean {
        // Clear the renderer
        libsdl.symbols.SDL_RenderClear(Global.ptrRenderer);

        // Setup deltatime
        this.lastFrame = this.firstFrame;
        this.firstFrame = Number(libsdl.symbols.SDL_GetPerformanceCounter());

        this.dt =
            ((this.firstFrame - this.lastFrame) * 1000) /
            Number(libsdl.symbols.SDL_GetPerformanceFrequency());

        // Poll Events
        const eventArray = new Uint16Array(32);
        const isEvent = libsdl.symbols.SDL_PollEvent(ptr(eventArray));

        if (isEvent) {
            switch (eventArray[0]) {
                // Quit event
                case 256:
                    this.isRunning = false;
                    break;
                // Keydown event
                case 768:
                    const _dscancode = eventArray[8];
                    const _dkey =
                        libsdl.symbols.SDL_GetKeyFromScancode(_dscancode);
                    const _dname = libsdl.symbols.SDL_GetKeyName(_dkey);
                    Keyboard.setKeyDown(_dname.toString().toLowerCase());
                    break;
                // Keyup event
                case 769:
                    const _uscancode = eventArray[8];
                    const _ukey =
                        libsdl.symbols.SDL_GetKeyFromScancode(_uscancode);
                    const _uname = libsdl.symbols.SDL_GetKeyName(_ukey);
                    Keyboard.setKeyUp(_uname.toString().toLowerCase());
                    break;
                // Mouse down event
                case 1025:
                    const _dbtn = eventArray[8] - 256;
                    Mouse.setButtonDown(_dbtn);
                    break;
                // Mouse up event
                case 1026:
                    const _ubtn = eventArray[8];
                    Mouse.setButtonUp(_ubtn);
                    break;
            }
        }

        return !this.isRunning;
    }

    /**
     * Slifers quit method
     */
    quit() {
        libttf.symbols.TTF_CloseFont(Global.ptrFont);
        libsdl.symbols.SDL_DestroyRenderer(Global.ptrRenderer);
        libsdl.symbols.SDL_DestroyWindow(Global.ptrWindow);
        libsdl.symbols.SDL_Quit();
    }

    getVersion() {
        return version;
    }
}
