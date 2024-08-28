import { dlopen, FFIType, suffix } from 'bun:ffi';

let libSDLImport;
let libImageImport;
let libTTFImport;

if (process.platform == "win32") {
    //@ts-expect-error
    libSDLImport = await import("../libs/libSDL2.dll");
    //@ts-expect-error
    libImageImport = await import("../libs/libSDL2_image.dll");
    //@ts-expect-error
    libTTFImport = await import("../libs/libSDL2_ttf.dll");
} else if (process.platform == "darwin") {
    //@ts-expect-error
    libSDLImport = await import("../libs/libSDL2.dylib");
    //@ts-expect-error
    libImageImport = await import("../libs/libSDL2_image.dylib");
    //@ts-expect-error
    libTTFImport = await import("../libs/libSDL2_ttf.dylib");
}

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
    },
    SDL_CreateTextureFromSurface: {
        args: ['pointer', 'pointer'],
        returns: 'pointer'
    },
    SDL_DestroyRenderer: {
        args: ['pointer'],
        returns: 'void'
    },
    SDL_DestroyWindow: {
        args: ['pointer'],
        returns: 'void'
    },
    SDL_Quit: {
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
    },
    TTF_OpenFont: {
        args: ['cstring', 'int'],
        returns: 'pointer'
    },
    TTF_RenderText_Solid: {
        args: ['pointer', 'cstring', 'u32'],
        returns: 'pointer'
    },
    TTF_SizeText: {
        args: ['pointer', 'cstring', 'pointer', 'pointer'],
        returns: 'int'
    },
    TTF_Quit: {
        returns: 'void'
    }
})