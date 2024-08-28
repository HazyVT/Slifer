import { libsdl } from "./ffi";
import InitError from "./modules/errors/initError";
import Math from "./modules/math";
import Vector2 from "./modules/vectors/vector2";

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

    public init() : void {
        if (libsdl.symbols.SDL_Init(0x0000FFFF) != 0) {
            console.error(new InitError("Slifer failed to be initialized").toString());
            return;
        }

        this.isRunning = true;
        this.hasBeenInitialized = true;
    }

    public shouldClose() : boolean {
        if (!this.hasBeenInitialized) {console.error(new InitError("Slifer has not been initialized").toString()); return true};
        return !this.isRunning;
    }

    public getVersion() : string {
        const versionString  = "Slifer v" + this.version;
        return versionString;
    }
}

export default SliferClass;