import { libs } from "../ffi.ts";

class Keyboard {
    /**
     * -1 is equal to just released
     * 0 is equal to being up
     * 1 is equal to just pressed
     * 2 is equal to being down
     */
    private static keyMap: Map<string, -1 | 0 | 1 | 2> = new Map();

    public static handleKeyboard() : void {
        const keyboardState = libs.SDL.SDL_GetKeyboardState(null);
        const keyboardStateView = new Deno.UnsafePointerView(keyboardState!);

        const maxKeyCount = 70
        for (let i = 0; i < maxKeyCount; i++) {
            const code = libs.SDL.SDL_GetKeyFromScancode(i);
            const namePointer = libs.SDL.SDL_GetKeyName(code);
            const name = new Deno.UnsafePointerView(namePointer!).getCString().toLowerCase();

            const keyStateInMap = this.keyMap.get(name);

            // Key is being held down
            if (keyboardStateView.getUint8(i) == 1) {
                if (keyStateInMap == undefined || keyStateInMap == 0) {
                    this.keyMap.set(name, 1);
                } else if (keyStateInMap == 1) {
                    this.keyMap.set(name, 2);
                }
                continue
            }

            // Key has been released
            if (keyStateInMap == 1 || keyStateInMap == 2) {
                this.keyMap.set(name, -1);
            } else {
                this.keyMap.set(name, 0);
            }
        }
    } 

    public isKeyDown(key: Keys) : boolean {
        const keyStateInMap = Keyboard.keyMap.get(key);
        if (keyStateInMap == 1 || keyStateInMap == 2) {
            return true;
        }

        return false;
    }

    public isKeyPressed(key: Keys) : boolean {
        const keyStateInMap = Keyboard.keyMap.get(key);
        if (keyStateInMap == 1) return true;

        return false;
    }

    public isKeyReleased(key: Keys) : boolean{
        const keyStateInMap = Keyboard.keyMap.get(key);
        if (keyStateInMap == -1) return true;
        return false;
    }
}

export default Keyboard

type Keys =
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
