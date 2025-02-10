import { dlopen, FFIType, suffix } from "bun:ffi";

let libSDLImport;
let libImageImport;
let libTTFImport;
let libMixerImport;

if (process.platform == "win32") {
    //@ts-expect-error
    libSDLImport = await import("../libs/libSDL2.dll");
    //@ts-expect-error
    libImageImport = await import("../libs/libSDL2_image.dll");
    //@ts-expect-error
    libTTFImport = await import("../libs/libSDL2_ttf.dll");
    //@ts-expect-error
    libMixerImport = await import("../libs/libSDL2_mixer.dll");
} else if (process.platform == "darwin") {
    //@ts-expect-error
    libSDLImport = await import("../libs/libSDL2.dylib");
    //@ts-expect-error
    libImageImport = await import("../libs/libSDL2_image.dylib");
    //@ts-expect-error
    libTTFImport = await import("../libs/libSDL2_ttf.dylib");
    //@ts-expect-error
    libMixerImport = await import("../libs/libSDL2_mixer.dylib");
} else if (process.platform == "linux") {
    //@ts-expect-error
    libSDLImport = await import("../libs/libSDL2.so");
    //@ts-expect-error
    libImageImport = await import("../libs/libSDL2_image.so");
    //@ts-expect-error
    libTTFImport = await import("../libs/libSDL2_ttf.so");
    //@ts-expect-error
    libMixerImport = await import("../libs/libSDL2_mixer.so");
}

/** @internal */
export const libsdl = dlopen(libSDLImport.default, {
    SDL_Init: {
        args: [FFIType.int],
        returns: FFIType.int,
    },
    SDL_GetRevision: {
        returns: "cstring",
    },
    SDL_CreateWindow: {
        args: ["cstring", "int", "int", "int", "int", "u32"],
        returns: "pointer",
    },
    SDL_CreateRenderer: {
        args: ["pointer", "int", "u32"],
        returns: "pointer",
    },
    SDL_GetDesktopDisplayMode: {
        args: ["int", "pointer"],
        returns: "int",
    },
    SDL_GetDisplayOrientation: {
        args: ["int"],
        returns: "int",
    },
    SDL_SetWindowFullscreen: {
        args: ["pointer", "u32"],
        returns: "int",
    },
    SDL_PollEvent: {
        args: ["pointer"],
        returns: "int",
    },
    SDL_RenderClear: {
        args: ["pointer"],
        returns: "int",
    },
    SDL_RenderCopy: {
        args: ["pointer", "pointer", "pointer", "pointer"],
        returns: "int",
    },
    SDL_RenderPresent: {
        args: ["pointer"],
        returns: "void",
    },
    SDL_CreateTextureFromSurface: {
        args: ["pointer", "pointer"],
        returns: "pointer",
    },
    SDL_DestroyRenderer: {
        args: ["pointer"],
        returns: "void",
    },
    SDL_DestroyWindow: {
        args: ["pointer"],
        returns: "void",
    },
    SDL_Quit: {
        returns: "void",
    },
    SDL_GetKeyName: {
        args: ["int"],
        returns: "cstring",
    },
    SDL_GetKeyFromScancode: {
        args: ["int"],
        returns: "int",
    },
    SDL_GetPerformanceCounter: {
        returns: "u64",
    },
    SDL_GetPerformanceFrequency: {
        returns: "u64",
    },
    SDL_QueryTexture: {
        args: ["pointer", "pointer", "pointer", "pointer", "pointer"],
        returns: "int",
    },
    SDL_GetMouseState: {
        args: ["pointer", "pointer"],
        returns: "u32",
    },
    SDL_CreateColorCursor: {
        args: ["pointer", "int", "int"],
        returns: "pointer",
    },
    SDL_SetCursor: {
        args: ["pointer"],
        returns: "void",
    },
    SDL_SetRenderDrawColor: {
        args: ["pointer", "int", "int", "int", "int"],
        returns: "void",
    },
    SDL_RenderFillRect: {
        args: ["pointer", "pointer"],
        returns: "bool",
    },
    SDL_GetWindowPosition: {
        args: ["pointer", "pointer", "pointer"],
        returns: "void",
    },
    SDL_SetWindowPosition: {
        args: ["pointer", "int", "int"],
        returns: "void",
    },
    SDL_SetWindowHitTest: {
        args: ["pointer", FFIType.function, "pointer"],
        returns: "int",
    },
    SDL_GetWindowSize: {
        args: ["pointer", "pointer", "pointer"],
        returns: "void",
    },
    SDL_CreateSystemCursor: {
        args: ["int"],
        returns: "pointer",
    },
    SDL_GetError: {
        returns: "cstring",
    },
    SDL_SetHint: {
        args: ["cstring", "cstring"],
        returns: "bool",
    },
    SDL_MinimizeWindow: {
        args: ["pointer"],
        returns: "void",
    },
    SDL_MaximizeWindow: {
        args: ["pointer"],
        returns: "void",
    },
    SDL_GetShapedWindowMode: {
        args: ["pointer", "pointer"],
        returns: "int",
    },
    SDL_CreateShapedWindow: {
        args: ["cstring", "int", "int", "int", "int", "u32"],
        returns: "pointer",
    },
    SDL_SetWindowShape: {
        args: ["pointer", "pointer", "pointer"],
        returns: "int",
    },
    SDL_SetWindowIcon: {
        args: ["pointer", "pointer"],
        returns: "void",
    },
    SDL_RaiseWindow: {
        args: ["pointer"],
        returns: "void",
    },
    SDL_RenderCopyEx: {
        args: [
            "pointer",
            "pointer",
            "pointer",
            "pointer",
            "double",
            "pointer",
            "int",
        ],
        returns: "int",
    },
    SDL_SetWindowSize: {
        args: ["pointer", "int", "int"],
        returns: "void",
    },
    SDL_SetWindowTitle: {
        args: ["pointer", "cstring"],
        returns: "void",
    },
    SDL_GetTicks: {
        returns: "uint32_t",
    },
    SDL_Delay: {
        args: ["uint32_t"],
    },
    SDL_GetKeyboardState: {
        args: ["pointer"],
        returns: "pointer",
    },
    SDL_GetScancodeFromName: {
        args: ["cstring"],
        returns: "int",
    }
});

/** @internal */
export const libimage = dlopen(libImageImport.default, {
    IMG_Init: {
        args: ["int"],
        returns: "int",
    },
    IMG_Load: {
        args: ["cstring"],
        returns: "pointer",
    },
    IMG_LoadTexture: {
        args: ['pointer', 'cstring'],
        returns: 'pointer'
    }
});

/** @internal */
export const libttf = dlopen(libTTFImport.default, {
    TTF_Init: {
        returns: "int",
    },
    TTF_OpenFont: {
        args: ["cstring", "int"],
        returns: "pointer",
    },
    TTF_RenderText_Solid: {
        args: ["pointer", "cstring", "u32"],
        returns: "pointer",
    },
    TTF_SizeText: {
        args: ["pointer", "cstring", "pointer", "pointer"],
        returns: "int",
    },
    TTF_Quit: {
        returns: "void",
    },
    TTF_CloseFont: {
        args: ["pointer"],
        returns: "void",
    },
});

/** @internal */
export const libmixer = dlopen(libMixerImport.default, {
    Mix_OpenAudio: {
        args: ["int", "pointer", "int", "int"],
        returns: "int",
    },
    Mix_LoadMUS: {
        args: ["cstring"],
        returns: "pointer",
    },
    Mix_LoadWAV: {
        args: ["cstring"],
        returns: "pointer",
    },
    Mix_FreeMusic: {
        args: ["pointer"],
        returns: "void",
    },
    Mix_FreeChunk: {
        args: ["pointer"],
        returns: "void",
    },
    Mix_PlayChannel: {
        args: ["int", "pointer", "int"],
        returns: "int",
    },
});
