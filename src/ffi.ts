import { dlopen, FFIType, suffix } from 'bun:ffi';

const libSDLImport = await import(`../libs/libSDL2.${suffix}`);
const libImageImport = await import(`../libs/libSDL2_image.${suffix}`);
const libTTFImport = await import(`../libs/libSDL2_ttf.${suffix}`);

export const libsdl = dlopen(libSDLImport.default, {
    SDL_Init: {
        args: [FFIType.int],
        returns: FFIType.int
    },
    SDL_GetRevision: {
        returns: 'cstring'
    },
    SDL_CreateWindow: {
        args: ['cstring', 'int', 'int', 'int', 'int', 'u32'],
        returns: 'pointer'
    },
    SDL_CreateRenderer: {
        args: ['pointer', 'int', 'u32'],
        returns: 'pointer'
    },
    SDL_GetDesktopDisplayMode: {
        args: ['int', 'pointer'],
        returns: 'int'
    },
    SDL_GetDisplayOrientation: {
        args: ['int'],
        returns: 'int'
    },
    SDL_SetWindowFullscreen: {
        args: ['pointer', 'u32'],
        returns: 'int'
    },
    SDL_PollEvent: {
        args: ['pointer'],
        returns: 'int'
    },
    SDL_RenderClear: {
        args: ['pointer'],
        returns: 'int'
    },
    SDL_RenderCopy: {
        args: ['pointer', 'pointer', 'pointer', 'pointer'],
        returns: 'int'
    },
    SDL_RenderPresent: {
        args: ['pointer'],
        returns: 'void'
    }
})

export const libimage = dlopen(libImageImport.default, {
    IMG_Init: {
        args: ['int'],
        returns: 'int'
    }
})

export const libttf = dlopen(libTTFImport.default, {
    TTF_Init: {
        returns: 'int'
    }
})