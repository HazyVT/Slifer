import { logError } from "./utils/logging.ts";
import { libs } from "./ffi.ts";
import Slifer from "./slifer.ts";

const encoder = new TextEncoder();
const center = 0x2FFF0000;


class Window {
    private title: string;
    private size: {width: number, height: number}
    private position: {x: number, y: number};
    private isFullscreen = false;
    private opacity = 0;

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
        this.size = {width: width, height: height}

        Slifer.window = winPointer;
        Slifer.renderer = renPointer;

        const xArr = new Uint32Array(1);
        const yArr = new Uint32Array(1);
        libs.SDL.SDL_GetWindowPosition(Slifer.window, Deno.UnsafePointer.of(xArr), Deno.UnsafePointer.of(yArr));

        this.position = {x: xArr[0], y: yArr[0]};
    }

    setTitle(title: string) : void{
        libs.SDL.SDL_SetWindowTitle(Slifer.window, encoder.encode(title+"\x00"));
        this.title = title;
    }

    getTitle() : string {
        return this.title;
    }

    setSize(width: number, height: number) : void {
        libs.SDL.SDL_SetWindowSize(Slifer.window, width, height);
        this.size = {width: width, height: height};
    }
    
    getSize() : { width: number, height: number } {
        return this.size;
    }

    setPosition(x: number, y: number) : void {
        libs.SDL.SDL_SetWindowPosition(Slifer.window, x, y);
        this.position = {x: x, y: y};
    }

    getPosition() : { x: number, y: number } {
        return this.position;
    }

    setFullscreen(flag: boolean) : void {
        libs.SDL.SDL_SetWindowFullscreen(Slifer.window, Number(flag));
        this.isFullscreen = true;
    }

    getIsFullscreen() : boolean {
        return this.isFullscreen;
    }

    setBorder(flag: boolean) : void {
        libs.SDL.SDL_SetWindowBordered(Slifer.window, flag);
    }

    setOpacity(opacity: number) : void {
        libs.SDL.SDL_SetWindowOpacity(Slifer.window, opacity);
        this.opacity = opacity;
    }

    getOpacity() : number {
        return this.opacity;
    }

    maximize() : void {
        libs.SDL.SDL_MaximizeWindow(Slifer.window);
    }

    minimize() : void {
        libs.SDL.SDL_MinimizeWindow(Slifer.window);
    }

    restore() : void {
        libs.SDL.SDL_RestoreWindow(Slifer.window);
    }





}

export default Window;