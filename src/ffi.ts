import { exists } from "jsr:@std/fs/exists";
import { resolve } from 'jsr:@std/path';
import { logError } from "./utils.ts";

function onFailedSDLLoad(path: string) {
    logError("SDL failed to load");
    logError(`Expected location: ${path}`);
    Deno.exit();
}

function onFailedImageLoad(path: string) {
    logError("%cSDL Image failed to load", );
    logError(`Expected location: ${path}`);
    Deno.exit();
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
        const path = "C:\\Windows\\System32\\";
        const sdlDynamicLibraryExists = await exists(path+"SDL2.dll");
        if (!sdlDynamicLibraryExists) onFailedSDLLoad(resolve(path+"SDL2.dll"));

        simpleDirectMediaLayerLocation = path+"SDL2.dll";

        if (isCompiled) {
            simpleDirectMediaLayerLocation = "./SDL2.dll";
            if (!await exists(simpleDirectMediaLayerLocation)) onFailedSDLLoad(resolve(simpleDirectMediaLayerLocation));
        }

        const imageDynamicLibraryExists = await exists(path+"SDL2_image.dll");
        if (!imageDynamicLibraryExists) onFailedImageLoad(resolve(path+"SDL2_image.dll"));

        imageLibraryLocation = path+"SDL2_image.dll";

        if (isCompiled) {
            imageLibraryLocation = "./SDL2_image.dll";
            if (!await exists(imageLibraryLocation)) onFailedImageLoad(resolve(imageLibraryLocation));
        }
        
        break;
    }
    case "darwin": {
        const path = "/opt/homebrew/lib/";
        const sdlDynamicLibraryExists = await exists(path+"libSDL2.dylib");
        if (!sdlDynamicLibraryExists) onFailedSDLLoad(resolve(path+"libSDL2.dylib"));

        simpleDirectMediaLayerLocation = path+"libSDL2.dylib";

        // If build file is being called then load that
        if (isCompiled) {
            simpleDirectMediaLayerLocation = "../resources/libSDL2.dylib";
            if (!await exists(simpleDirectMediaLayerLocation)) onFailedSDLLoad(resolve(simpleDirectMediaLayerLocation));
        }

        const imageDynamicLibraryExists = await exists(path+"libSDL2_image.dylib");
        if (!imageDynamicLibraryExists) onFailedImageLoad(resolve(path+"libSDL2_image.dylib"));

        imageLibraryLocation = path+"libSDL2_image.dylib";

        if (isCompiled) {
            imageLibraryLocation = "../resources/libSDL2_image.dylib";
            if (!await exists(imageLibraryLocation)) onFailedImageLoad(resolve(imageLibraryLocation));
        }
        
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
    }
})

const imageLib = Deno.dlopen(imageLibraryLocation, {
    IMG_Init: {
        parameters: ['i32'], result: 'i32'
    }
})

export const sdl = baseLib.symbols;
export const sdlImage = imageLib.symbols;