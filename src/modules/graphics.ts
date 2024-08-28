import type { Pointer } from "bun:ffi";
import { libsdl, libttf } from "../ffi";

class Graphics {

    private renderer!: Pointer;

    loadFont(path: string, pt: number) : Font {
        const ft = libttf.symbols.TTF_OpenFont(Buffer.from(path+"\x00"), pt);
        if (ft == null) {
            throw `Font failed to load`;
        }

        return ft;
    }

    flip() : void {
        libsdl.symbols.SDL_RenderPresent(this.renderer);
    }
}

type Font = Pointer;

export default Graphics;