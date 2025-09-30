import { sdl, sdlImage} from "./ffi.ts";
import Slifer from './main.ts'

const encoder = new TextEncoder();
const center = 0x2FFF0000;

class Window {
    private title: string;
    private width: number;
    private height: number;
    
    constructor(title: string, width: number, height: number) {
        if (sdl.SDL_Init(0x00000020) != 0) {
            throw new Error("SDL failed to initialize");
        }

        if (sdlImage.IMG_Init(0x00000003) != 3) {
            throw new Error("SDL Image failed to initialize");
        }

        Slifer.log("Initialized successfully");
        
        this.title = title;
        this.width = width;
        this.height = height;

        const titleArray = encoder.encode(title);
        const windowPointer = sdl.SDL_CreateWindow(
            titleArray,
            center, center,
            width, height, 0
        )
        if (windowPointer == null) {
            throw new Error("Window creation failed");
        }

        Slifer.window = windowPointer;

        const rendererPointer = sdl.SDL_CreateRenderer(Slifer.window, -1, 0);
        if (rendererPointer == null) {
            throw new Error("Renderer creation failed");
        }

        Slifer.renderer = rendererPointer;

        Slifer.log(`Window created: Width: {${width}} Height: {${height}}`)
    }
}

export default Window;