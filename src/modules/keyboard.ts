import { libsdl } from "../ffi";
import { toArrayBuffer } from "bun:ffi";

/** @internal */
class Keyboard {
    static #instance: Keyboard;

    static keyState: DataView;
    static pressMap = new Map<string, number>();

    private constructor() {}

    public static get instance() {
        if (!Keyboard.#instance) {
            Keyboard.#instance = new Keyboard();
        }

        return Keyboard.#instance;
    }

    private static convertScancodeToKey(scancode: number): string {
        const keyFromScancode = libsdl.symbols.SDL_GetKeyFromScancode(scancode);
        const keyName = libsdl.symbols
            .SDL_GetKeyName(keyFromScancode)
            .toString();

        return keyName;
    }

    static getStates() {
        const state = libsdl.symbols.SDL_GetKeyboardState(null);
        if (state == null) return;
        const myArr = new DataView(toArrayBuffer(state, 0, 512));
        
        for (let i = 0; i < 512; ++i) {
            if (myArr.getUint8(i) == 1) {
                const keyName = this.convertScancodeToKey(i).toLowerCase();
                const kmGet = this.pressMap.get(keyName);
                if (kmGet == undefined || kmGet == 0) {
                    this.pressMap.set(keyName, 1);
                } else if (kmGet == 1) {
                    this.pressMap.set(keyName, 2);
                }
            } else if (myArr.getUint8(i) == 0) {
                const keyName = this.convertScancodeToKey(i).toLowerCase();
                this.pressMap.set(keyName, 0);
            }
        }
    }

    public isPressed(key: keys) {
        /*
        const scancode = libsdl.symbols.SDL_GetScancodeFromName(
            Buffer.from(key + "\x00")
        );
        const thisval = Keyboard.keyState.getUint8(scancode);
        */

        const kmGet = Keyboard.pressMap.get(key);
        if (kmGet == 1) {
            return true;
        }


        return false;
    }


    public isDown(key: keys) {
        const kmGet = Keyboard.pressMap.get(key);
        if (kmGet == 1 || kmGet == 2) {
            return true;
        }

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

/** @internal */
export default Keyboard;
