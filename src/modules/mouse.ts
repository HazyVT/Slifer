import { libsdl } from "../ffi";
import { ptr } from "bun:ffi";
import Vector2 from "../engine/vector";

/** @internal */
class Mouse {
    static #instance: Mouse;

    static downKeyMap = new Map<string, boolean>();
    static pressedKeyMap = new Map<string, boolean>();
    static releasedKeyMap = new Map<string, boolean>();

    private constructor() {}

    public static get instance() {
        if (!Mouse.#instance) Mouse.#instance = new Mouse();

        return Mouse.#instance;
    }

    static setButtonDown(button: number) {
        let key: string = "";
        if (button == 1) {
            key = "left";
        } else if (button == 2) {
            key = "middle";
        } else {
            key = "right";
        }

        this.downKeyMap.set(key, true);
        this.releasedKeyMap.set(key, false);
    }

    static setButtonUp(button: number) {
        let key: string = "";
        if (button == 1) {
            key = "left";
        } else if (button == 2) {
            key = "middle";
        } else {
            key = "right";
        }

        this.downKeyMap.set(key, false);
        this.pressedKeyMap.set(key, false);
    }

    /**
     *
     * @param button string of button
     * @returns if the button is being held down
     */
    isDown(button: buttons) {
        const _state = Mouse.downKeyMap.get(button);
        if (_state == undefined) return false;

        return _state;
    }

    /**
     *
     * @param button string of button
     * @returns if button is pressed. Returns only once
     */
    isPressed(button: buttons) {
        const _pressedState = Mouse.pressedKeyMap.get(button);
        const _downState = Mouse.downKeyMap.get(button);

        if (_downState == true) {
            if (_pressedState == false || _pressedState == undefined) {
                Mouse.pressedKeyMap.set(button, true);
                return true;
            }
        }

        return false;
    }

    /**
     *
     * @param button string of button
     * @returns if button is released. Returns only once
     */
    isReleased(button: buttons) {
        const _releasedState = Mouse.releasedKeyMap.get(button);
        const _downState = Mouse.downKeyMap.get(button);

        if (_downState == false) {
            if (_releasedState == false || undefined) {
                Mouse.releasedKeyMap.set(button, true);
                return true;
            }
        }

        return false;
    }

    getPosition() {
        const xArr = new Uint32Array(1);
        const yArr = new Uint32Array(1);
        libsdl.symbols.SDL_GetMouseState(ptr(xArr), ptr(yArr));
        return new Vector2(xArr[0], yArr[0]);
    }
}

type buttons = "left" | "middle" | "right";

/** @internal */
export default Mouse;
