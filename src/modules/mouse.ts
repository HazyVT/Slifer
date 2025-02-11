import { libsdl } from "../ffi";
import { ptr } from "bun:ffi";
import Vector2 from "../engine/vector2";

/** @internal */
class Mouse {
    private static x: number;
    private static y: number;

    private static buttonMap = new Map<number, number>();

    static onRelease(button: number) {
        this.buttonMap.set(button, 0);
    }

    static onMove(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    static handleState() {
        const xArr = new Uint32Array(1);
        const yArr = new Uint32Array(1);
        const down = libsdl.symbols.SDL_GetMouseState(ptr(xArr), ptr(yArr));
        const bmGet = this.buttonMap.get(down);

        if (bmGet == undefined || bmGet == 0) {
            this.buttonMap.set(down, 1);
        } else if (bmGet == 1) {
            this.buttonMap.set(down, 2);
        }
    }

    private static getPressMap(button: number) {
        const bmGet = this.buttonMap.get(button);
        if (bmGet == 1) return true;
        return false;
    }

    private static getDownMap(button: number) {
        const bmGet = this.buttonMap.get(button);
        if (bmGet == 1 || bmGet == 2) return true;
        return false;
    }

    isPressed(button: buttons): boolean {
        switch (button) {
            case "left":
                return Mouse.getPressMap(1);
            case "middle":
                return Mouse.getPressMap(2);
            case "right":
                return Mouse.getPressMap(3);
        }
    }

    isDown(button: buttons): boolean {
        switch (button) {
            case "left":
                return Mouse.getDownMap(1);
            case "middle":
                return Mouse.getDownMap(2);
            case "right":
                return Mouse.getDownMap(3);
        }
    }

    getPosition(): Vector2 {
        return new Vector2(Mouse.x, Mouse.y);
    }
}

type buttons = "left" | "middle" | "right";

/** @internal */
export default Mouse;
