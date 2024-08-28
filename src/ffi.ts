import { dlopen, FFIType } from 'bun:ffi';

//@ts-expect-error
import libSDLImport from '../libs/libSDL2.dylib';

export const libsdl = dlopen(libSDLImport, {
    SDL_Init: {
        args: [FFIType.int],
        returns: FFIType.int
    }
})