import { sdl } from "../ffi.ts";

/** @internal */
class Keyboard {

    public static keyMap = new Map<string, number>();

    private static decoder = new TextDecoder();

    private static convertToString(key: number) : string {
        const code = sdl.SDL_GetKeyFromScancode(key);
        const name = sdl.SDL_GetKeyName(code);
        const view = new Deno.UnsafePointerView(name!);
        return view.getCString().toLowerCase();
    }
    
    public static handleKeyStates() : void {
        // Handle keyboard events
        const keyStates = sdl.SDL_GetKeyboardState(null);
        const keyView = new Deno.UnsafePointerView(keyStates!);
        for (let i = 0; i < 256; i++) {
            const keyName = this.convertToString(i);

            if (keyView.getUint8(i) == 1) {
                const kmGet = this.keyMap.get(keyName);

                if (kmGet == undefined || kmGet == 0) {
                    this.keyMap.set(keyName, 1);
                } else if (kmGet == 1) {
                    this.keyMap.set(keyName, 2);
                }
            } else if (keyView.getUint8(i) == 0) {
                this.keyMap.set(keyName, 0);
            }

        }
    }

    public isPressed(key: keys) : boolean {
        const kmGet = Keyboard.keyMap.get(key);
        if (kmGet == 1) return true;
        return false;
    }

    public isDown(key: keys) : boolean {
        const kmGet = Keyboard.keyMap.get(key);
        if (kmGet == 1 || kmGet == 2) return true;
        return false;
    }
}

export type keys =
    | "a"
    | "b"
    | "c"
    | "d"
    | "e"
    | "f"
    | "g"
    | "h"
    | "i"
    | "j"
    | "k"
    | "l"
    | "m"
    | "n"
    | "o"
    | "p"
    | "q"
    | "r"
    | "s"
    | "t"
    | "u"
    | "v"
    | "w"
    | "x"
    | "y"
    | "z"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "0"
    | "space"
    | "tabspace"
    | "left shift"
    | "right shift"
    | "left ctrl"
    | "escape"
    | "backspace"
    | "."
    | "return";

export default Keyboard;