import { libimage, libsdl, libttf } from "./ffi";
import { ptr } from 'bun:ffi';
import Math from "./modules/math";
import Vector2 from "./modules/vectors/vector2";
import Window from "./modules/window";
import Graphics from "./modules/graphics";
import Color from "./modules/color";
import Keyboard from "./modules/keyboard";

class SliferClass {

    // Modules
    public Math = new Math();
    public Graphics = new Graphics();
    public Keyboard = new Keyboard();

    // Classes
    public Vector2 = Vector2;
    public Color = Color;

    // Constants
    private readonly version = "0.0.4";

    // Engine Variables
    public isRunning = false;
    private hasBeenInitialized = false;
    private window: Window | null = null;
    private timerNow = 0;
    private timerLast = 0;
    public deltaTime = 0;

    /**
     * Initializes Slifer and creates a window
     * 
     * @param title default title of window
     * @param width default width of window
     * @param height default height of window
     */
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
            (this.Graphics as any).windowWidth = this.window.getWidth();
            (this.Graphics as any).windowHeight = this.window.getHeight();
        }

        this.timerNow = Number(libsdl.symbols.SDL_GetPerformanceCounter());
        this.timerLast = 0;
    }

    /**
     * Method to get if slifer should be closing. Always use in while loop
     * 
     * @returns whether Slifer should close
     */
    public shouldClose() : boolean {
        // Check if slifer has been initialized properly
        if (!this.hasBeenInitialized) {
            throw `Slifer has not been initialized`;
        };

        // Clear the renderer
        if (libsdl.symbols.SDL_RenderClear((this.window as any).ptrRenderer) != 0) throw `Clear failed`;

        // Get delta time
        this.timerLast = this.timerNow;
        this.timerNow = Number(libsdl.symbols.SDL_GetPerformanceCounter());

        this.deltaTime = ((this.timerNow - this.timerLast) / Number(libsdl.symbols.SDL_GetPerformanceFrequency()));

        const eventArray = new Uint16Array(32);
        const isEvent = libsdl.symbols.SDL_PollEvent(ptr(eventArray));

        if (isEvent) {
            switch (eventArray[0]) {
                case 256:
                    this.isRunning = false;
                    break;
                case 768:
                    (this.Keyboard as any).setKeyDown(eventArray[8]);
                    break;
                case 769:
                    (this.Keyboard as any).setKeyUp(eventArray[8]);
                    break;
            }
        }

        return !this.isRunning;
    }

    /**
     * 
     * @returns Installed version of Slifer
     */
    public getVersion() : string {
        const versionString  = "Slifer v" + this.version;
        return versionString;
    }

    /**
     * Quit method for Slifer
     */
    public quit() : void {
        libsdl.symbols.SDL_DestroyRenderer((this.window as any).ptrRenderer);
        libsdl.symbols.SDL_DestroyWindow((this.window as any).ptrWindow);
        libttf.symbols.TTF_Quit();
        libsdl.symbols.SDL_Quit();
    }
}

export default SliferClass;