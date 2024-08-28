import { dlopen, FFIType, suffix } from 'bun:ffi';

const libSDLImport = await import(`../libs/libSDL2.${suffix}`);

export const libsdl = dlopen(libSDLImport.default, {
    SDL_Init: {
        args: [FFIType.int],
        returns: FFIType.int
    },
    SDL_GetRevision: {
        returns: 'cstring'
    },
    SDL_GetVersion: {
        returns: 'int'
    }
})