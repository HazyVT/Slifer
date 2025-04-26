import { Cursor } from "../engine.ts";
import { sdl } from "../ffi.ts";

enum buttonsEnum {
    LEFT = 1,
    MIDDLE,
    RIGHT = 4
}

/** @internal */
class Mouse {

    public static buttonMap : Map<string, boolean> = new Map([
        ["left", false],
        ["middle", false],
        ["right", false]
    ]);

    public static pressedButtonMap : Map<string, boolean> = new Map([
        ["left", false],
        ["middle", false],
        ["right", false]
    ]);

    public static mx : number;
    public static my: number;

    public static handleMouseState() {
        const xArr = new Uint32Array(1);
        const yArr = new Uint32Array(1);
        const mode = sdl.SDL_GetMouseState(Deno.UnsafePointer.of(xArr), Deno.UnsafePointer.of(yArr));

        this.buttonMap.set('left', Boolean(mode & buttonsEnum.LEFT));
        this.buttonMap.set('middle', Boolean(mode & buttonsEnum.MIDDLE));
        this.buttonMap.set('right', Boolean(mode & buttonsEnum.RIGHT));

        this.mx = xArr[0];
        this.my = yArr[0];
    }

    public isPressed(button: buttons) : boolean {
        const bmGet = Mouse.buttonMap.get(button);
        const pbmGet = Mouse.pressedButtonMap.get(button);

        if (bmGet && !pbmGet) {
            Mouse.pressedButtonMap.set(button, true);
            return true;
        } else if (!bmGet && pbmGet) {
            Mouse.pressedButtonMap.set(button, false);
        }

        return false;
    }

    public isDown(button: buttons) : boolean {
        const bmGet = Mouse.buttonMap.get(button);

        if (bmGet == undefined) return false;
        
        return bmGet;
    }

    public setCursor(cursor: Cursor) {
        sdl.SDL_SetCursor((cursor as any).pointer);
    }

    public getPosition() : { x: number, y: number} {
        return { x: Mouse.mx, y: Mouse.my }
    }
}

type buttons = 'left' | 'middle' | 'right';

export default Mouse;