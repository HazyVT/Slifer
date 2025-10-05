import { libs } from "../ffi.ts";

class Mouse {

    /**
     * -1 is equal to just released.
     * 0 is equal to being up.
     * 1 is equal to just pressed.
     * 2 is equal to being down.
     */
    private static buttonMap: Map<string, -1 | 0 | 1 | 2> = new Map();

    public static handleMouse() : void {
        const mouseState = libs.SDL.SDL_GetMouseState(null, null);
        const mouseButtonDownStates = [];
        if (mouseState & 1) mouseButtonDownStates.push('left');
        if (mouseState & 2) mouseButtonDownStates.push('middle');
        if (mouseState & 4) mouseButtonDownStates.push('right'); 

        console.log(mouseButtonDownStates);

        for (const stateName in mouseButtonDownStates) {
            // User is pressing a button
            for (const [k, v] of this.buttonMap) {
                if (stateName == k) {
                    if (v == undefined || v == 0) {
                        this.buttonMap.set(k, 1);
                    } else if (v == 1) {
                        this.buttonMap.set(k, 2);
                    }
                } else {
                    if (v == undefined || v == -1) {
                        this.buttonMap.set(k, 0);
                    } else if (v > 0) {
                        this.buttonMap.set(k, -1);
                    }
                }
            }   
        }

             
    }

    public isMouseButtonDown(button: Buttons) : boolean {
        const buttonStateInMap = Mouse.buttonMap.get(button);
        if (buttonStateInMap == 1 || buttonStateInMap == 2) return true;

        return false;
    }

    public isMouseButtonPressed(button: Buttons) : boolean {
        const buttonStateInMap = Mouse.buttonMap.get(button);
        if (buttonStateInMap == 1) return true;

        return false;
    }

    public isMouseButtonReleased(button: Buttons) : boolean {
        const buttonStateInMap = Mouse.buttonMap.get(button);
        if (buttonStateInMap == -1) return true;

        return false;
    }

}

export default Mouse;

type Buttons = 
    | 'left'
    | 'middle'
    | 'right'