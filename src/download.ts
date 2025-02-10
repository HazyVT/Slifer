import * as https from 'https';
import * as fs from 'fs';
import * as path from 'path';

const libDir = path.join(__dirname, '../libs/');

async function downloadLibrary(url: string, filename: string) {
    const response = await fetch(url);
    await Bun.write(libDir + filename, response);
    
    
}

if (process.platform == "darwin") {
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/libSDL2.dylib", "libSDL2.dylib");
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/libSDL2_image.dylib", "libSDL2_image.dylib");
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/libSDL2_mixer.dylib", "libSDL2_mixer.dylib");
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/libSDL2_ttf.dylib", "libSDL2_ttf.dylib");
} else if (process.platform == "win32") {
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/SDL2.dll", "SDL2.dll");
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/SDL2_image.dll", "SDL2_image.dll");
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/SDL2_mixer.dll", "SDL2_mixer.dll");
    downloadLibrary("https://github.com/HazyVT/Slifer/releases/download/Libraries/SDL2_ttf.dll", "SDL2_ttf");
}