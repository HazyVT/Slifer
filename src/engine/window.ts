import { type Pointer } from 'bun:ffi';
import Vector2 from './vector2';
import Image from './image';
import { libsdl } from '../ffi';

/** @internal */
export default class Window {

    public static pointer: Pointer;
	public static size: Vector2;
	
    private static centerPos = 0x2fff0000;

	

    public static createWindow(title: string, width: number, height: number) : void {
        const winPointer = libsdl.symbols.SDL_CreateWindow(
            Buffer.from(title + '\x00'),
            this.centerPos,
            this.centerPos,
            width,
            height,
            0
        );

        if (winPointer == null) throw `Window creation failed.`;
        this.pointer = winPointer;
        this.size = new Vector2(width, height);
    }

    public setTitle(title: string): void {
        libsdl.symbols.SDL_SetWindowTitle(
            Window.pointer,
            Buffer.from(title + "\x00")
        );
    }

    public setFullscreen(flag: boolean) {
        libsdl.symbols.SDL_SetWindowFullscreen(Window.pointer, Number(flag));
    }

    public setPosition(position: Vector2) {
        libsdl.symbols.SDL_SetWindowPosition(
            Window.pointer,
            position.x,
            position.y
        );
    }

    public centerWindow() {
        this.setPosition(new Vector2(Window.centerPos, Window.centerPos));
    }

    public setSize(width: number, height: number) {
    	libsdl.symbols.SDL_SetWindowSize(Window.pointer, width, height);
    }

    public setIcon(image: Image) {
    	libsdl.symbols.SDL_SetWindowIcon(Window.pointer, (image as any).pointer);
    }

}
