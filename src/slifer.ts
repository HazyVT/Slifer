import { libsdl } from "./ffi";
import Math from "./modules/math";

class SliferClass
{

    // Modules
    public Math = new Math();

    public init() : boolean {
        if (libsdl.symbols.SDL_Init(0x0000FFFF) != 0)
        {
            return false;
        }

        return true;
    }
}

export default SliferClass;