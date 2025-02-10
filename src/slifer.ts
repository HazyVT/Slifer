import { libsdl } from "./ffi";
import Window from "./engine/window";
import Renderer from "./engine/render";
import { ptr } from "bun:ffi";
import { initLibraries } from "./engine";
import { version } from "../package.json";
import type Vector2 from "./engine/vector2";
import Graphics from "./modules/graphics";
import Keyboard from "./modules/keyboard";
import Mouse from "./modules/mouse";
import Render from "./engine/render";

class Slifer {
    
    public isRunning: boolean;

    // Modules
    public Graphics = new Graphics();
    public Keyboard = new Keyboard();
    public Mouse = new Mouse();

    constructor() {
        initLibraries();
        this.isRunning = true;
    }

    public createWindow(title: string, size: Vector2) : Window {
        Window.createWindow(title, size);
        Renderer.createRenderer();

        return new Window();
    }

    public shouldClose() : boolean {

        libsdl.symbols.SDL_RenderClear(Render.pointer);

        const eventArray = new Uint16Array(32);
        const event = libsdl.symbols.SDL_PollEvent(ptr(eventArray));
        if (event) {
            switch (eventArray[0]) {
                case 256:
                    this.isRunning = false;
                    break;
                case 1026:
                    Mouse.onRelease(eventArray[8]);
                    break;
            }
        }

        Keyboard.handleStates();

        Mouse.handleState();
        
        
        return !this.isRunning;
    }

    public getVersion() : string {
        return 'v' + version;
    }
}


export default Slifer;
