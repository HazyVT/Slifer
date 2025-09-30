import { exists } from "@std/fs/exists";
import { resolve } from '@std/path';
import { logError } from "./utils.ts";

function onFailedLibraryLoad(fullPath: string) {
    logError(`Failed to load library: ${fullPath}`);
    Deno.exit();
}

async function loadDynamicLibrary(path: string, name: string, compiledPath: string) : Promise<string> {
    let libraryLocation = "";
    
    if (!await exists(path+name)) onFailedLibraryLoad(path+name);

    libraryLocation = path + name;
    
    if (isCompiled) {
        libraryLocation = compiledPath + name;

        if (!await exists(libraryLocation)) onFailedLibraryLoad(resolve(compiledPath+name));
    }

    return libraryLocation;
    
}


// Check if program is running as compiled script
let isCompiled = false;
if (Deno.mainModule.includes("deno-compile-main")) {
    isCompiled = true;
}


// Load SDL2 libraries from expected location
let simpleDirectMediaLayerLocation: string = "";
let imageLibraryLocation: string = "";


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
            "../resources/"
        )

        imageLibraryLocation = await loadDynamicLibrary(
            "/opt/homebrew/lib/",
            "libSDL2_image.dylib",
            "../resources"
        )
        break;
    }
    case "linux": {
        /*
        const path = "/usr/lib/x86_64-linux-gnu";
        const name = "libSDL2.so"
        if (!await exists(path+name)) onFailedSDLLoad(resolve(path+name));

        simpleDirectMediaLayerLocation = path + name;

        if (isCompiled) {
            simpleDirectMediaLayerLocation = "./" + name;

            if (!await exists(simpleDirectMediaLayerLocation)) onFailedSDLLoad(resolve(simpleDirectMediaLayerLocation));
        }
        */
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
    SDL_RWFromMem: {
        parameters: ['buffer', 'i32'],
        result: 'pointer'
    },
    SDL_RenderCopy: {
        parameters: ['pointer', 'pointer', 'pointer', 'pointer'],
        result: 'i32'
    },
    SDL_QueryTexture: {
        parameters: ['pointer', 'pointer', 'pointer', 'pointer', 'pointer'],
        result: 'i32'
    }
})

const imageLib = Deno.dlopen(imageLibraryLocation, {
    IMG_Init: {
        parameters: ['i32'], result: 'i32'
    },
    IMG_LoadTexture_RW: {
        parameters: ['pointer', 'pointer'],
        result: 'pointer'
    }
})

export const sdl = baseLib.symbols;
export const sdlImage = imageLib.symbols;