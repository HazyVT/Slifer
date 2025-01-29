import { libimage, libsdl, libttf } from "./ffi";
import Graphics from "./modules/graphics";
import Keyboard from "./modules/keyboard";
import Mouse from "./modules/mouse";
import Window from "./engine/window";
import Renderer from "./engine/renderer";
import Vector2 from "./engine/vector";
import Time from "./engine/time";
import { ptr } from "bun:ffi";
import { initLibraries } from "./engine";
import { version } from "../package.json";

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
    createWindow(title: string, size: Vector2): Window {
        // Create the window
        const window = Window.instance;
        Window.createWindow(title, size);

        // Create the renderer
        Renderer.createRenderer();

        // Start delta time calculations
        Time.instance.init();

        return window;
    }

    /**
     * @returns if the window should close
     */
    shouldClose(): boolean {
        // Clear the renderer
        Renderer.clear();

        // Calculate delta time
        this.dt = Time.instance.calcDelta();

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
        libsdl.symbols.SDL_DestroyRenderer(Renderer.pointer);
        libsdl.symbols.SDL_DestroyWindow(Window.pointer);
        libsdl.symbols.SDL_Quit();
    }

    getVersion() {
        return version;
    }
}
