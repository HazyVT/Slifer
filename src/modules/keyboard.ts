import { libsdl } from "../ffi";
import { toArrayBuffer } from "bun:ffi";
/** @internal */
export default class Keyboard {

    public static keyMap = new Map<string, number>();

    private static convertScancodeToKey(scancode: number): string {
        const keyFromScancode = libsdl.symbols.SDL_GetKeyFromScancode(scancode);
        const keyName = libsdl.symbols
            .SDL_GetKeyName(keyFromScancode)
            .toString()
            .toLocaleLowerCase();

        return keyName;
    }

    public static handleStates() {
        const keyState = libsdl.symbols.SDL_GetKeyboardState(null);
        if (keyState == null) throw `Keyboard state returned null.`;
        const keyDV = new DataView(toArrayBuffer(keyState, 0, 512));
        for (let kn = 0; kn < 512; kn++) {
            if (keyDV.getUint8(kn) == 1) {
                const keyName = this.convertScancodeToKey(kn);
                const kmGet = this.keyMap.get(keyName);

                if (kmGet == undefined || kmGet == 0) {
                    this.keyMap.set(keyName, 1);
                } else if (kmGet == 1) {
                    this.keyMap.set(keyName, 2);
                }
            } else if (keyDV.getUint8(kn) == 0) {
                const keyName = this.convertScancodeToKey(kn);
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

type keys =
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
    | "caps lock"
    | "tab"
    | "left shift"
    | "right shift"
    | "left ctrl"
    | "escape";
