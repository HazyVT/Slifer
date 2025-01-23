import { libsdl, libimage, libttf } from "./ffi";
import Global from "./global";

//@ts-expect-error
const fontFile = await import("./Jost-Bold.ttf");

export function initLibraries(): void {
    const baseInit = libsdl.symbols.SDL_Init(0x00000020);
    if (baseInit != 0) throw `SDL failed to initialize`;

    const imageInit = libimage.symbols.IMG_Init(3);
    if (imageInit != 3) throw `SDL Image failed to initialize`;

    const ttfInit = libttf.symbols.TTF_Init();
    if (ttfInit != 0) throw `SDL TTF failed to initialize`;

    const tempFont = libttf.symbols.TTF_OpenFont(
        Buffer.from(fontFile.default),
        24
    );

    if (tempFont == null) throw `Default font loading failed`;
    Global.ptrFont = tempFont;
}
