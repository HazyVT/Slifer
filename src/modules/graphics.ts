import type { Pointer } from "bun:ffi";
import { libsdl } from "../ffi";

class Graphics {

    private renderer!: Pointer;
    
    flip() {
        libsdl.symbols.SDL_RenderPresent(this.renderer);
    }
}

export default Graphics;