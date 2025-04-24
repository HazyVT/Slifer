import { image, sdl } from "./ffi.ts";

const encoder = new TextEncoder();

/* @internal */
export class Window {
    public static pointer: Deno.PointerValue;

    public readonly width: number;
    public readonly height: number;

    constructor(w: number, h: number) {
    	this.width = w;
    	this.height = h;
    }

    public setFullscreen(flag: boolean) : void {
        sdl.SDL_SetWindowFullscreen(Window.pointer, Number(flag));
    }

    public setSize(width: number, height: number) : void {
    	sdl.SDL_SetWindowSize(Window.pointer, width, height);
    	(this.width as any) = width;
    	(this.height as any) = height;
        sdl.SDL_SetWindowPosition(Window.pointer, 0x2FFF0000, 0x2FFF0000);
    }

    public setResizable(flag: boolean) : void {
        sdl.SDL_SetWindowResizable(Window.pointer, Number(flag));
    }

    public setPosition(x: number, y: number) : void {
    	sdl.SDL_SetWindowPosition(Window.pointer, x, y);
    }

    public maximize() : void {
        sdl.SDL_MaximizeWindow(Window.pointer);
    }

    public minimize() : void {
        sdl.SDL_MinimizeWindow(Window.pointer);
    }

    public setTitle(title: string) : void {
        const titleArray = encoder.encode(title+"\x00");
        sdl.SDL_SetWindowTitle(Window.pointer, titleArray);
    }
    
}

/* @internal */
export class Renderer {
    public static pointer:  Deno.PointerValue;
}

export class Image {

    private readonly pointer : Deno.PointerValue;

    public readonly width: number;
    public readonly height: number;

    constructor(path: string) {
        const pathArray = encoder.encode(path+"\x00");
        const texPointer = image.IMG_LoadTexture(Renderer.pointer, pathArray);
        if (texPointer == null) throw `Image Load Failed: ${path}`;
        this.pointer = texPointer;

        const wArr = new Uint32Array(1);
        const hArr = new Uint32Array(1);
        sdl.SDL_QueryTexture(texPointer, null, null, Deno.UnsafePointer.of(wArr), Deno.UnsafePointer.of(hArr));

        this.width = wArr[0];
        this.height = hArr[0];
    }

    public close() {
        sdl.SDL_DestroyTexture(this.pointer);
    }

}

export class Color {
    readonly red;
    readonly green;
    readonly blue;
    readonly alpha;

    constructor(red: number, green: number, blue: number, alpha: number) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }
}

export class Cursor {
    private pointer : Deno.UnsafePointer;

    constructor(path: string) {
        const pathArray = encoder.encode(path+"\x00");
        const img = image.IMG_Load(pathArray);
        if (img == null) throw `Cursor Creation Load Failed`;

        const curPointer = sdl.SDL_CreateColorCursor(img, 0, 0);
        if (curPointer == null) throw `Cursor Creation Failed`;

        this.pointer = curPointer;
    }
}