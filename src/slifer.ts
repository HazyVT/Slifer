import { libimage, libsdl, libttf } from "./ffi";
import { ptr } from 'bun:ffi';
import Math from "./modules/math";
import Vector2 from "./modules/vectors/vector2";
import Window from "./modules/window";
import Graphics from "./modules/graphics";
import Color from "./modules/color";

class SliferClass {
    // Modules
    public Math = new Math();
    public Graphics = new Graphics();


    // Classes
    public Vector2 = Vector2;
    public Color = Color;

    // Constants
    private readonly version = "0.0.3";

    // Engine Variables
    private isRunning = false;
    private hasBeenInitialized = false;
    private window: Window | null = null;

    public createWindow(title: string, width: number, height: number) : void {
        if (libsdl.symbols.SDL_Init(0x0000FFFF) != 0) {
            throw `Slifer failed to be initialized`;
        }

        if (libimage.symbols.IMG_Init(3) != 3) {
            throw `Slifer failed to be initialized`;
        }

        if (libttf.symbols.TTF_Init() != 0) {
            throw `Slifer failed to be initialized`;
        }

        this.isRunning = true;
        this.hasBeenInitialized = true;

        if (this.window == null) {
            this.window = new Window(title, width, height);
            (this.Graphics as any).renderer = (this.window as any).ptrRenderer;
        }
    }

    public shouldClose() : boolean {
        // Check if slifer has been initialized properly
        if (!this.hasBeenInitialized) {
            throw `Slifer has not been initialized`;
        };

        // Clear the renderer
        if (libsdl.symbols.SDL_RenderClear((this.window as any).ptrRenderer) != 0) throw `Clear failed`;


        const eventArray = new Uint16Array(32);
        const isEvent = libsdl.symbols.SDL_PollEvent(ptr(eventArray));

        if (isEvent) {
            switch (eventArray[0]) {
                case 256:
                    this.isRunning = false;
                    break;
            }
        }

        return !this.isRunning;
    }

    public getVersion() : string {
        const versionString  = "Slifer v" + this.version;
        return versionString;
    }
}

export default SliferClass;