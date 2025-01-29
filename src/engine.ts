import { libsdl, libimage, libttf, libmixer } from "./ffi";
import Graphics from "./modules/graphics";

export function initSDL() {
    const initVideo = 0x00000020;
    const initAudio = 0x00000010;
    const baseInit = libsdl.symbols.SDL_Init(initVideo + initAudio);
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

export function initSDLMixer() {
    const mixInit = libmixer.symbols.Mix_OpenAudio(22050, null, 2, 4096);
    if (mixInit != 0) throw `SDL Audio failed to initialize`;
}

export function initLibraries(): void {
    initSDL();
	initSDLImage();
	initSDLTypeFont();
	initSDLMixer();
}
