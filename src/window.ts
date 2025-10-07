import { logError } from "./utils/logging.ts";
import { libs } from "./ffi.ts";
import Slifer from "./slifer.ts";

const encoder = new TextEncoder();
const center = 0x2FFF0000;


class Window {
    readonly title: string;
    readonly width: number;
    readonly height: number;

    private onInitializeFail(name: string) {
        logError(`${name} has failed to initialize`);
        Deno.exit();
    }

    constructor(title: string, width: number, height: number) {
        if (width < 0 || height < 0) {
            logError("Width and height cannot be below 0");
            Deno.exit();
        }

        const audioFlag = 0x00000010;
        const videoFlag = 0x00000020;
        const controllerFlag = 0x00002000;

        if (libs.SDL.SDL_Init(audioFlag + videoFlag + controllerFlag) != 0) this.onInitializeFail("SDL")
        if (libs.IMAGE.IMG_Init(2) != 2) this.onInitializeFail("SDL Image");
        if (libs.TTF.TTF_Init() != 0) this.onInitializeFail("SDL TTF");

        const winPointer = libs.SDL.SDL_CreateWindow(
            encoder.encode(title+"\x00"),
            center, center,
            width, height,
            0
        );

        if (!winPointer) {
            logError("Failed to create window");
            Deno.exit();
        }

        const renPointer = libs.SDL.SDL_CreateRenderer(winPointer, -1, 0);

        if (!renPointer) {
            logError("Failed to create renderer");
            Deno.exit();
        }

        this.title = title;
        this.width = width;
        this.height = height;

        Slifer.window = winPointer;
        Slifer.renderer = renPointer;
    }
}

export default Window;