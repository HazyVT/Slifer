import { libsdl } from "./ffi";
import Math from "./modules/math";
import Vector2 from "./modules/vectors/vector2";

class SliferClass {

    // Modules
    public Math = new Math();
    public Vector2 = Vector2;

    // Constants
    private readonly version = "0.0.1";

    public init() : boolean {
        if (libsdl.symbols.SDL_Init(0x0000FFFF) != 0) {
            return false;
        }

        return true;
    }

    public getVersion() : string {
        const versionString  = "Slifer v" + this.version;
        return versionString;
    }
}

export default SliferClass;