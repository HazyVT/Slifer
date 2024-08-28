import { libimage, libsdl } from "./ffi";
import InitError from "./modules/errors/initError";
import Math from "./modules/math";
import Vector2 from "./modules/vectors/vector2";
import Window from "./modules/window";

class SliferClass {

    // Modules
    public Math = new Math();

    // Classes
    public Vector2 = Vector2;

    // Constants
    private readonly version = "0.0.2";

    // Engine Variables
    private isRunning = false;
    private hasBeenInitialized = false;
    private window: Window | null = null;

    public createWindow(title: string, width: number, height: number) : Window {
        if (libsdl.symbols.SDL_Init(0x0000FFFF) != 0) {
            throw `Slifer failed to be initialized`;
        }

        if (libimage.symbols.IMG_Init(3) != 3) {
            throw `Slifer failed to be initialized`;
        }

        this.isRunning = true;
        this.hasBeenInitialized = true;

        if (this.window == null) {
            this.window = new Window(title, width, height);
        }

        return this.window;
    }

    public shouldClose() : boolean {
        if (!this.hasBeenInitialized) {
            throw `Slifer has not been initialized`;
        };
        return !this.isRunning;
    }

    public getVersion() : string {
        const versionString  = "Slifer v" + this.version;
        return versionString;
    }
}

export default SliferClass;