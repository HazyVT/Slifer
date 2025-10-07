import { dirname, join } from "@std/path";
import { exists } from '@std/fs/exists'
import { logError } from "./utils/logging.ts";

// Type of slifer supported operating systems
type OperatingSystem = "windows" | "linux" | "darwin";

/**
 * 
 * @param path - path to dynamic library that failed to load
 */
function onLibraryLoadFail(path: string) {
    logError(`Failed to load library: ${path}`);
    Deno.exit();
}

// Currently slifer only supports windows, macos and linux. All other operating systems are not supported
if (Deno.build.os != "windows" && Deno.build.os != "linux" && Deno.build.os != "darwin") {
    logError(`Unsupported operating system used: ${Deno.build.os}`);
    Deno.exit();
}

const os: OperatingSystem = Deno.build.os;
const isCompiled = Deno.mainModule.includes("deno-compile-main");
const executePath = dirname(Deno.execPath());

const librarySDLName = {
    windows: "SDL2.dll",
    darwin: "libSDL2.dylib",
    linux: "libSDL2.so",
}[os]

const libraryImageName = {
    windows: "SDL2_image.dll",
    darwin: "libSDL2_image.dylib",
    linux: "libSDL2_image.so"
}[os]

const libraryTrueTypeFontName = {
    windows: "SDL2_ttf.dll",
    darwin: "libSDL2_ttf.dylib",
    linux: "libSDL2_ttf.so"
}[os]

const libraryLocation = {
    windows: isCompiled ? "./" : "C:\\Windows\\System32\\",
    linux: isCompiled ? "./" : "/usr/lib/x86_64-linux-gnu/",
    darwin: isCompiled ? "../Resources/" : "/opt/homebrew/lib/"
}[os]

const libSDLPath = join(isCompiled ? executePath : '', libraryLocation, librarySDLName);
if (!await exists(libSDLPath)) onLibraryLoadFail(libSDLPath);

const libImagePath = join(isCompiled ? executePath : '', libraryLocation, libraryImageName);
if (!await exists(libImagePath)) onLibraryLoadFail(libImagePath);

const libTrueTypeFontPath = join(isCompiled ? executePath : '', libraryLocation, libraryTrueTypeFontName);
if (!await exists(libTrueTypeFontPath)) onLibraryLoadFail(libTrueTypeFontPath);

const baseLib = Deno.dlopen(libSDLPath, {
    SDL_Init: {
        parameters: ['i32'], result: 'i32'
    },
    SDL_CreateWindow: {
        parameters: ['buffer', 'i32', 'i32', 'i32', 'i32', 'i32'],
        result: 'pointer'
    },
    SDL_CreateRenderer: {
        parameters: ['pointer', 'i32', 'i32'],
        result: 'pointer'
    },
    SDL_PollEvent: {
        parameters: ['pointer'],
        result: 'i32'
    },
    SDL_RenderClear: {
        parameters: ['pointer'],
        result: 'i32'
    },
    SDL_SetRenderDrawColor: {
        parameters: ['pointer', 'i8', 'i8', 'i8', 'i8'],
        result: 'i32'
    },
    SDL_RenderPresent: {
        parameters: ['pointer'],
        result: 'i32'
    },
    SDL_GetKeyboardState: {
        parameters: ["pointer"],
        result: "pointer"
    },
    SDL_GetKeyFromScancode: {
        parameters: ["i32"],
        result: "i32"
    },
    SDL_GetKeyName: {
        parameters: ['i32'],
        result: 'pointer'
    },
    SDL_RenderCopy: {
        parameters: ['pointer', 'pointer', 'pointer', 'pointer'],
        result: 'i32'
    },
    SDL_QueryTexture: {
        parameters: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        result: 'i32'
    },
    SDL_SetTextureBlendMode: {
        parameters: ['pointer', 'i32'],
        result: 'i32'
    },
    SDL_SetTextureAlphaMod: {
        parameters: ['pointer', 'i8'],
        result: 'i32'
    },
    SDL_GetMouseState: {
        parameters: ['pointer', 'pointer'],
        result: 'i32'
    },
    SDL_SetTextureScaleMode: {
        parameters: ['pointer', 'i32'],
        result: 'i32'
    },
    SDL_CreateTextureFromSurface: {
        parameters: ['pointer', 'pointer'],
        result: 'pointer'
    },
    SDL_FreeSurface: {
        parameters: ['pointer'],
        result: 'void'
    },
    SDL_DestroyWindow: {
        parameters: ['pointer'],
        result: 'void'
    },
    SDL_DestroyRenderer: {
        parameters: ['pointer'],
        result: 'void'
    },
    SDL_DestroyTexture: {
        parameters: ['pointer'],
        result: 'void'
    }
})

const imageLib = Deno.dlopen(libImagePath, {
    IMG_Init: {
        parameters: ['i32'], result: 'i32'
    },
    IMG_LoadTexture: {
        parameters: ['pointer', 'buffer'],
        result: 'pointer'
    }
})

const ttfLib = Deno.dlopen(libTrueTypeFontPath, {
    TTF_Init: {
        parameters: [],
        result: 'i32'
    },
    TTF_OpenFont: {
        parameters: ['buffer', 'i32'],
        result: 'pointer'
    },
    TTF_RenderText_Solid: {
        parameters: ['pointer', 'buffer', 'u32'],
        result: 'pointer'
    },
    TTF_CloseFont: {
        parameters: ['pointer'],
        result: 'void'
    }
})

export function closeAllLibraries() {
    baseLib.close();
    imageLib.close();
    ttfLib.close();
}

export const libs = {
    "SDL": baseLib.symbols,
    "IMAGE": imageLib.symbols,
    "TTF": ttfLib.symbols
}