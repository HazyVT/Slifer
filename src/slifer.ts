import { libsdl } from "./ffi";
import Graphics from "./modules/graphics";
import Keyboard from "./modules/keyboard";
import Mouse from "./modules/mouse";
import Audio from "./modules/audio";
import Window from "./engine/window";
import Renderer from "./engine/renderer";
import Vector2 from "./engine/vector";
import Time from "./engine/time";
import { ptr } from "bun:ffi";
import { initLibraries } from "./engine";
import { version } from "../package.json";

/** @interal */
export class SliferClass {
    // Modules
    Graphics = Graphics.instance;
    Keyboard = Keyboard.instance;
    Mouse = Mouse.instance;
    Audio = Audio.instance;

    // Public Variables
    public dt: number = 0;
    public isRunning: boolean = true;

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

        // Return the window object
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
                    var scancode = eventArray[8];
                    Keyboard.setKeyDown(scancode);
                    break;
                // Keyup event
                case 769:
                    var scancode = eventArray[8];
                    Keyboard.setKeyUp(scancode);
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
