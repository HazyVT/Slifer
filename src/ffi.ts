/*
import { exists } from "@std/fs/exists";
import { dirname, join } from '@std/path';
import { logError } from "./utils.ts";

type SDLColor = { fields: {r: number, g: number, b: number, a: number }};
// Get working directory
export const execPath = dirname(Deno.execPath());

function onFailedLibraryLoad(fullPath: string) {
    logError(`Failed to load library: ${fullPath}`);
    Deno.exit();
}

async function loadDynamicLibrary(path: string, name: string, compiledPath: string) : Promise<string> {
    let libraryLocation = "";
    
    if (!await exists(path+name)) onFailedLibraryLoad(path+name);

    libraryLocation = path + name;
    
    if (isCompiled) {
        libraryLocation = join(execPath, compiledPath, name);

        if (!await exists(libraryLocation)) onFailedLibraryLoad(libraryLocation);
    }

    return libraryLocation;
    
}



// Check if program is running as compiled script
export let isCompiled = false;
if (Deno.mainModule.includes("deno-compile-main")) {
    isCompiled = true;
}

type Libraries = {
    //@ts-expect-error: Library type too long and is always changing
    "SDL": Deno.DynamicLibrary<unknown>,
    //@ts-ignore: Library type too long and is always changing
    "IMAGE": Deno.DynamicLibrary<unknown>
}



export async function loadLibraries() {
    // Load SDL2 libraries from expected location
    let simpleDirectMediaLayerLocation: string = "";
    let imageLibraryLocation: string = "";
    let ttfLibraryLocation: string = "";


    switch (Deno.build.os) {
        case "windows": {
            simpleDirectMediaLayerLocation = await loadDynamicLibrary(
                "C:\\Windows\\System32\\",
                "SDL2.dll",
                "./"
            );

            imageLibraryLocation = await loadDynamicLibrary(
                "C:\\Windows\\System32\\",
                "SDL2_image.dll",
                "./"
            );
            
            break;
        }
        case "darwin": {
            simpleDirectMediaLayerLocation = await loadDynamicLibrary(
                "/opt/homebrew/lib/",
                "libSDL2.dylib",
                "../Resources"
            )

            imageLibraryLocation = await loadDynamicLibrary(
                "/opt/homebrew/lib/",
                "libSDL2_image.dylib",
                "../Resources"
            )

            ttfLibraryLocation = await loadDynamicLibrary(
                "/opt/homebrew/lib/",
                "libSDL2_ttf.dylib",
                "../Resources"
            )

            
            break;
        }
        case "linux": {
            simpleDirectMediaLayerLocation = await loadDynamicLibrary(
                "/usr/lib/x86_64-linux-gnu/",
                "libSDL2.so",
                "./"
            );

            imageLibraryLocation = await loadDynamicLibrary(
                "/usr/lib/x86_64-linux-gnu/",
                "libSDL2_image.so",
                "./"
            )
            break;

        }
    }

    const baseLib = Deno.dlopen(simpleDirectMediaLayerLocation, {
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
        }
    })

    const imageLib = Deno.dlopen(imageLibraryLocation, {
        IMG_Init: {
            parameters: ['i32'], result: 'i32'
        },
        IMG_LoadTexture: {
            parameters: ['pointer', 'buffer'],
            result: 'pointer'
        }
    })

    const ttfLib = Deno.dlopen(ttfLibraryLocation, {
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
        }
    })

    return {"SDL": baseLib, "IMAGE": imageLib, "TTF": ttfLib};

}

const libs = await loadLibraries();
export const sdl = libs.SDL.symbols;
export const sdlImage = libs.IMAGE.symbols;
export const sdlFont = libs.TTF.symbols;

export function closeLibraries(libraries?: Libraries) : void {
    if (libraries) {
        libraries.SDL.close();    
        libraries.IMAGE.close();
    } else {
        libs.SDL.close();
        libs.IMAGE.close();
    }
}

*/

import { dirname, join } from "@std/path";
import { exists } from '@std/fs/exists'
import { logError, logWarning } from "./utils/logging.ts";

type OperatingSystem = "windows" | "linux" | "darwin";

function onLibraryLoadFail(path: string) {
    logError(`Failed to load library: ${path}`);
    Deno.exit();
}

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
    linux: isCompiled ? "./" : "/usr/lib/x86_64-gnu/",
    darwin: isCompiled ? "../Resources/" : "/opt/homebrew/lib/"
}[os]

const libSDLPath = join(isCompiled ? executePath : '', libraryLocation, librarySDLName);
if (!await exists(libSDLPath)) onLibraryLoadFail(libSDLPath);