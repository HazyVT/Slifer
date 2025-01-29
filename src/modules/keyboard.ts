import { libsdl } from "../ffi";

/** @internal */
class Keyboard {
    static #instance: Keyboard;

    static downKeyMap = new Map<string, boolean>();
    static pressedKeyMap = new Map<string, boolean>();
    static releasedKeyMap = new Map<string, boolean>();

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

    static setKeyDown(key: number): void {
        const keyName = Keyboard.convertScancodeToKey(key);
        this.downKeyMap.set(keyName.toLowerCase(), true);
        this.releasedKeyMap.set(keyName.toLowerCase(), false);
    }

    static setKeyUp(key: number) {
        const keyName = Keyboard.convertScancodeToKey(key);
        this.downKeyMap.set(keyName.toLowerCase(), false);
        this.pressedKeyMap.set(keyName.toLowerCase(), false);
    }

    /**
     *
     * @param key string of key
     * @returns if the key is being held down
     */
    isDown(key: keys) {
        const _state = Keyboard.downKeyMap.get(key);
        if (_state == undefined) return false;

        return _state;
    }

    /**
     *
     * @param key string of key
     * @returns if key is pressed. Returns only once
     */
    isPressed(key: keys) {
        const _pressedState = Keyboard.pressedKeyMap.get(key);
        const _downState = Keyboard.downKeyMap.get(key);

        if (_downState == true) {
            if (_pressedState == false || _pressedState == undefined) {
                Keyboard.pressedKeyMap.set(key, true);
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @param key string of key
     * @returns if key is released. Returns only once
     */
    isReleased(key: keys) {
        const _releasedState = Keyboard.releasedKeyMap.get(key);
        const _downState = Keyboard.downKeyMap.get(key);

        if (_downState == false) {
            if (_releasedState == false || undefined) {
                Keyboard.releasedKeyMap.set(key, true);
                return true;
            }
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
