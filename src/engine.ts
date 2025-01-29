import { libsdl, libimage, libttf } from "./ffi";

//@ts-expect-error
const fontFile = await import("./Jost-Bold.ttf");

export function initSDL() {
    const baseInit = libsdl.symbols.SDL_Init(0x00000020);
    if (baseInit != 0) throw `SDL failed to initialize`;
}

export function initSDLImage() {
    const imageInit = libimage.symbols.IMG_Init(3);
    if (imageInit != 3) throw `SDL Image failed to initialize`;
}

export function initSDLTypeFont() {
    const ttfInit = libttf.symbols.TTF_Init();
    if (ttfInit != 0) throw `SDL TTF failed to initialize`;
}

export function initLibraries(): void {
    initSDL();
    initSDLImage();
    initSDLTypeFont();
}
